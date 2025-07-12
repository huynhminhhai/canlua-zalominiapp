import React, { useEffect, useState } from "react"
import { Box, DatePicker, Input, useNavigate } from "zmp-ui"
import { debounce } from "lodash";
import { MeetingItemSkeleton } from "components/skeleton";
import { EmptyData } from "components/data";
import GroupItem from "./GroupItem";
import { FilterBar } from "components/table";
import { formatDate, parseDate } from "components/form/DatePicker";
import GroupCreateForm from "./GroupCreateForm";
import { useGetNhomThuMuaList } from "apiRequest/nhomThuMua";

const GroupList: React.FC<any> = () => {

    const navigate = useNavigate();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
    });
    const [param, setParam] = useState({
        page: 1,
        pageSize: 5,
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

    const renderContent = () => {

        if (isLoading) {
            return <Box><MeetingItemSkeleton count={5} /></Box>
        }

        if (!data?.result?.length) {
            return (
                <Box px={4}>
                    <EmptyData
                        title="Hiện chưa có nhóm thu mua nào!"
                        desc="Nhấn vào nút Thêm để bắt đầu!"
                    />
                </Box>
            );
        }

        return (
            <Box px={3} pt={3}>
                {data.result.map((item: any, index) => (
                    <GroupItem key={index} data={item} />
                ))}
            </Box>
        )
    };


    return (
        <Box>
            <FilterBar
                showAddButton
                onAddButtonClick={() => setShowCreateForm(true)}
            >
                <div className="col-span-12">
                    <Input
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
            </FilterBar>
            {renderContent()}
            <GroupCreateForm
                visible={showCreateForm}
                onClose={() => setShowCreateForm(false)}
            />
        </Box>
    )
}

export default GroupList