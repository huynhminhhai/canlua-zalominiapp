import { useGetGoiDangKyMoiNhat, useGetGoiSuDungById } from 'apiRequest/goiSuDung';
import { MeetingItemSkeleton } from 'components/skeleton';
import React from 'react'
import { formatDate } from 'utils/date';
import { formatCurrency } from 'utils/number';
import { Box } from 'zmp-ui'

const PlanCurrent = () => {

    const { data, isLoading } = useGetGoiDangKyMoiNhat();

    const { data: goiSuDung, isLoading: isLoadingGoiSuDung } = useGetGoiSuDungById(data?.result?.goiSuDungId);

    console.log(data?.result)
    console.log('goi su dung', goiSuDung?.result)

    const renderContent = () => {

        if (isLoading || isLoadingGoiSuDung) {
            return <Box><MeetingItemSkeleton count={1} /></Box>
        }

        if (!data?.result) {
            return (
                <Box>
                    Chưa kích hoạt gói sử dụng nào
                </Box>
            );
        }

        return (
            <Box pt={2}>
                <div className="bg-gradient-to-r from-primary-color/10 to-primary-color/5 border border-primary-color/30 rounded-xl px-5 pb-5 pt-7 relative overflow-hidden bg-white shadow-sm">
                    {/* Badge "Đã kích hoạt" */}
                    <div className="absolute top-4 right-3">
                        <span className="bg-green-700 text-white text-xs font-medium px-2 py-1 rounded-full">
                            Đã kích hoạt
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                        Gói {goiSuDung?.result?.tenHienThi}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-600">
                                        {goiSuDung?.result?.soThang} tháng sử dụng
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary-color mb-1">
                                        {formatCurrency(data?.result?.giaTien)}
                                    </p>
                                    <p className="text-sm font-medium text-gray-600">
                                        {Math.round(goiSuDung?.result?.giaTien / goiSuDung?.result?.soThang).toLocaleString('vi-VN')} đ/tháng
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin hạn sử dụng */}
                    <div className="mt-4 pt-4 border-t border-primary-color/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">
                                    Hạn sử dụng:
                                </span>
                            </div>
                            <span className="text-sm font-bold text-orange-600">
                                {data?.result?.ngayKetThuc && formatDate(data?.result?.ngayKetThuc)}
                            </span>
                        </div>
                    </div>
                </div>
            </Box>
        )
    };

    return (
        <Box px={2} pt={4} pb={2}>
            {renderContent()}
        </Box>
    )
}

export default PlanCurrent