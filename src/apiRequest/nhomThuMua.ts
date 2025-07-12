import { useQuery } from "@tanstack/react-query";
import http from "services/http";
import { buildQueryString } from "utils/handleApi";

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