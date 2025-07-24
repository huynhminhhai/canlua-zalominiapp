import { Icon } from '@iconify/react';
import React from 'react';
import { ThanhToan } from './type';
import { formatDate } from 'utils/date';
import { formatCurrencyVN } from 'utils/number';

type PlanItemProps = {
    data: ThanhToan;
};

const PlanItem: React.FC<PlanItemProps> = ({ data: paymentData }) => {

    // Get payment method display
    const getPaymentMethod = (method) => {
        switch (method) {
            case 'ChuyenKhoan': return 'Chuyển khoản';
            case 'TienMat': return 'Tiền mặt';
            case 'TheATM': return 'Thẻ ATM';
            default: return method;
        }
    };

    // Get status display
    const getStatusInfo = (status) => {
        switch (status) {
            case 1:
                return {
                    text: 'Thành công', color: 'text-green-600', bgColor: 'bg-green-100', icon: "solar:check-circle-broken"
                };
            default:
                return {
                    text: 'Thất bại', color: 'text-red-600', bgColor: 'bg-red-100', icon: "solar:close-circle-broken"
                };
        }
    };

    const statusInfo = getStatusInfo(paymentData.trangThai);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="bg-white rounded-lg shadow-md border p-3 font-medium mb-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon
                            className="h-5 w-5 text-blue-600"
                            icon="quill:creditcard"
                        />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            Hóa đơn thanh toán
                        </p>
                    </div>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                    <Icon
                        className="h-5 w-5 mr-1"
                        style={{ color: statusInfo.color }}
                        icon={StatusIcon}
                    />
                    {statusInfo.text}
                </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mã giao dịch:</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {paymentData.maGiaoDich}
                    </span>
                </div>
            </div>

            {/* Invoice Style Details */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Chi tiết hóa đơn
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Icon
                            className="h-4 w-4"
                            icon="solar:calendar-mark-broken"
                        />
                        <span>{formatDate(paymentData.ngayThanhToan)}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Dịch vụ:</span>
                        <span className="text-sm font-medium text-gray-900">
                            Gói dịch vụ #{paymentData.dangKyGoiSuDungId}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Phương thức thanh toán:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {getPaymentMethod(paymentData.phuongThucThanhToan)}
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-2 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-900">Tổng tiền:</span>
                            <span className="text-xl font-bold text-primary-color">
                                {formatCurrencyVN(paymentData.soTien)} đ
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanItem;