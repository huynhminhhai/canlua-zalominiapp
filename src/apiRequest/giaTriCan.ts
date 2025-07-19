import { useMutation, useQuery } from "@tanstack/react-query";
import http from "services/http";

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

    return useMutation({
        mutationFn: async (formData: GiaTriCanCreateParam) => {
            return await giaTriCanApiRequest.createGiaTriCan(formData);
        },
        onSuccess: () => {

        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
        },
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000)
    });
};