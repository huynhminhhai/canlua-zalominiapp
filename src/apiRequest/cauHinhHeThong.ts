import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "services/http";
import { useCustomSnackbar } from "utils/useCustomSnackbar";


const cauHinhHeThongApiRequest = {
    getCauHinhHeThong: async () => {
        return await http.get<any>(`/services/app/CauHinhHeThong/GetCauHinh`);
    },
    updateCauHinhHeThong: async (formData: any) => {
        return await http.put<any>("/services/app/CauHinhHeThong/UpdateCauHinh", formData);
    },
}

export const useGetCauHinhHeThong = () => {
    return useQuery({
        queryKey: ['cauHinhHeThong'],
        queryFn: async () => {
            const res = await cauHinhHeThongApiRequest.getCauHinhHeThong();
            return res
        },
        staleTime: 0,
        retry: 1,
    });
};

export const useUpdateCauHinhHeThong = () => {
    const { showSuccess, showError } = useCustomSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            return await cauHinhHeThongApiRequest.updateCauHinhHeThong(formData);
        },
        onSuccess: () => {
            showSuccess('Cập nhật thành công');

            queryClient.invalidateQueries({ queryKey: ["cauHinhHeThong"] });
        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};