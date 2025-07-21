import { Icon } from "@iconify/react"
import images from "assets/images"
import React from "react"
import { formatDate, renderDayOfWeek } from "utils/date"
import { Box, useNavigate } from "zmp-ui"
import GroupDropdown from "./GroupDropdown"
import { GroupItemType } from "./type"

type GroupItemProps = {
    data: GroupItemType
}

const GroupItem: React.FC<GroupItemProps> = ({ data }) => {
    const navigate = useNavigate()

    return (
        <Box mb={4} className="group-item">
            <div 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                onClick={() => navigate(`/farmer-list?id=${data.id}&tenNhom=${data.tenNhom}`)}
            >
                {/* Header với tên nhóm và dropdown */}
                <div className="flex items-center justify-between p-3 pb-3">
                    <h3 className="text-xl font-bold line-clamp-1 flex-1 mr-3 border-l-4 border-primary-color pl-3 text-primary-color">
                        {data.tenNhom}
                    </h3>
                    <GroupDropdown data={data} />
                </div>

                <div className="px-3 pb-3">
                    {/* Thông tin chính */}
                    <div className="flex items-center gap-2 mb-4">
                        {/* Date card */}
                        <div className="flex-shrink-0 w-[102px] h-20 bg-gradient-to-br from-blue-500 to-primary-color rounded-xl flex flex-col items-center justify-center text-white shadow-sm">
                            <div className="text-sm font-semibold mb-1">
                                {data?.ngayTao && renderDayOfWeek(formatDate(data.ngayTao))}
                            </div>
                            <div className="text-sm font-semibold leading-tight text-center">
                                {data?.ngayTao && formatDate(data.ngayTao)}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-300 shadow-sm">
                                <div className="text-xl font-bold text-emerald-600 mb-1">
                                    {data.tongTrongLuong?.toFixed(1) || '0.0'}
                                </div>
                                <div className="text-[14px] text-emerald-700 font-semibold">kg</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3 border border-amber-300 shadow-sm">
                                <div className="text-xl font-bold text-amber-600 mb-1">
                                    {data.soLanCan || 0}
                                </div>
                                <div className="text-[14px] text-amber-700 font-semibold">lần cân</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="flex items-center gap-1 py-2 px-3 bg-gray-100 rounded-lg border-l-4 ">
                        <Icon icon='mingcute:phone-line' className="text-gray-600" fontSize={16} />
                        <span className="text-sm text-gray-600 font-semibold tracking-wide">
                            {data.moTa || 'Chưa có SĐT'}
                        </span>
                    </div>

                    {/* Action indicator */}
                    <div className="flex justify-end mt-3">
                        <div className="flex items-center gap-1 text-blue-500">
                            <span className="text-sm font-semibold">Xem chi tiết</span>
                            <Icon icon='solar:arrow-right-outline' fontSize={20} />
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    )
}

export default GroupItem