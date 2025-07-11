import { Icon } from "@iconify/react"
import React from "react"
import { Box, useNavigate } from "zmp-ui"
import FarmerDropdown from "./FarmerDropdown"

type InfoItemProps = {
    title: string,
    value: string,
    note?: string,
    colorClass?: string
}

type FarmerItemProps = {
    data?: any
}

const InfoItem: React.FC<InfoItemProps> = ({
    title,
    value,
    note,
    colorClass = 'text-black'
}) => {

    return (
        <div className="flex items-center justify-between border-b p-3 text-[18px] leading-[20px] font-medium">
            <div className="text-[15px]">{title}</div>
            {
                note &&
                <div className="text-[16px] text-gray-color font-medium"> ({note})</div>
            }
            <div className={`${colorClass}`}>{value}</div>
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
                        <div className="text-[20px] leading-[26px] font-semibold text-primary-color">Chú 2</div>
                        <div className="text-[16px] font-medium leading-[1]">10:30 09/07/2025</div>
                    </div>
                </div>
                <div
                    className="h-[77px] flex items-center justify-center text-[18px] font-semibold px-5 leading-[1] text-primary-color"
                    onClick={() => navigate(`/farmer-detail?id=1`) }
                >
                    Mở
                </div>
            </Box>
            <Box>
                <InfoItem title="Khối lượng" value="813.2 kg" note="22 lần cân" />
                <InfoItem title="Thành tiền" value="9.100.660.000 đ" note="66.000 đ"  />
                <InfoItem title="Tiền cọc" value="0 đ" colorClass="text-orange-500" />
                <InfoItem title="Đã trả" value="0 đ" colorClass="text-green-600" />
                <InfoItem title="Còn lại" value="0 đ" colorClass="text-red-600" />
            </Box>
        </Box>
    )
}

export default FarmerItem