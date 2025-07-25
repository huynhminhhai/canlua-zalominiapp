import React from "react"
import { Box } from "zmp-ui"
import ServiceItem from "./ServiceItem"
import images from "assets/images"

export type ServicesType = {
    label: string;
    url: string;
    icon?: string;
    isCheckLogin?: boolean,
    requiredPermission?: { maChucNang: string; quyen:  "XEM" | "XEMCONGKHAI" | "SUA" | "XOA" | "THEM" | "XUATBAN" | "BAOCAO" | "TIEPNHAN" | "XOACUATOI" | "THUCHIEN" };
    isRequireApId?: boolean,
    isComingSoon?: boolean,
    isRequireLogin?: boolean
}

const SERVICES: ServicesType[] = [
    {
        label: 'Thông tin\nhộ gia đình',
        url: '/resident',
        icon: images.home,
        isRequireApId: true,
        isRequireLogin: true
        // requiredPermission: { maChucNang: permissionsList.khuPhoToChucDanCu, quyen: PermissionActions.XEM },
    },
    // {
    //     label: 'Thẻ BHYT',
    //     url: '/insurance',
    //     icon: images.safety,
    //     isRequireApId: true,
    //     // requiredPermission: { maChucNang: permissionsList.khuPhoToChucDanCu, quyen: PermissionActions.XEM },
    // },
    // {
    //     label: 'Cuộc họp',
    //     url: '/meeting',
    //     icon: images.meeting,
    //     requiredPermission: { maChucNang: permissionsList.khuPhoCongViecCuocHop, quyen: PermissionActions.XEM },
    // },
    // {
    //     label: 'Nhiệm vụ',
    //     url: '/task',
    //     icon: images.todo,
    //     requiredPermission: { maChucNang: permissionsList.khuPhoNhiemVuNhiemVuCuaToi, quyen: PermissionActions.XEM },
    // },
    // {
    //     label: 'Thông tin tổ chức',
    //     url: '/team',
    //     icon: images.team,
    //     requiredPermission: { maChucNang: permissionsList.khuPhoToChucDanCuBanDieuHanh, quyen: PermissionActions.XEM },
    // },
    {
        label: 'Bản tin\nKhu phố/Ấp',
        url: '/news',
        icon: images.news,
        // requiredPermission: { maChucNang: permissionsList.khuPhoTuyenTruyenPhanAnhTinTucSuKien, quyen: PermissionActions.XEM },
    },
    
    {
        label: 'Khảo sát\ný kiến',
        url: '/survey',
        icon: images.survey,
        // requiredPermission: { maChucNang: permissionsList.khuPhoTuyenTruyenPhanAnhKhaoSat, quyen: PermissionActions.XEMCONGKHAI },
        isRequireApId: true,
        isRequireLogin: true
    },
    
    // {
    //     label: 'Hóa đơn',
    //     url: '/invoice',
    //     icon: images.invoice,
    //     requiredPermission: { maChucNang: "Lấy danh sách giao dịch thu chi có phân trang", quyen: PermissionActions.XEM },
    // },
    // {
    //     label: 'Tình hình tài chính',
    //     url: '/transactions',
    //     icon: images.money,
    //     isRequireApId: true,
    //     // requiredPermission: { maChucNang: permissionsList.khuPhoCongViecTaiChinh, quyen: PermissionActions.XEM },
    // },
    {
        label: 'Văn bản\ncần biết',
        url: '/document',
        icon: images.document,
        // isComingSoon: true,
        isRequireLogin: true
        // requiredPermission: { maChucNang: permissionsList.khuPhoTuyenTruyenPhanAnhPhanAnh, quyen: PermissionActions.XEM },
    },
    {
        label: 'Trợ lý ảo\nTTHC',
        url: '/chatbox',
        icon: images.question,
        // isComingSoon: true
        // isRequireLogin: true
        // requiredPermission: { maChucNang: permissionsList.khuPhoTuyenTruyenPhanAnhPhanAnh, quyen: PermissionActions.XEM },
    },
    {
        label: 'Gửi ý kiến',
        url: '/feedback',
        icon: images.idea,
        isRequireLogin: true
        // requiredPermission: { maChucNang: permissionsList.khuPhoTuyenTruyenPhanAnhPhanAnh, quyen: PermissionActions.XEM },
    },
    {
        label: 'Đóng tiền\nrác',
        url: '/garbage-fee',
        icon: images.garbageFee,
        isComingSoon: true,
        isRequireLogin: true
        // requiredPermission: { maChucNang: permissionsList.khuPhoTuyenTruyenPhanAnhPhanAnh, quyen: PermissionActions.XEM },
    },
    {
        label: 'Đóng tiền\nquỹ',
        url: '/garbage-fee',
        icon: images.fund,
        isComingSoon: true,
        isRequireLogin: true
        // requiredPermission: { maChucNang: permissionsList.khuPhoTuyenTruyenPhanAnhPhanAnh, quyen: PermissionActions.XEM },
    },
]

const ServiceList: React.FC<any> = () => {

    return (
        <Box>
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                {
                    SERVICES.map((item, index) => (
                        <ServiceItem key={index} data={item} />
                    ))
                }
            </div>
        </Box>
    )
}

export default ServiceList