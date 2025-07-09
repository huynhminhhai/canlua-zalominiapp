import React, { useEffect, useState } from "react"
import { Box, DatePicker, Input, useNavigate } from "zmp-ui"
import { debounce } from "lodash";
import { useGetMeetingList } from "apiRequest/meeting";
import { useInfiniteScroll } from "utils/useInfiniteScroll";
import { MeetingItemSkeleton } from "components/skeleton";
import { EmptyData } from "components/data";
import GroupItem from "./GroupItem";
import { FilterBar } from "components/table";
import { formatDate, parseDate } from "components/form/DatePicker";
import GroupCreateForm from "./GroupCreateForm";

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

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetMeetingList(param);

    const listData = data?.pages.reduce((acc, page) => [...acc, ...page], []) || [];

    const loaderRef = useInfiniteScroll({
        hasMore: hasNextPage,
        loading: isFetchingNextPage,
        onLoadMore: fetchNextPage,
    });

    const renderContent = () => {
        if (isLoading) {
            return <Box><MeetingItemSkeleton count={5} /></Box>
        }

        return (
            <Box px={3} pt={2}>
                <GroupItem />
                <GroupItem />
            </Box>
        )

        return <Box>
            <Box>
                {(listData.length === 0 && !isFetchingNextPage && !isLoading) ? (
                    <Box px={3}>
                        <EmptyData title="Hiện chưa có nhóm nào!" textBtn="Thêm nhóm" handleClick={() => navigate("/group-add")} />
                    </Box>
                ) : (
                    <>
                        <Box px={3}>
                            {listData.map((item: any, index) => (
                                <GroupItem key={index} data={item} />
                            ))}
                        </Box>
                    </>
                )}

            </Box>
            <div ref={loaderRef} className="px-4 pb-4">
                {isFetchingNextPage && <MeetingItemSkeleton count={1} />}
                {listData.length > 0 && !hasNextPage && <p className="text-center pt-4">Đã hiển thị tất cả</p>}
            </div>

        </Box>
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