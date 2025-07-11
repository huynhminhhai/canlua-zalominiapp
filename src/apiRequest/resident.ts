import http from "services/http";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "zmp-ui";
import { useCustomSnackbar } from "utils/useCustomSnackbar";
import { buildQueryString } from "utils/handleApi";

export type ResidentQueryParams = {
    page: number;
    pageSize: number;
    keyword?: string;
    ApId?: number;
    MaXa?: string;
    NguoiTao?: number;
    HoTen?: string;
    HoTenChuHo?: string;
    SoGiayTo?: string;
    LaChuHo?: boolean;
    TinhTrangHoGiaDinhId?: number;
    TinhTrangBaoHiemYTeId?: number;
};

const residentApiRequest = {
    getFamilyNumber: async () => {
        return await http.get<any>(`/dancu/soluonghogiadinh`);
    },
    getResidentNumber: async () => {
        return await http.get<any>(`/dancu/soluongdancu`);
    },
    getFamilyMembers: async (id: number) => {
        return await http.get<any>(`/dancu/thanhvienhogiadinh/${id}`);
    },
    getResidentDetail: async (id: number) => {
        return await http.get<any>(`/dancu/chitiet/${id}`);
    },
    getResidentCategory: async () => {
        return await http.get<any>(`/dancu/danhmuc`);
    },
    getResidentList: async (param: ResidentQueryParams) => {
        const queryString = buildQueryString({
            current: param.page,
            size: param.pageSize,
            ApId: param.ApId,
            MaXa: param.MaXa,
            NguoiTao: param.NguoiTao,
            TextSearch: param.keyword,
            HoTen: param.HoTen,
            HoTenChuHo: param.HoTenChuHo,
            SoGiayTo: param.SoGiayTo,
            LaChuHo: param.LaChuHo,
            TinhTrangHoGiaDinhId: param.TinhTrangHoGiaDinhId,
            TinhTrangBaoHiemYTeId: param.TinhTrangBaoHiemYTeId
        });

        return await http.get<any>(`/dancu${queryString}`);
    },
    getChuHosList: async () => {
        return await http.get<any>(`/dancu/chuhos`);
    },
    createResident: async (data: any) => {
        return await http.post<any>(`/dancu`, data);
    },
    deleteResident: async (id: number) => {
        return await http.delete<any>(`/dancu/${id}`);
    },
    updateResident: async (formData: any) => {
        return await http.put<any>(`/dancu`, formData);
    },
}

/**
* GET RESIDENT DATA
**/
export const useGetResidentData = () => {
    const [familyNumberQuery, residentNumberQuery] = useQueries({
        queries: [
            {
                queryKey: ["familyNumber"],
                queryFn: async () => {
                    const res = await residentApiRequest.getFamilyNumber();
                    return res.data;
                },
                staleTime: 0,
                refetchOnMount: true,
                refetchOnWindowFocus: true,
                retry: 1,
            },
            {
                queryKey: ["residentNumber"],
                queryFn: async () => {
                    const res = await residentApiRequest.getResidentNumber();
                    return res.data;
                },
                staleTime: 0,
                refetchOnMount: true,
                refetchOnWindowFocus: true,
                retry: 1,
            },
        ],
    });

    return { familyNumberQuery, residentNumberQuery };
};

/**
* GET FAMILY MEMBERS
**/
export const useGetFamilyMembers = (id: number) => {
    return useQuery({
        queryKey: ["familyMembers", id],
        queryFn: async () => {
            try {
                const res = await residentApiRequest.getFamilyMembers(id);
                return res.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thành viên hộ gia đình:", error);
                throw error;
            }
        },
        enabled: !!id,
        staleTime: 0,
        retry: 1,
    });
};

/**
* GET RESIDENT DETAIL
**/
export const useGetResidentDetail = (id: number) => {
    return useQuery({
        queryKey: ["residentDetail", id],
        queryFn: async () => {
            try {
                const res = await residentApiRequest.getResidentDetail(id);
                return res.data;
            } catch (error) {
                console.error("Lỗi khi lấy thông tin thành viên hộ gia đình:", error);
                throw error;
            }
        },
        enabled: !!id,
        staleTime: 0,
        retry: 1,
    });
};

/**
* GET RESIDENT CATEGORY
**/
export const useGetResidentCategory = () => {
    return useQuery({
        queryKey: ["residentCategory"],
        queryFn: async () => {
            try {
                const res = await residentApiRequest.getResidentCategory();
                return res.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh mục thành viên hộ gia đình:", error);
                throw error;
            }
        },
        staleTime: 0,
        retry: 1,
    });
};

/**
* GET RESIDENT LIST
**/
export const useGetResidentListNormal = (param: ResidentQueryParams) => {
    return useQuery({
        queryKey: ['residentList', param],
        queryFn: async () => {
            try {
                const res = await residentApiRequest.getResidentList(param);
                return res
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thành viên hộ gia đình:", error);
                throw error;
            }
        },
        staleTime: 0,
        retry: 1,
    });
};

/**
* GET CHU HO LIST
**/
export const useGetChuHosList = () => {
    return useQuery({
        queryKey: ['chuhosList'],
        queryFn: async () => {
            try {
                const res = await residentApiRequest.getChuHosList();

                return res.data
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thành viên hộ gia đình:", error);
                throw error;
            }
        },
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        retry: 1,
    });
};

/**
* POST RESIDENT
**/
export const useCreateResident = () => {
    const { showSuccess, showError } = useCustomSnackbar();
    const queryClient = useQueryClient();
    const navigator = useNavigate();

    return useMutation({
        mutationFn: async (formData: any) => {
            return await residentApiRequest.createResident(formData);
        },
        onSuccess: () => {
            showSuccess('Tạo thành viên hộ gia đình thành công');

            queryClient.invalidateQueries({ queryKey: ["residentList"] });
            queryClient.invalidateQueries({ queryKey: ["chuhosList"] });
            queryClient.invalidateQueries({ queryKey: ["familyMembers"] });

            navigator('/resident-management');
        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};

/**
* DELETE RESIDENT
**/
export const useDeleteResident = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useCustomSnackbar();

    return useMutation({
        mutationFn: async (id: number) => {
            return await residentApiRequest.deleteResident(id);
        },
        onSuccess: () => {
            showSuccess('Xóa thành viên hộ gia đình thành công');

            queryClient.invalidateQueries({ queryKey: ["residentList"] });
        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};

/**
* PUT RESIDENT
**/
export const useUpdateResident = () => {
    const { showSuccess, showError } = useCustomSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            return await residentApiRequest.updateResident(formData);
        },
        onSuccess: () => {
            showSuccess('Cập nhật thông tin thành viên hộ gia đình thành công');

            queryClient.invalidateQueries({ queryKey: ["residentDetail"] });
            queryClient.invalidateQueries({ queryKey: ["residentList"] });
            queryClient.invalidateQueries({ queryKey: ["chuhosList"] });
            queryClient.invalidateQueries({ queryKey: ["familyMembers"] });
        },
        onError: (error: string) => {
            console.error(`Lỗi: ${error}`)
            showError(error)
        },
    });
};