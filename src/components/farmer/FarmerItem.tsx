import { Icon } from "@iconify/react"
import React from "react"
import { Box, useNavigate } from "zmp-ui"
import FarmerDropdown from "./FarmerDropdown"

type InfoItemProps = {
    title: string,
    value: string,
    note?: string
}

type FarmerItemProps = {
    data?: any
}

const InfoItem: React.FC<InfoItemProps> = ({
    title,
    value,
    note
}) => {

    return (
        <div className="flex items-center justify-between border-b p-3 text-[16px] leading-[20px] font-medium">
            <div>{title}</div>
            {
                note &&
                <div className="text-[15px] text-gray-color font-medium"> ({note})</div>
            }
            <div>{value}</div>
        </div>
    )
}

const FarmerItem: React.FC<FarmerItemProps> = ({ data }) => {

    const navigate = useNavigate()

    return (
        <Box mx={1} mb={4} className="bg-white shadow-sm rounded-lg overflow-hidden border">
            <Box flex alignItems="center" className="bg-blue-100">
                <div className="flex items-center w-full">
                    <FarmerDropdown data={data}  />
                    <div className="flex flex-col gap-2 py-4 px-3 w-full border-r border-l border-gray-300 flex-[1_0_0]">
                        <div className="text-[18px] leading-[24px] font-semibold text-primary-color">Chú 2</div>
                        <div className="text-[14px] font-medium leading-[1] text-gray-color">10:30 09/07/2025</div>
                    </div>
                </div>
                <div
                    className="h-[77px] flex items-center justify-center text-[16px] font-semibold px-5 leading-[1] text-primary-color"
                    onClick={() => navigate(`/farmer-detail?id=1`) }
                >
                    Mở
                </div>
            </Box>
            <Box>
                <InfoItem title="Khối lượng" value="10kg" note="22 lần cân" />
                <InfoItem title="Thành tiền" value="1.660.000đ" note="6.000đ" />
                <InfoItem title="Tiền cọc" value="0đ" />
                <InfoItem title="Đã trả" value="0đ" />
                <InfoItem title="Còn lại" value="0đ" />
            </Box>
        </Box>
    )
}

export default FarmerItem