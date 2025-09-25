import { Icon } from "@iconify/react"
import React from "react"
import { formatDate, renderDayOfWeek } from "utils/date"
import { Box, useNavigate } from "zmp-ui"
import GroupDropdown from "./GroupDropdown"
import { GroupItemType } from "./type"
import { formatCurrencyVN, replaceDotToComma } from "utils/number"

type GroupItemProps = {
    data: GroupItemType
}

const GroupItem: React.FC<GroupItemProps> = ({ data }) => {
    const navigate = useNavigate()

    return (
        <Box mb={4} className="group-item">
            <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px'
                }}
                onClick={() => navigate(`/farmer-list?id=${data.id}&tenNhom=${data.tenNhom}`)}
            >
                {/* Header với tên nhóm và dropdown */}
                <div className="flex items-center justify-between p-3 pl-4 pb-3">
                    <h3 className="text-xl text-heading-color font-semibold line-clamp-2 flex-1 mr-3 ">
                        {data.tenNhom}
                    </h3>
                    <GroupDropdown data={data} />
                </div>

                <div className="px-3 pb-3.5">
                    {/* Thông tin chính */}
                    <div className="flex items-center gap-2 mb-4">
                        {/* Date card */}
                        {/* <div className="flex-shrink-0 w-[102px] h-20 bg-gradient-to-br from-primary-color to-blue-600 rounded-xl flex flex-col items-center justify-center text-white shadow-sm">
                            <div className="text-sm font-semibold mb-1">
                                {data?.ngayTao && renderDayOfWeek(formatDate(data.ngayTao))}
                            </div>
                            <div className="text-sm font-semibold leading-tight text-center">
                                {data?.ngayTao && formatDate(data.ngayTao)}
                            </div>
                        </div> */}

                        {/* Stats */}
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="bg-gradient-to-r from-bg-color to-blue-50/30 rounded-lg pl-3 pr-1 py-1.5 border border-primary-color shadow-sm
                            flex flex-col justify-center">
                                <div className="text-[17px] font-bold text-primary-color">
                                    {data.soPhienCan || 0}
                                </div>
                                <div className="text-[14px] text-primary-color font-semibold">hộ bán lúa</div>
                            </div>

                            <div className="bg-gradient-to-r from-bg-color to-blue-50/30 rounded-lg pl-3 pr-1 py-1.5 border border-primary-color shadow-sm
                            flex flex-col justify-center">
                                <div className="text-[17px] font-bold text-primary-color">
                                    {data.soLanCan || 0}
                                </div>
                                <div className="text-[14px] text-primary-color font-semibold">lần cân</div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-bg-color to-blue-50/30 rounded-lg pl-3 pr-1 py-1.5 border border-primary-color shadow-sm flex flex-col justify-center">
                                <div className="text-[17px] font-bold text-primary-color">
                                    {replaceDotToComma(data.tongTrongLuong?.toFixed(1)) || '0.0'}
                                </div>
                                <div className="text-[14px] text-primary-color font-semibold">kg</div>
                            </div>

                            <div className="bg-gradient-to-r from-bg-color to-blue-50/30 rounded-lg pl-3 pr-1 py-1.5 border border-primary-color shadow-sm
                            flex flex-col justify-center">
                                <div className="text-[17px] font-bold text-primary-color">
                                    {`${formatCurrencyVN(data?.tongTien)}`}
                                </div>
                                <div className="text-[14px] text-primary-color font-semibold">vnđ</div>
                            </div>
                            
                        </div>
                    </div>

                    <div className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-bg-color to-blue-50/30 rounded-lg border-l-4 border-blue-900/70 mb-2">
                        <Icon icon='solar:calendar-outline' className="text-gray-800" fontSize={16} />
                        <span className="text-sm text-gray-600 font-semibold tracking-wide">
                            {data?.ngayTao && renderDayOfWeek(formatDate(data.ngayTao))} - {data?.ngayTao && formatDate(data.ngayTao)}
                        </span>
                    </div>
                    {/* Contact info */}
                    <div className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-bg-color to-blue-50/30 rounded-lg border-l-4 border-blue-900/70">
                        <Icon icon='mingcute:phone-line' className="text-gray-800" fontSize={16} />
                        <span className="text-sm text-gray-600 font-semibold tracking-wide">
                            {data.moTa || 'Chưa có SĐT'}
                        </span>
                    </div>

                    {/* Action indicator */}
                    <div className="flex justify-end mt-3">
                        <div className="flex items-center gap-1 text-primary-color">
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