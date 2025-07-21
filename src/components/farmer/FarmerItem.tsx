import { Icon } from "@iconify/react"
import React from "react"
import { Box, useNavigate } from "zmp-ui"
import FarmerDropdown from "./FarmerDropdown"
import { PhienCan } from "./type"
import { formatDate, getHourFromDate } from "utils/date"
import { formatCurrencyVN, parseNumber, roundWeight } from "utils/number"
import { useStoreApp } from "store/store"

type InfoItemProps = {
    title: string,
    value: string,
    note?: string,
    colorClass?: string,
    icon?: string
}

type FarmerItemProps = {
    data: PhienCan
}

const InfoItem: React.FC<InfoItemProps> = ({
    title,
    value,
    note,
    colorClass = 'text-gray-700',
    icon
}) => {
    return (
        <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-100 transition-colors duration-200 group">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                        <Icon icon={icon} fontSize={22} className="text-primary-color" />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-[16px] font-medium text-gray-800">{title}</span>
                    {note && (
                        <span className="text-[16px] font-medium text-gray-500 mt-0.5">{note}</span>
                    )}
                </div>
            </div>
            <div className={`${colorClass} font-bold text-[20px]`}>{value}</div>
        </div>
    )
}

const FarmerItem: React.FC<FarmerItemProps> = ({ data }) => {
    const navigate = useNavigate();
    const { setPhienCan } = useStoreApp();

    const truBaoBi = parseNumber(data?.quyCachTruBi);
    const truTapChat = parseNumber(data?.truTapChat);

    const khoiLuongTruBaoBi = truBaoBi === 0 ? 0 : roundWeight(data?.soLanCan / truBaoBi, 'nearest', 1);
    const khoiLuongConLai = Number((data?.tongTrongLuong - khoiLuongTruBaoBi - truTapChat).toFixed(1));
    const thanhTien = Math.round(data?.donGia * khoiLuongConLai);
    const conLai = thanhTien - data?.tienCoc - data?.tienDaTra;

    const handleOnClick = () => {
        setPhienCan(data);
        navigate(`/farmer-detail?id=${data.id}`);
    }

    return (
        <Box mb={4} className="bg-white shadow-md rounded-2xl overflow-hidden group">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-primary-color px-2 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FarmerDropdown data={data} />
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold text-white">{data?.tenHoDan}</h3>
                            <div className="flex items-center gap-4 text-blue-100">
                                <div className="flex items-center gap-1.5">
                                    <Icon icon="mdi:clock-outline" className="w-4 h-4" />
                                    <span className="text-sm font-semibold">
                                        {data?.ngayTao && getHourFromDate(data?.ngayTao)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Icon icon="mdi:calendar-outline" className="w-4 h-4" />
                                    <span className="text-sm font-semibold">
                                        {data?.ngayTao && formatDate(data?.ngayTao)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-semibold text-[16px] flex items-center gap-2"
                        onClick={handleOnClick}
                    >
                        <span>Mở</span>
                        <Icon icon="mdi:chevron-right" fontSize={20} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="divide-y divide-gray-100">
                <InfoItem
                    title="Khối lượng"
                    value={`${khoiLuongConLai} kg`}
                    note={`${data?.soLanCan} lần cân`}
                    icon="mdi:scale"
                    colorClass="text-blue-600"
                />

                <InfoItem
                    title="Đơn giá"
                    value={`${formatCurrencyVN(data?.donGia)} đ/kg`}
                    icon="mdi:cash"
                    colorClass="text-gray-700"
                />

                <InfoItem
                    title="Thành tiền"
                    value={`${formatCurrencyVN(thanhTien)} đ`}
                    icon="mdi:calculator"
                    colorClass="text-purple-600"
                />

                <InfoItem
                    title="Tiền cọc"
                    value={`-${formatCurrencyVN(data?.tienCoc)} đ`}
                    icon="mdi:hand-coin"
                    colorClass="text-orange-600"
                />

                <InfoItem
                    title="Đã trả"
                    value={`-${formatCurrencyVN(data?.tienDaTra)} đ`}
                    icon="mdi:check-circle"
                    colorClass="text-green-600"
                />

                <div className="bg-gradient-to-r from-red-100 to-pink-100 border-l-4 !border-l-red-600">
                    <InfoItem
                        title="Còn lại"
                        value={`${formatCurrencyVN(conLai)} đ`}
                        icon="mdi:alert-circle"
                        colorClass="text-red-600 text-lg"
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600 font-medium">Hoạt động</span>
                </div>
                <div className="text-xs text-gray-500">
                    ID: {data?.id}
                </div>
            </div>
        </Box>
    )
}

export default FarmerItem