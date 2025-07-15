import { useQuery } from "@tanstack/react-query";
import http from "services/http";

type PhienCanQueryParams = {
    // page: number;
    // pageSize: number;
};

const phienCanApiRequest = {
    getPhienCanById: async (id: number) => {
        return await http.get<any>(`/services/app/PhienCan/GetPhienCanByIdNhomThuMua?id=${id}`);
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

