import envConfig from "envConfig";
import { getDataFromStorage } from "./zalo";

const request = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: any,
    isFormData: boolean = false
): Promise<T> => {

    // const fullUrl = `/api${url}`;
    const fullUrl = `${envConfig.API_ENDPOINT}${url}`;

    const storedData = await getDataFromStorage(["accessToken"]);
    const accessToken = storedData?.accessToken || null;

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
        body: isFormData ? body : JSON.stringify(body),
    };

    try {
        const response = await fetch(fullUrl, options);
        const data: T = await response.json();

        if (!response.ok) {
            const errorMessage = (data as any)?.message || 'Lỗi không xác định (request)';

            if (response.status === 401) {
                // removeDataFromStorage(['account', 'accessToken', 'refreshToken']);
                // window.location.href = '/login';
                throw new Error('Bạn không có quyền truy cập (request)');
            }

            if (response.status === 500) {
                throw new Error(errorMessage);
            }

            throw new Error(errorMessage);
        }

        return data;
    } catch (error: any) {
        // Nếu error là object có .message thì hiển thị, nếu không thì stringify
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