import { useMutation, useQuery } from "@tanstack/react-query";
import http from "services/http";
import { useCustomSnackbar } from "utils/useCustomSnackbar";

export type GiaTriCanCreateParam = {
    phienCanId?: number;
    trongLuong: number;
    viTriTrang: number;
    viTriBang: number;
    viTriCot: number;
    viTriDong: number;
}

const giaTriCanApiRequest = {
    getGiaTriCanById: async (id: number) => {
        return await http.get<any>(`/services/app/GiaTriCan/GetWeighingGrid?phienCanId=${id}`);
    },
    createGiaTriCan: async (formData: GiaTriCanCreateParam) => {
        return await http.post<any>("/services/app/GiaTriCan/Create", formData);
    },
}

export const useGetGiaTriCanList = (id: number) => {
    return useQuery({
        queryKey: ['giaTriCanList', id],
        queryFn: async () => {
            const res = await giaTriCanApiRequest.getGiaTriCanById(id);
            return res
        },
        staleTime: 0,
        retry: 1,
    });
};

export const useCreateGiaTriCan = () => {
    // const { showError } = useCustomSnackbar();

    return useMutation({
        mutationFn: async (formData: GiaTriCanCreateParam) => {
            return await giaTriCanApiRequest.createGiaTriCan(formData);
        },
        onSuccess: (res) => {

            // if (res?.result?.error !== 200) {
                
            //     showError(res?.result?.message);

            //     return;
            // }

            // queryClient.invalidateQueries({ queryKey: ["phienCanList"] });

        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            // showError(error)
        },
    });
};