import { useGetNewsListNormal } from "apiRequest/news";
import { EmptyData } from "components/data";
import { ManagementItemSkeleton } from "components/skeleton";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react"
import { Box, Input } from "zmp-ui";
import FarmerItem from "./FarmerItem";
import { FilterBar } from "components/table";
import FarmerCreateForm from "./FarmerCreateForm";

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

    const { data, isLoading } = useGetNewsListNormal(param);

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

        if (!data?.data?.length) {
            return (
                <Box px={4}>
                    <EmptyData
                        title="Hiện chưa có nông dân nào!"
                        desc="Nhấn vào nút Thêm để bắt đầu!"
                    />
                </Box>
            );
        }

        // return (
        //     <Box pt={4}>
        //         <FarmerItem />
        //         <FarmerItem />
        //     </Box>
        // )

        return (
            <Box px={3}>
                {data.data.map((item: any, index) => (
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
            />
        </Box>
    )
}

export default FarmerList