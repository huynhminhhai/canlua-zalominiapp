import { useGetGoiSuDungList } from 'apiRequest/goiSuDung';
import { EmptyData } from 'components/data';
import { MeetingItemSkeleton } from 'components/skeleton';
import React, { useState } from 'react'
import { Box, Button, useNavigate } from 'zmp-ui'

export type GoiNangCapType = {
    id: number;
    tenGoi: string;
    tenHienThi: string;
    giaTien: number;
    soThang: number;
    chuKy: string;
    trangThaiHoatDong: boolean;
    thoiGianTao: string;
    thuTuSapXep: number;
};

const PlanForm: React.FC = () => {

    const navigate = useNavigate();

    const [param, setParam] = useState({
        page: 1,
        pageSize: 999,
        search: '',
        tuNgay: '',
        denNgay: '',
    });

    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

    const { data, isLoading } = useGetGoiSuDungList(param);

    // Hàm xử lý khi nhấn nút Mua
    const handlePurchase = async () => {
        if (!selectedPlan) {
            return;
        }
        
        // const selectedPlanData = data?.result?.find(item => item.id === selectedPlan);

        navigate(`/plan-pay?id=${selectedPlan}`);
    };

    // Hàm format tiền VND
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const renderContent = () => {

        if (isLoading) {
            return <Box><MeetingItemSkeleton count={2} /></Box>
        }

        if (!data?.result?.length) {
            return (
                <Box px={4}>
                    <EmptyData
                        title="Hiện chưa có gói nâng cấp nào!"
                    />
                </Box>
            );
        }

        return (
            <Box pt={2}>
                <div className="space-y-4">
                    {data.result.map((item: GoiNangCapType, index) => (
                        <div
                            key={item.id}
                            className={`relative border-[1px] rounded-xl px-5 pb-5 pt-6 bg-white transition-all duration-100 cursor-pointer shadow-sm hover:shadow-lg transform hover:-translate-y-1 ${selectedPlan === item.id
                                    ? 'border-primary-color bg-gradient-to-r from-primary-color/10 to-primary-color/5 shadow-lg'
                                    : 'border-gray-200 hover:border-primary-color/50'
                                }`}
                            onClick={() => setSelectedPlan(item.id)}
                        >
                            {/* Badge "Phổ biến" cho gói giữa */}
                            {index === 1 && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                        PHỔ BIẾN
                                    </span>
                                </div>
                            )}

                            {/* Radio button với custom styling */}
                            <div className="absolute top-2 right-2">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === item.id
                                        ? 'border-primary-color bg-primary-color'
                                        : 'border-gray-300 bg-white'
                                    }`}>
                                    {selectedPlan === item.id && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    name="plan"
                                    value={item.id}
                                    checked={selectedPlan === item.id}
                                    onChange={() => setSelectedPlan(item.id)}
                                    className="sr-only"
                                />
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                Gói {item.tenHienThi}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                {item.soThang} tháng sử dụng
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary-color mb-1">
                                                {formatCurrency(item.giaTien)}
                                            </p>
                                            <p className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                                {Math.round(item.giaTien / item.soThang).toLocaleString('vi-VN')} đ/tháng
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút Mua với animation */}
                <Box mt={6}>
                    <Button
                        onClick={handlePurchase}
                        disabled={!selectedPlan}
                        className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 transform ${selectedPlan
                                ? 'bg-gradient-to-r from-primary-color to-primary-color/80 hover:from-primary-color/90 hover:to-primary-color/70 hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {selectedPlan ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5L12 18l-2.5-5" />
                                </svg>
                                Mua Gói Ngay
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Chọn Gói Để Tiếp Tục
                            </div>
                        )}
                    </Button>
                </Box>
            </Box>
        )
    };

    return (
        <Box px={3} py={6}>
            <h2 className='text-[22px] leading-[26px] text-primary-color font-bold mb-1'> Gói nâng cấp khác</h2>
            {renderContent()}
        </Box>
    )
}

export default PlanForm