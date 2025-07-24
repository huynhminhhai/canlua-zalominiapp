import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "services/http";
import { buildQueryString } from "utils/handleApi";
import { useCustomSnackbar } from "utils/useCustomSnackbar";

type GoiSuDungQueryParams = {
    // page: number;
    // pageSize: number;
};


type DangKyGoiSuDungType = {
    goiSuDungId: Number;
}

const goiSuDungApiRequest = {
    getGoiSuDung: async (param: GoiSuDungQueryParams) => {

        const queryString = buildQueryString({
        });

        return await http.get<any>(`/services/app/GoiSuDung/GetAllGoiSuDung${queryString}`);
    },
    getGoiDangKyMoiNhat: async () => {
        return await http.get<any>(`/services/app/DangKyGoiSuDung/GetLatestByCurrentUser`);
    },
    getGoiSuDungById: async (id: Number) => {

        return await http.get<any>(`/services/app/GoiSuDung/GetGoiSuDungById?id=${id}`);
    },
    dangKyGoiSuDung: async (param: DangKyGoiSuDungType) => {
        return await http.post<any>(`/services/app/DangKyGoiSuDung/Create`, param);
    },
    getLichSuThanhToan: async () => {
        return await http.get<any>(`/services/app/LichSuThanhToan/GetAllLichSuThanhToan`);
    }
}

export const useGetLichSuThanhToan = () => {
    return useQuery({
        queryKey: ['lichSuThanhToan'],
        queryFn: async () => {
            const res = await goiSuDungApiRequest.getLichSuThanhToan();
            return res
        },
        staleTime: 0,
        retry: 1,
    });
}

export const useGetGoiSuDungList = (param: GoiSuDungQueryParams) => {
    return useQuery({
        queryKey: ['goiSuDungList', param],
        queryFn: async () => {
            const res = await goiSuDungApiRequest.getGoiSuDung(param);
            return res
        },
        staleTime: 0,
        retry: 1,
    });
};

export const useGetGoiSuDungById = (id: Number) => {
    return useQuery({
        queryKey: ['goiSuDung', id],
        queryFn: async () => {
            const res = await goiSuDungApiRequest.getGoiSuDungById(id);
            return res
        },
        enabled: !!id,
        staleTime: 0,
        retry: 1,
    });
};

export const useGetGoiDangKyMoiNhat = () => {
    return useQuery({
        queryKey: ['goiDangKyMoiNhat'],
        queryFn: async () => {
            const res = await goiSuDungApiRequest.getGoiDangKyMoiNhat();
            return res
        },
        staleTime: 0,
        retry: 1,
    });
};

export const useDangKyGoiSuDung = () => {
    const { showError } = useCustomSnackbar();

    return useMutation({
        mutationFn: async (formData: DangKyGoiSuDungType) => {
            return await goiSuDungApiRequest.dangKyGoiSuDung(formData);
        },
        onSuccess: (res) => {

            return res

        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};