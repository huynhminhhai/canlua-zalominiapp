import http from 'services/http';
import { useMutation } from '@tanstack/react-query';
import { useStoreApp } from 'store/store';
import { useNavigate } from 'zmp-ui';
import envConfig from 'envConfig';
import { useCustomSnackbar } from 'utils/useCustomSnackbar';
import { getExpiresAt } from 'utils/date';
import { removeDataFromStorage } from 'services/zalo';

export const authApiRequest = {
    login: async (username: string, password: string) => {
        const response = await http.post('/TokenAuth/Authenticate', { userNameOrEmailAddress: username, password: password });

        return response;
    },
    loginZalo: async (token: string, userAccessToken: string) => {
        const response = await http.post('/TokenAuth/AuthenZalo', {
            accessToken: userAccessToken,
            token,
            secretKey: envConfig.SECRECT_KEY
        });

        return response;
    },
    refreshToken: async (refreshToken: string) => {
        const response = await http.post(`/TokenAuth/RefreshToken`, {refreshToken});

        return (response as any)?.result;
    },
    logout: async () => {
        const response = await http.get('/TokenAuth/LogOut');

        return response;
    },
}

export const logoutDirectly = () => {
  removeDataFromStorage(["account"]);
  useStoreApp.getState().setAccount(null);
};

export const useLogin = () => {
    const { setAccount } = useStoreApp();
    const { showSuccess, showError } = useCustomSnackbar();

    return useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            return authApiRequest.login(credentials.username, credentials.password);
        },
        onSuccess: async (res: any) => {

            showSuccess('Đăng nhập thành công');

            setAccount({...res?.result, expiresAt: getExpiresAt(res?.result?.expireInSeconds)});
        },
        onError: (error: any) => {
            console.error('Lỗi:', error);
            showError(error?.message);
        },
    });
};

export const useLoginZalo = () => {
    const { showSuccess, showError } = useCustomSnackbar();
    const { setAccount } = useStoreApp();

    return useMutation({
        mutationFn: async (credentials: { token: string, userAccessToken: string }) => {
            return authApiRequest.loginZalo(credentials.token, credentials.userAccessToken);
        },
        onSuccess: async (res: any) => {

            showSuccess('Đăng nhập thành công');

            setAccount({...res?.result, expiresAt: getExpiresAt(res?.result?.expireInSeconds)});
        },
        onError: (error: string) => {
            console.error('Lỗi:', error);
            showError(error);
        },
    });
};

export const useLogout = () => {
    const { clearAuth } = useStoreApp();
    const navigate = useNavigate();
    const { showSuccess, showError } = useCustomSnackbar();

    const logout = async () => {
        try {
            // await authApiRequest.logout();
            clearAuth();

            showSuccess('Đăng xuất thành công')

            navigate('/');
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
            showError('Đăng xuất thất bại, vui lòng thử lại!')
        }
    };

    return logout;
};