import { EmptyData } from "components/data";
import { ManagementItemSkeleton } from "components/skeleton";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react"
import { Box, Input, useSearchParams } from "zmp-ui";
import FarmerItem from "./FarmerItem";
import { FilterBox, FilterButton } from "components/table";
import FarmerCreateForm from "./FarmerCreateForm";
import { useGetPhienCanList } from "apiRequest/phienCan";
import { useStoreApp } from "store/store";
import { Icon } from "@iconify/react";

const FarmerList: React.FC<any> = () => {

    const { account, setIsShowModalIsLogin } = useStoreApp();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showFilterForm, setShowFilterForm] = useState(false);
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

    const handleToggleCreate = () => {
        if (!account) {
            setIsShowModalIsLogin(true);
        } else {
            setShowCreateForm(true);
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return <Box><ManagementItemSkeleton count={5} /></Box>
        }

        if (!data?.result?.length) {
            return (
                <Box px={2}>
                    <EmptyData
                        title="Hiện chưa có hộ bán lúa nào!"
                        desc="Nhấn vào nút Thêm mới để bắt đầu!"
                        handleClick={() => handleToggleCreate()}
                        textBtn="Thêm mới"
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
            <Box flex alignItems="center" justifyContent="space-between" px={4} pt={6} pb={6}>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-heading-color">Danh sách hộ bán lúa</h2>
                    <Box flex alignItems="center" justifyContent="center" className="rounded-full bg-gradient-to-br from-heading-color to-primary-color -bg-color cursor-pointer z-20 w-8 h-8"
                        style={{
                            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
                        }}
                    >
                        <Icon icon={'basil:plus-outline'} fontSize={42} className="text-white" onClick={() => handleToggleCreate()} />
                    </Box>
                </div>
                <FilterButton onClick={() => setShowFilterForm(!showFilterForm)} showFilter={showFilterForm} />
            </Box>
            <FilterBox isOpen={showFilterForm}>
                <div className="col-span-12">
                    <Input
                        size="small"
                        placeholder="Tìm kiếm nhanh"
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                    />
                </div>
            </FilterBox>
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