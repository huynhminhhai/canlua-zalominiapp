import React from "react"
import { Box } from "zmp-ui"
import { useGetChuHosList, useGetResidentData } from "apiRequest/resident"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion";
import images from "assets/images";
import { useGetSoLieuHienThi } from "apiRequest/app";
import { useStoreApp } from "store/store";

const StatisticListForResident: React.FC<any> = () => {

    const { account } = useStoreApp();

    return (
        <Box mb={3}>
            <div className="grid grid-cols-2 gap-3">
                <Box className="h-full">
                    <div className={'bg-blue-50 text-[#153568] w-[100%] p-3 py-4 rounded-xl relative overflow-hidden h-full'}>
                        <div className="absolute top-[60%] -left-[-2%] transform translate-y-[-50%] w-[100%]">
                            <motion.img
                                className="scale-[1.5] rotate-[-25deg]"
                                src={images.shapeWave2}
                                alt="shape"
                                initial={{ WebkitMaskSize: "0% 100%", opacity: 0 }}
                                animate={{ WebkitMaskSize: "100% 100%", opacity: 0.8 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Box>
                                <h5 className="text-[12px] leading-[1] font-semibold mb-[6px] opacity-90">Phường/Xã</h5>
                                <h4 className="text-[13px] leading-[16px] font-semibold">
                                    {
                                        account?.tenXa || 'Chưa đăng ký'
                                    }
                                </h4>
                            </Box>
                        </div>
                    </div>
                </Box>

                <Box className="h-full">
                    <div className={'bg-blue-50 text-[#153568] w-[100%] p-3 py-4 rounded-xl relative overflow-hidden h-full'}>
                        <div className="absolute top-[65%] -left-[-50%] transform translate-y-[-50%] w-[100%]">
                            <motion.img
                                className="scale-[1.5] rotate-[45deg]"
                                src={images.shapeWave3}
                                alt="shape"
                                initial={{ WebkitMaskSize: "0% 100%", opacity: 0 }}
                                animate={{ WebkitMaskSize: "100% 100%", opacity: 0.3 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Box>
                                <h5 className="text-[12px] leading-[1] font-semibold mb-[6px] opacity-90">Khu phố/Ấp</h5>
                                <h4 className="text-[13px] leading-[16px] font-semibold">
                                    {
                                        account?.tenAp || 'Chưa đăng ký'
                                    }
                                </h4>
                            </Box>
                        </div>
                    </div>
                </Box>
            </div>
        </Box>
    )
}

export default StatisticListForResident