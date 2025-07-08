import React, { useEffect, useState } from "react"
import { Box, DatePicker, Input, useNavigate } from "zmp-ui"
import { debounce } from "lodash";
import { useGetMeetingList } from "apiRequest/meeting";
import { useInfiniteScroll } from "utils/useInfiniteScroll";
import { MeetingItemSkeleton } from "components/skeleton";
import { EmptyData } from "components/data";
import GroupItem from "./GroupItem";
import { FilterBar, FilterBar2 } from "components/table";
import { formatDate, parseDate } from "components/form/DatePicker";
import images from "assets/images";
import { Icon } from "@iconify/react";
import { renderDayOfWeek } from "utils/date";

const GroupList: React.FC<any> = () => {

    const navigate = useNavigate();

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
            <Box px={3}>
                <GroupItem />
                <GroupItem />
            </Box>
        )

        return <Box>
            <Box>
                {(listData.length === 0 && !isFetchingNextPage && !isLoading) ? (
                    <Box px={4}>
                        <EmptyData title="Hiện chưa có nhóm nào!" textBtn="Thêm nhóm" handleClick={() => navigate("/group-add")} />
                    </Box>
                ) : (
                    <>
                        <Box px={4}>
                            {/* {listData.map((item: any, index) => (
                                <GroupItem key={index} data={item} />
                            ))} */}

                            <Box className="meeting-item" onClick={() => navigate(`/group-detail?id=1`)}>
                                <Box>
                                    <div className="flex items-start gap-4">
                                        <Box px={4} py={6} width={108} height={152} className="bg-blue-100 text-primary-color rounded-tl-2xl rounded-br-2xl relative overflow-hidden">
                                            <img className="w-[100%] h-[100%] absolute top-0 left-0 opacity-5 scale-[2.5]" src={images.shape4} alt="shape" />
                                            <div className="flex-center flex-col h-[100%] relative z-[2]">
                                                <div className="text-[18px] leading-[1] font-semibold text-center mb-2 whitespace-nowrap">07/07/2025</div>
                                                <div className="text-[14px] leading-[1] font-semibold text-center">08/07/2025</div>
                                            </div>
                                        </Box>
                                        <Box py={2} className="flex-1">
                                            <h3 className="text-[16px] leading-[22px] font-semibold line-clamp-2 mb-2">Nhóm 1</h3>
                                            <div className="flex flex-col">
                                                <Box>
                                                    <ul className="flex flex-col gap-[6px] text-[14px] leading-4 font-normal text-gray-color mb-1">
                                                        <li className="flex items-start gap-1">
                                                            <Icon fontSize={18} icon='qlementine-icons:location-16' /> <span className="flex-1 font-medium line-clamp-2 whitespace-normal">dịa điểm</span>
                                                        </li>
                                                    </ul>
                                                </Box>
                                            </div>
                                        </Box>
                                    </div>
                                </Box>
                            </Box>
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
                onAddButtonClick={() => navigate("/group-add")}
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
        </Box>
    )
}

export default GroupList