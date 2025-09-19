import React, { useEffect, useState } from "react"
import { Box, DatePicker, Input } from "zmp-ui"
import { debounce } from "lodash";
import { MeetingItemSkeleton } from "components/skeleton";
import { EmptyData } from "components/data";
import GroupItem from "./GroupItem";
import GroupCreateForm from "./GroupCreateForm";
import { useGetNhomThuMuaList } from "apiRequest/nhomThuMua";
import { useStoreApp } from "store/store";
import { FilterBox, FilterButton } from "components/table";
import { Icon } from "@iconify/react";
import { formatDate, parseDate } from "components/form/DatePicker";

const GroupList: React.FC<any> = () => {

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
        tuNgay: '',
        denNgay: '',
    });

    const { data, isLoading } = useGetNhomThuMuaList(param);

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
            return <Box><MeetingItemSkeleton count={5} /></Box>
        }

        if (!data?.result?.length) {
            return (
                <Box px={4}>
                    <EmptyData
                        title="Hiện chưa có nhóm thu mua nào!"
                        desc="Nhấn vào nút Thêm mới để bắt đầu!"
                        handleClick={() => handleToggleCreate()}
                        textBtn="Thêm mới"
                    />
                </Box>
            );
        }

        return (
            <Box px={2}>
                {data.result.map((item: any, index) => (
                    <GroupItem key={index} data={item} />
                ))}
            </Box>
        )
    };

    return (
        <Box className="rounded-2xl !-mt-4 bg-[#f0f3fb]">
            <Box flex alignItems="center" justifyContent="space-between" px={4} pt={6} pb={6}>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-heading-color">Danh sách nhóm</h2>
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
                        placeholder="Tìm kiếm nhóm"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                    />
                </div>
                <div className="col-span-6">
                    <DatePicker
                        placeholder="Từ ngày"
                        mask
                        maskClosable
                        value={parseDate(param.tuNgay)}
                        onChange={(e) => setParam((prev) => ({ ...prev, tuNgay: formatDate(e) }))}
                    />
                </div>
                <div className="col-span-6">
                    <DatePicker
                        placeholder="Đến ngày"
                        mask
                        maskClosable
                        value={parseDate(param.denNgay)}
                        onChange={(e) => setParam((prev) => ({ ...prev, denNgay: formatDate(e) }))}
                    />
                </div>
            </FilterBox>
            {renderContent()}
            <GroupCreateForm
                visible={showCreateForm}
                onClose={() => setShowCreateForm(false)}
            />
        </Box>
    )
}

export default GroupList