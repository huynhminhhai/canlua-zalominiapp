import { Icon } from '@iconify/react'
import { useGetCauHinhHeThong, useUpdateCauHinhHeThong } from 'apiRequest/cauHinhHeThong';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { Box, Input } from 'zmp-ui'

interface QuyCachTruBiProps {
    cauHinhHeThong: any
}

const QuyCachTruBi: React.FC<QuyCachTruBiProps> = ({ cauHinhHeThong }) => {

    // State cho quy cách trừ bì
    const [quyCachTruBi, setQuyCachTruBi] = useState<number>(0);

    // State cho trạng thái loading khi update quy cách trừ bì
    const [isUpdatingTruBi, setIsUpdatingTruBi] = useState(false);

    // Hook gọi API lấy cấu hình hệ thống
    const { mutateAsync: updateCauHinh } = useUpdateCauHinhHeThong();

    // Function cập nhật quy cách trừ bì
    const updateQuyCachTruBi = useCallback(async (newValue: number) => {
        try {
            setIsUpdatingTruBi(true);

            if (!cauHinhHeThong?.result) {
                throw new Error("Không thể lấy cấu hình hiện tại");
            }

            // Payload để update quy cách trừ bì
            const updatePayload = {
                ...cauHinhHeThong.result,
                quyCachTruBi: newValue
            };

            // Gọi API update
            await updateCauHinh(updatePayload);

        } catch (error) {
            console.error("Lỗi khi cập nhật quy cách trừ bì:", error);
        } finally {
            setIsUpdatingTruBi(false);
        }
    }, [cauHinhHeThong, updateCauHinh]);

    // Debounced function để update quy cách trừ bì
    const debouncedUpdateQuyCachTruBi = useCallback(
        _.debounce(async (value: number) => {
            await updateQuyCachTruBi(value);
        }, 500),
        [updateQuyCachTruBi]
    );

    // Cleanup debounced function khi component unmount
    useEffect(() => {
        return () => {
            debouncedUpdateQuyCachTruBi.cancel();
        };
    }, [debouncedUpdateQuyCachTruBi]);

    // Handler cho việc thay đổi quy cách trừ bì
    const handleQuyCachTruBiChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setQuyCachTruBi(value);

        // Gọi debounced function
        debouncedUpdateQuyCachTruBi(value);
    }, [debouncedUpdateQuyCachTruBi]);


    // Load cấu hình từ API khi có data
    useEffect(() => {
        if (cauHinhHeThong?.result) {

            // Load quy cách trừ bì từ API
            if (cauHinhHeThong.result.quyCachTruBi !== undefined) {
                setQuyCachTruBi(cauHinhHeThong.result.quyCachTruBi);
            }
        }
    }, [cauHinhHeThong]);

    return (
        <>
            {/* Quy cách trừ bì */}
            <div className="col-span-12">
                <Box className="rounded-lg overflow-hidden shadow-md">
                    <div className="p-4 bg-gradient-to-r from-primary-color to-primary-color text-white text-[18px] leading-[24px] font-medium flex items-center gap-3">
                        <Icon icon='carbon:settings-edit' fontSize={20} />
                        Quy cách trừ bì
                        {isUpdatingTruBi && (
                            <Icon icon="eos-icons:loading" fontSize={16} className="animate-spin ml-auto" />
                        )}
                    </div>
                    <div className="bg-white border-primary-color p-4">
                        <Input
                            type="number"
                            inputMode="numeric"
                            maxLength={4}
                            value={quyCachTruBi}
                            onChange={handleQuyCachTruBiChange}
                            disabled={isUpdatingTruBi}
                            onFocus={(e) => e.target.select()}
                            suffix={
                                <Box pr={4} className="text-[16px] font-medium whitespace-nowrap">
                                    bao / 1 kg
                                </Box>
                            }
                        />
                    </div>
                </Box>
            </div>
        </>
    )
}

export default QuyCachTruBi