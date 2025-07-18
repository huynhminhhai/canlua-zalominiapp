import React from "react";
import { Box } from "zmp-ui";
import { motion } from "framer-motion";
import images from "assets/images";
import { useGetSoLieuHienThi } from "apiRequest/app";
import { Icon } from "@iconify/react";

const StatisticMain: React.FC<any> = () => {

    const { data, isLoading } = useGetSoLieuHienThi();

    return (
        <Box>
            <div className="bg-blue-50 text-[#153568] w-[100%] p-2 py-4 rounded-xl relative overflow-hidden">
                <div className="absolute top-[50%] left-0 transform translate-y-[-50%] w-[100%]">
                    <motion.img
                        src={images.shapeWave}
                        initial={{ WebkitMaskSize: "0% 100%", opacity: 0 }}
                        animate={{ WebkitMaskSize: "100% 100%", opacity: 0.1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="relative z-2">
                        <div className="grid grid-cols-2 gap-1 gap-y-3">
                            <h5 className="text-[12px] leading-[1] font-semibold flex items-center gap-1">
                                <span className="opacity-90">Hộ nghèo:</span> <span className="text-[13px] font-semibold opacity-100">
                                    {
                                        isLoading ? (
                                            <Icon icon="line-md:loading-twotone-loop" />
                                        ) : (
                                            `${((data?.soLuongHoNgheo && data?.tongSoHoGiaDinh
                                                ? (data.soLuongHoNgheo / data.tongSoHoGiaDinh) * 100
                                                : 0)).toFixed(0)}%`
                                        )
                                    }
                                </span>
                            </h5>
                            <h5 className="text-[12px] leading-[1] font-semibold flex items-center gap-1">
                                <span className="opacity-90">Hộ cận nghèo:</span> <span className="text-[13px] font-semibold opacity-100">
                                    {
                                        isLoading ? (
                                            <Icon icon="line-md:loading-twotone-loop" />
                                        ) : (
                                            `${((data?.soLuongCanNgheo && data?.tongSoHoGiaDinh
                                                ? (data.soLuongCanNgheo / data.tongSoHoGiaDinh) * 100
                                                : 0)).toFixed(0)}%`
                                        )
                                    }
                                </span>
                            </h5>
                            <h5 className="text-[12px] leading-[1] font-semibold flex items-center gap-1">
                                <span className="opacity-90">Gia đình văn hóa:</span> <span className="text-[13px] font-semibold opacity-100">
                                    {
                                        isLoading ? (
                                            <Icon icon="line-md:loading-twotone-loop" />
                                        ) : (
                                            `${((data?.soLuongGiaDinhVanHoa && data?.tongSoHoGiaDinh
                                                ? (data.soLuongGiaDinhVanHoa / data.tongSoHoGiaDinh) * 100
                                                : 0)).toFixed(0)}%`
                                        )
                                    }
                                </span>
                            </h5>
                            <h5 className="text-[12px] leading-[1] font-semibold flex items-center gap-1">
                                <span className="opacity-90">Ý kiến đã phản hồi:</span> <span className="text-[13px] font-semibold opacity-100">
                                    {
                                        isLoading ? (
                                            <Icon icon="line-md:loading-twotone-loop" />
                                        ) : (
                                            `${((data?.soLuongPhanAnhDaXuLy && data?.tongSoPhanAnh
                                                ? (data.soLuongPhanAnhDaXuLy / data.tongSoPhanAnh) * 100
                                                : 0)).toFixed(0)}%`
                                        )
                                    }
                                </span>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    )
}

export default StatisticMain