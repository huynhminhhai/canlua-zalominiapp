import { Icon } from "@iconify/react"
import React from "react"
import { Box, useNavigate } from "zmp-ui"
import FarmerDropdown from "./FarmerDropdown"
import { PhienCan } from "./type"
import { formatDate, getHourFromDate } from "utils/date"
import { formatCurrencyVN, parseNumber, roundWeight } from "utils/number"

type InfoItemProps = {
    title: string,
    value: string,
    note?: string,
    colorClass?: string
}

type FarmerItemProps = {
    data: PhienCan
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

    const truBaoBi = parseNumber(data?.quyCachTruBi);
    const truTapChat = parseNumber(data?.truTapChat);

    const khoiLuongTruBaoBi = truBaoBi === 0 ? 0 : roundWeight(data?.soLanCan / truBaoBi, 'nearest', 1);

    const khoiLuongConLai = Number((data?.tongTrongLuong - khoiLuongTruBaoBi - truTapChat).toFixed(1));

    const thanhTien = Math.round(data?.donGia * khoiLuongConLai);

    const conLai = thanhTien - data?.tienCoc - data?.tienDaTra;

    return (
        <Box mx={1} mb={4} className="bg-white shadow-sm rounded-lg overflow-hidden border">
            <Box flex alignItems="center" className="bg-blue-100">
                <div className="flex items-center w-full">
                    <FarmerDropdown data={data} />
                    <div className="flex flex-col gap-2 py-4 px-3 w-full border-r border-l border-gray-300 flex-[1_0_0]">
                        <div className="text-[20px] leading-[26px] font-semibold text-primary-color">{data?.tenHoDan}</div>
                        <div className="text-[16px] font-medium leading-[1] flex items-center gap-2">
                            <span>
                                {
                                    data?.ngayTao &&
                                    getHourFromDate(data?.ngayTao)
                                }
                            </span>
                            <span>
                                {
                                    data?.ngayTao &&
                                    formatDate(data?.ngayTao)
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className="h-[77px] flex items-center justify-center text-[18px] font-semibold px-5 leading-[1] text-primary-color"
                    onClick={() => navigate(`/farmer-detail?id=${data.id}`)}
                >
                    Mở
                </div>
            </Box>
            <Box>
                <InfoItem title="Khối lượng" value={`${data?.tongTrongLuong} kg`} note={`${data?.soLanCan} lần cân`} />
                <InfoItem title="Thành tiền" value={`${formatCurrencyVN(thanhTien)} đ`} />
                <InfoItem title="Đơn giá" value={`${formatCurrencyVN(data?.donGia)} đ/kg`} />
                <InfoItem title="Tiền cọc" value={`${formatCurrencyVN(data?.tienCoc)} đ`} colorClass="text-orange-500" />
                <InfoItem title="Đã trả" value={`${formatCurrencyVN(data?.tienDaTra)} đ`} colorClass="text-green-600" />
                <InfoItem title="Còn lại" value={`${formatCurrencyVN(conLai)} đ`} colorClass="text-red-600" />
            </Box>
        </Box>
    )
}

export default FarmerItem