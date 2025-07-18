import { Icon } from "@iconify/react"
import { useDangKyGoiSuDung } from "apiRequest/goiSuDung"
import { HeaderSub } from "components/header-sub"
import { RegisterQrCodeResponse } from "components/plan/type"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { formatDate } from "utils/date"
import { Box, Button, Page } from "zmp-ui"
import { formatCurrency } from "utils/number"
import { useStoreApp } from "store/store"
import { saveImageFromZalo } from "services/zalo"
import { useCustomSnackbar } from "utils/useCustomSnackbar"
import Skeleton from "react-loading-skeleton"

const getStatusInfo = (status) => {
    switch (status) {
        case 0:
            return {
                text: 'Chưa thanh toán',
                bgColor: 'bg-red-50',
                textColor: 'text-red-600'
            };
        case 1:
            return {
                text: 'Đã thanh toán',
                bgColor: 'bg-green-50',
                textColor: 'text-green-600'
            };
        case 2:
            return {
                text: 'Quá hạn',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-600'
            };
        default:
            return {
                text: 'Không xác định',
                bgColor: 'bg-gray-50',
                textColor: 'text-gray-600'
            };
    }
};

const InvoiceDetailPage: React.FC = () => {

    const { setIsLoadingFullScreen } = useStoreApp();
    const { showSuccess, showWarning } = useCustomSnackbar();

    const [searchParams] = useSearchParams();
    const planId = searchParams.get("id");

    const [ketQuaGoi, setKetQuaGoi] = useState<RegisterQrCodeResponse | null>(null)

    const { mutateAsync: dangKyGoiSuDung, isPending } = useDangKyGoiSuDung();

    const handleGetQrCode = async () => {
        const res = await dangKyGoiSuDung({ goiSuDungId: Number(planId) });

        setKetQuaGoi(res?.result);
    }

    useEffect(() => {
        if (planId) {
            handleGetQrCode();
        }
    }, [planId]);

    const paymentData = ketQuaGoi?.dangKyGoiSuDungDto || null;
    const qrCodeData = ketQuaGoi?.qrCodeResponseDto || null;

    const statusInfo = paymentData && getStatusInfo(paymentData.trangThai);

    const handleDownloadQrCode = async (fileUrl: string) => {

        console.log(fileUrl);

        setIsLoadingFullScreen(true);

        try {
            await saveImageFromZalo(fileUrl);
            showSuccess('Tải tập tin thành công!');
        } catch (error) {
            showWarning('Tải tập tin thất bại!');
        } finally {
            setIsLoadingFullScreen(false);
        }
    };

    return (
        <Page className="relative flex-1 flex flex-col pb-[66px]">
            <HeaderSub title="Thanh toán gói nâng cấp" />
            <Box px={2} pb={4} pt={4}>
                <Box py={4} px={2} className="bg-white rounded-lg shadow-md relative overflow-hidden">
                    <Box pb={4} mb={4} className="dashed-border-bottom">
                        <div className="w-[22px] h-[22px] bg-[#ebebeb] rounded-full absolute top-[234px] left-[-14px]"></div>
                        <div className="w-[22px] h-[22px] bg-[#ebebeb] rounded-full absolute top-[234px] right-[-14px]"></div>
                        <div className="grid grid-cols-12 gap-4 px-3 py-4">
                            <div className="col-span-6">
                                <div className="flex flex-col gap-1">
                                    <div className="text-[15px] font-medium text-gray-500 mb-1">Ngày lập hóa đơn</div>
                                    <div className="text-[20px] font-semibold">
                                        {
                                            isPending ? <Icon icon={'eos-icons:loading'} fontSize={18} /> :
                                                (
                                                    paymentData && formatDate(paymentData.thoiGianTao)
                                                )
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-6">
                                <div className="flex flex-col gap-1">
                                    <div className="text-[15px] font-medium text-gray-500 mb-1">Thời hạn đến</div>
                                    <div className="text-[20px] font-semibold">
                                        {
                                            isPending ? <Icon icon={'eos-icons:loading'} fontSize={18} /> :
                                                (
                                                    paymentData?.ngayKetThuc && formatDate(paymentData.ngayKetThuc)
                                                )
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-6">
                                <div className="flex flex-col gap-1">
                                    <div className="text-[15px] font-medium text-gray-500 mb-1">Loại gói</div>
                                    <div className="text-[20px] font-semibold">
                                        {
                                            isPending ? <Icon icon={'eos-icons:loading'} fontSize={18} /> :
                                                (
                                                    paymentData && `${paymentData.chuKy} tháng`
                                                )
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-6">
                                <div className="flex flex-col gap-1">
                                    <div className="text-[15px] font-medium text-gray-500 mb-1">Tự động gia hạn</div>
                                    <div className="text-[20px] font-semibold">
                                        {
                                            isPending ? <Icon icon={'eos-icons:loading'} fontSize={18} /> :
                                                (
                                                    paymentData && (paymentData.tuDongGiaHan ? 'Có' : 'Không')
                                                )
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-6">
                                <div className="flex flex-col gap-1">
                                    <div className="text-[15px] font-medium text-gray-500 mb-1">Số tiền</div>
                                    <div className="text-[24px] font-bold text-blue-600">
                                        {
                                            isPending ? <Icon icon={'eos-icons:loading'} fontSize={20} /> :
                                                (paymentData && `${formatCurrency(paymentData.giaTien)} đ`)
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-6">
                                <div className="flex flex-col gap-1">
                                    <div className="text-[15px] font-medium text-gray-500 mb-1">Trạng thái</div>
                                    {
                                        isPending ? <Icon icon={'eos-icons:loading'} fontSize={18} /> :
                                            (
                                                statusInfo &&
                                                <div className={`${statusInfo.bgColor} ${statusInfo.textColor} text-[14px] font-semibold leading-[1] text-center px-3 py-[6px] rounded-xl w-fit`}>
                                                    {statusInfo.text}
                                                </div>
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    </Box>
                    <Box>
                        <div className="flex flex-col gap-1">
                            {/* <div className="text-[15px] px-3 font-medium text-gray-color">QR code</div> */}
                            <div>
                                {
                                    isPending ?
                                        <div className="w-[63%] h-auto mx-auto">
                                            <Skeleton count={1} height={250} />
                                        </div> :
                                        (
                                            qrCodeData?.qrcodeImage &&
                                            <img className="w-[80%] h-auto mx-auto" src={`data:image/jpeg;base64,${qrCodeData.qrcodeImage}`} alt="qrcode" />
                                        )
                                }
                            </div>
                        </div>
                    </Box>
                </Box>
                {
                    qrCodeData?.qrcodeImage
                    &&
                    <div className="fixed bottom-0 left-0 flex justify-center w-[100%] bg-white box-shadow-3 px-3 pt-3">
                        <Button variant="secondary" onClick={() => handleDownloadQrCode(`data:image/jpeg;base64,${qrCodeData.qrcodeImage}`)} size="large" fullWidth>
                            <div className="flex items-center gap-2 justify-center">
                                <Icon className="mt-1" fontSize={16} icon='line-md:download' />
                                <span className="font-semibold">Lưu mã QR Code</span>
                            </div>
                        </Button>
                    </div>
                }
            </Box>
        </Page>
    )
}

export default InvoiceDetailPage