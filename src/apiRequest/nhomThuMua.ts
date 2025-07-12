import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "services/http";
import { buildQueryString } from "utils/handleApi";
import { useCustomSnackbar } from "utils/useCustomSnackbar";

type NhomThuMuaQueryParams = {
    // page: number;
    // pageSize: number;
};

const nhomThuMuaApiRequest = {
    getNhomThuMuaList: async (param: NhomThuMuaQueryParams) => {

        const queryString = buildQueryString({
        });

        return await http.get<any>(`/services/app/NhomThuMua/GetNhomThuMua${queryString}`);
    },
    createNhomThuMua: async (param: any) => {
        return await http.post<any>(`/services/app/NhomThuMua/CreateNhomThuMua`, param);
    },
    updateNhomThuMua: async (formData: any) => {
        return await http.put<any>("/services/app/NhomThuMua/UpdateNhomThuMua", formData);
    },
    deleteNhomThuMua: async (id: number) => {
        return await http.delete<any>(`/services/app/NhomThuMua/DeleteNhomThuMua?id=${id}`);
    }
}

export const useGetNhomThuMuaList = (param: NhomThuMuaQueryParams) => {
    return useQuery({
        queryKey: ['nhomThuMuaList', param],
        queryFn: async () => {
            const res = await nhomThuMuaApiRequest.getNhomThuMuaList(param);
            return res
        },
        staleTime: 0,
        retry: 1,
    });
};

export const useCreateNhomThuMua = () => {
    const { showSuccess, showError } = useCustomSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            return await nhomThuMuaApiRequest.createNhomThuMua(formData);
        },
        onSuccess: (res) => {

            if (res?.result?.error !== 200) {
                
                showError(res?.result?.message);

                return;
            }

            showSuccess('Tạo thành công');

            queryClient.invalidateQueries({ queryKey: ["nhomThuMuaList"] });

        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};

export const useUpdateNhomThuMua = () => {
    const { showSuccess, showError } = useCustomSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            return await nhomThuMuaApiRequest.updateNhomThuMua(formData);
        },
        onSuccess: () => {
            showSuccess('Cập nhật thành công');

            queryClient.invalidateQueries({ queryKey: ["nhomThuMuaList"] });
        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};

export const useDeleteNhomThuMua = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useCustomSnackbar();

    return useMutation({
        mutationFn: async (id: number) => {
            return await nhomThuMuaApiRequest.deleteNhomThuMua(id);
        },
        onSuccess: () => {
            showSuccess('Xóa thành công');

            queryClient.invalidateQueries({ queryKey: ["nhomThuMuaList"] });
        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};