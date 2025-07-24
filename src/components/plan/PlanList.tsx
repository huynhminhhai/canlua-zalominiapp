import { EmptyData } from "components/data";
import { ManagementItemSkeleton } from "components/skeleton";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react"
import { Box, Input } from "zmp-ui";
import { FilterBar2 } from "components/table";
import { useGetLichSuThanhToan } from "apiRequest/goiSuDung";
import PlanItem from "./PlanItem";

const PlanList: React.FC<any> = () => {
    
    const [filters, setFilters] = useState({
        search: "",
    });
    const [param, setParam] = useState({
        page: 1,
        pageSize: 999,
        search: '',
    })

    const { data, isLoading } = useGetLichSuThanhToan();

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
                        title="Hiện chưa có nâng cấp nào!"
                    />
                </Box>
            );
        }

        return (
            <Box px={2} pt={3}>
                {data.result.map((item: any, index) => (
                    <PlanItem key={index} data={item} />
                ))}
            </Box>
        )
    }


    return (
        <Box>
            {/* <FilterBar2
                showFilter={true}
                onFilterToggle={() => { }}
                searchComponent={
                    <div className="col-span-12">
                        <Input
                            placeholder="Tìm kiếm nhanh"
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                        />
                    </div>
                }
            >
            </FilterBar2> */}
            {renderContent()}
        </Box>
    )
}

export default PlanList