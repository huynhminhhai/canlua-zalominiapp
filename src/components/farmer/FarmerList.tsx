import { useGetNewsListNormal } from "apiRequest/news";
import { EmptyData } from "components/data";
import { ManagementItemSkeleton } from "components/skeleton";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react"
import { Box, Input, useSearchParams } from "zmp-ui";
import FarmerItem from "./FarmerItem";
import { FilterBar } from "components/table";
import FarmerCreateForm from "./FarmerCreateForm";
import { useGetPhienCanList } from "apiRequest/phienCan";

const FarmerList: React.FC<any> = () => {
    
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
    });
    const [param, setParam] = useState({
        page: 1,
        pageSize: 999,
        search: '',
    })

    const [searchParams] = useSearchParams();
    const nhomThuMuaId = searchParams.get("id");

    const { data, isLoading } = useGetPhienCanList(Number(nhomThuMuaId));

    const updateFilter = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const useDebouncedParam = (value: string, key: keyof typeof param) => {
        useEffect(() => {
            const handler = debounce((v: string) => {
                setParam(prev => ({ ...prev, [key]: v }))
            }, 300)

            handler(value)

            return () => handler.cancel()
        }, [value, key])
    }

    useDebouncedParam(filters.search, 'search');

    const renderContent = () => {
        if (isLoading) {
            return <Box><ManagementItemSkeleton count={5} /></Box>
        }

        if (!data?.result?.length) {
            return (
                <Box px={2}>
                    <EmptyData
                        title="Hiện chưa có nông dân nào!"
                        desc="Nhấn vào nút Thêm để bắt đầu!"
                    />
                </Box>
            );
        }

        return (
            <Box px={2} pt={3}>
                {data.result.map((item: any, index) => (
                    <FarmerItem key={index} data={item} />
                ))}
            </Box>
        )
    }


    return (
        <Box>
            <FilterBar
                showAddButton
                onAddButtonClick={() => setShowCreateForm(true)}
            >
                <div className="col-span-12">
                    <Input
                        placeholder="Tìm kiếm nông dân"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                    />
                </div>
            </FilterBar>
            {renderContent()}
            <FarmerCreateForm
                visible={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                nhomThuMuaId={Number(nhomThuMuaId)}
            />
        </Box>
    )
}

export default FarmerList