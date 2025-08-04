import { Icon } from '@iconify/react'
import { useUpdateCauHinhHeThong } from 'apiRequest/cauHinhHeThong'
import React, { useCallback, useEffect, useState } from 'react'
import { Box, Input } from 'zmp-ui'

interface CaiDatNhomCanProps {
    cauHinhHeThong: any
}

const CaiDatNhomCan: React.FC<CaiDatNhomCanProps> = ({ cauHinhHeThong }) => {

    // State cho trạng thái loading khi update quy cách trừ bì
    const [isUpdatingCaiDatNhomCan, setIsUpdatingCaiDatNhomCan] = useState(false);

    const [selectedInputType, setSelectedInputType] = useState<any | null>(null);

    const { mutateAsync: updateCauHinh } = useUpdateCauHinhHeThong();

    // Function cập nhật quy cách trừ bì
    const updateCaiDatNhomCan = useCallback(async (newValue: number) => {
        try {
            setIsUpdatingCaiDatNhomCan(true);

            if (!cauHinhHeThong?.result) {
                throw new Error("Không thể lấy cấu hình hiện tại");
            }

            const updatePayload = {
                ...cauHinhHeThong.result,
                soLuongMoiTrang: newValue
            };

            // Gọi API update
            await updateCauHinh(updatePayload);

        } catch (error) {
            console.error("Lỗi khi cập nhật cài đặt nhóm cân:", error);
        } finally {
            setIsUpdatingCaiDatNhomCan(false);
        }
    }, [cauHinhHeThong, updateCauHinh]);

    const handleInputTypeChange = useCallback(async (inputType: any) => {
        setSelectedInputType(inputType);

        // Cập nhật qua API
        await updateCaiDatNhomCan(inputType);
    }, [updateCaiDatNhomCan]);

    // Load cấu hình từ API khi có data
    useEffect(() => {
        if (cauHinhHeThong?.result) {
            const inputType = cauHinhHeThong?.result?.soLuongMoiTrang;
            if (inputType) {
                setSelectedInputType(inputType);
            }
        }
    }, [cauHinhHeThong]);

    return (
        <>
            <div className="col-span-12">
                <Box className="rounded-lg overflow-hidden shadow-md">
                    <div className="p-4 bg-gradient-to-r from-primary-color to-primary-color text-white text-[18px] leading-[24px] font-medium flex items-center gap-3">
                        <Icon icon='carbon:settings-edit' fontSize={20} />
                        Cài đặt nhóm cân
                        {isUpdatingCaiDatNhomCan && (
                            <Icon icon="eos-icons:loading" fontSize={16} className="animate-spin ml-auto" />
                        )}
                    </div>
                    <div className="bg-white border-primary-color">
                        <Box
                            py={3}
                            px={5}
                            flex
                            alignItems="flex-start"
                            className="gap-5 border-b last:border-b-0"
                        >
                            <input
                                className="scale-[1.4] mt-2"
                                id='75'
                                name="input-caidatnhomcan"
                                type="radio"
                                checked={selectedInputType === 75}
                                onChange={() => handleInputTypeChange(75)}
                                disabled={isUpdatingCaiDatNhomCan}
                            />
                            <label htmlFor='75' className="cursor-pointer flex-1">
                                <div className="text-[18px] leading-[24px] font-semibold">Nhóm 75 mã cân (3 bảng)</div>
                                <div className="text-[16px] leading-[22px] font-normal text-gray-500 mt-2">Hiển thị kết quả tổng của mỗi 75 mã cân</div>
                            </label>
                        </Box>
                        <Box
                            py={3}
                            px={5}
                            flex
                            alignItems="flex-start"
                            className="gap-5 border-b last:border-b-0"
                        >
                            <input
                                className="scale-[1.4] mt-2"
                                id='100'
                                name="input-caidatnhomcan"
                                type="radio"
                                checked={selectedInputType === 100}
                                onChange={() => handleInputTypeChange(100)}
                                disabled={isUpdatingCaiDatNhomCan}
                            />
                            <label htmlFor='100' className="cursor-pointer flex-1">
                                <div className="text-[18px] leading-[24px] font-semibold">Nhóm 100 mã cân (4 bảng)</div>
                                <div className="text-[16px] leading-[22px] font-normal text-gray-500 mt-2">Hiển thị kết quả tổng của mỗi 75 mã cân</div>
                            </label>
                        </Box>
                    </div>
                </Box>
            </div>
        </>
    )
}

export default CaiDatNhomCan