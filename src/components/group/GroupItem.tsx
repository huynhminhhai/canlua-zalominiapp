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
        <Box className="meeting-item" onClick={() => navigate(`/farmer-list?id=1`)}>
            <Box>
                <div className="flex items-start gap-3 border-[1px] rounded-xl bg-white shadow-sm">
                    <Box px={4} py={4} width={98} height={152} className="bg-blue-100 text-primary-color rounded-xl relative overflow-hidden scale-[1.02]">
                        <img className="w-[100%] h-[100%] absolute top-0 left-0 opacity-5 scale-[2.5]" src={images.shape4} alt="shape" />
                        <div className="flex-center flex-col h-[100%] relative z-[2]">
                            <div className="text-[16px] leading-[1] font-semibold text-center mb-2 whitespace-nowrap">{renderDayOfWeek(formatDate(data.ngayTao))}</div>
                            <div className="text-[14px] leading-[1] font-semibold text-center">{formatDate(data.ngayTao)}</div>
                        </div>
                    </Box>
                    <Box py={2} pr={2} className="flex-1">
                        <div className="flex items-center justify-between gap-[12px] mb-2">
                            <h3 className="text-primary-color text-[16px] leading-[24px] font-semibold line-clamp-2">{data.tenNhom}</h3>

                            <GroupDropdown data={data} />
                        </div>
                        <div className="flex flex-col">
                            <Box>
                                <ul className="flex flex-col gap-[4px] text-[16px] leading-[22px] font-medium">
                                    <li>
                                        <span className="text-[18px] font-semibold mr-1">
                                            {data.tongTrongLuong}
                                        </span>
                                        kg
                                    </li>
                                    <li>
                                        <span className="text-[18px] font-semibold mr-1">
                                            {data.soLanCan}
                                        </span>
                                        lần cân (bao)
                                    </li>
                                    <li className="flex items-center gap-[4px] mt-[4px] text-[14px] text-gray-500">
                                        <Icon icon='solar:phone-outline' fontSize={14} />
                                        <span className="font-medium">
                                            {data.moTa || 'Chưa có SĐT'}
                                        </span>
                                    </li>
                                </ul>
                            </Box>
                        </div>
                    </Box>
                </div>
            </Box>
        </Box>
    )
}

export default GroupItem