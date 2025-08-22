import envConfig from "envConfig";
import { getDataFromStorage, removeDataFromStorage, setDataToStorage } from "./zalo";
import { logoutDirectly } from "apiRequest/auth";
import { getExpiresAt } from "utils/date";

const request = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: any,
    isFormData: boolean = false,
    retry: boolean = true // flag để tránh lặp vô hạn
): Promise<T> => {

    const fullUrl = `${envConfig.API_ENDPOINT}${url}`;

    const storedData = await getDataFromStorage(["account"]);
    let storedAccount = storedData?.account ? JSON.parse(storedData.account) : null;
    let accessToken = storedAccount?.accessToken || null;
    let refreshToken = storedAccount?.refreshToken || null;

    const headers: HeadersInit = isFormData
        ? (accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        : {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        };

    const options: RequestInit = {
        method,
        headers,
        body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    };

    try {
        const response = await fetch(fullUrl, options);
        const data: T = await response.json();

        if (!response.ok) {
            if (response.status === 401) {

                if (refreshToken && retry) {
                    try {
                        const refreshResponse = await fetch(`${envConfig.API_ENDPOINT}/TokenAuth/RefreshToken`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ refreshToken }),
                        });

                        if (!refreshResponse.ok) {
                            throw new Error("Refresh token failed");
                        }

                        const refreshData = await refreshResponse.json();

                        await setDataToStorage({ account: JSON.stringify({...refreshData?.result, expiresAt: getExpiresAt(refreshData?.result?.expireInSeconds)}) });

                        // Retry request cũ với accessToken mới
                        return await request<T>(method, url, body, isFormData, false);
                    } catch (refreshError) {
                        logoutDirectly();
                        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
                    }
                } else {
                    // 🚀 Nếu không có refreshToken => logout ngay
                    logoutDirectly();
                    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
                }
            }

            const errorMessage = (data as any)?.message || 'Lỗi không xác định (request)';
            throw new Error(errorMessage);
        }


        return data;
    } catch (error: any) {
        const message = error?.message || JSON.stringify(error);
        throw new Error(message);
    }
};

const http = {
    get: <T>(url: string) => request<T>('GET', url),
    post: <T>(url: string, body: any) => request<T>('POST', url, body),
    put: <T>(url: string, body: any) => request<T>('PUT', url, body),
    delete: <T>(url: string) => request<T>('DELETE', url),
    postFormData: <T>(url: string, formData: FormData) => request<T>('POST', url, formData, true),
    putFormData: <T>(url: string, formData: FormData) => request<T>('PUT', url, formData, true),
};

export default http;