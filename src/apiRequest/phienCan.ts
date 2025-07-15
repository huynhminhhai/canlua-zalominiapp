import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "services/http";
import { useCustomSnackbar } from "utils/useCustomSnackbar";

type PhienCanQueryParams = {
    // page: number;
    // pageSize: number;
};

type PhienCanCreateParams = {
    id?: number;
    tenHoDan: string;
    donGia?: number;
    tienCoc?: number;
    truTapChat?: number;
    tienDaTra?: number;
    trangThai?: number;
    nhomThuMuaId: number;
}

const phienCanApiRequest = {
    getPhienCanById: async (id: number) => {
        return await http.get<any>(`/services/app/PhienCan/GetPhienCanByIdNhomThuMua?id=${id}`);
    },
    createPhienCan: async (formData: PhienCanCreateParams) => {
        return await http.post<any>("/services/app/PhienCan/CreatePhienCan", formData);
    },
    updatePhienCan: async (formData: any) => {
        return await http.put<any>("/services/app/PhienCan/UpdatePhienCan", formData);
    },
    deletePhienCan: async (id: number) => {
        return await http.delete<any>(`/services/app/PhienCan/DeletePhienCan?id=${id}`);
    }
}

export const useGetPhienCanList = (id: number) => {
    return useQuery({
        queryKey: ['phienCanList', id],
        queryFn: async () => {
            const res = await phienCanApiRequest.getPhienCanById(id);
            return res
        },
        staleTime: 0,
        retry: 1,
    });
};

export const useCreatePhienCan = () => {
    const { showSuccess, showError } = useCustomSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: PhienCanCreateParams) => {
            return await phienCanApiRequest.createPhienCan(formData);
        },
        onSuccess: (res) => {

            if (res?.result?.error !== 200) {
                
                showError(res?.result?.message);

                return;
            }

            showSuccess('Tạo thành công');

            queryClient.invalidateQueries({ queryKey: ["phienCanList"] });

        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};

export const useUpdatePhienCan = () => {
    const { showSuccess, showError } = useCustomSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            return await phienCanApiRequest.updatePhienCan(formData);
        },
        onSuccess: () => {
            showSuccess('Cập nhật thành công');

            queryClient.invalidateQueries({ queryKey: ["phienCanList"] });
        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};

export const useDeletePhienCan = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useCustomSnackbar();

    return useMutation({
        mutationFn: async (id: number) => {
            return await phienCanApiRequest.deletePhienCan(id);
        },
        onSuccess: () => {
            showSuccess('Xóa thành công');

            queryClient.invalidateQueries({ queryKey: ["phienCanList"] });
        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};