import { Icon } from "@iconify/react";
import { useLogout } from "apiRequest/auth";
import { useGetGoiDangKyMoiNhat } from "apiRequest/goiSuDung";
import images from "assets/images";
import { HeaderSub } from "components/header-sub"
import React from "react"
import { useLoginWithZalo } from "services/loginWithZalo";
import { createMiniAppShortcut } from "services/zalo";
import { useStoreApp } from "store/store";
import { formatDate } from "utils/date";
import { getFullImageUrl } from "utils/file";
import { openShareSheet } from "zmp-sdk/apis";
import { Avatar, Box, List, Page, useNavigate } from "zmp-ui"

export const ManagementTitle = ({ title }: any) => {
    return (
        <div className="px-4 pt-4 pb-1 text-primary-color text-[16px] leading-[1] font-semibold">
            {title}
        </div>
    )
}

const AccountPage: React.FC = () => {

    const { Item } = List;

    const navigate = useNavigate()
    const { loginWithZalo } = useLoginWithZalo();
    const { account, accessToken } = useStoreApp();
    const logout = useLogout();

    const { data, isLoading } = useGetGoiDangKyMoiNhat();

    return (
        <Page className="relative flex-1 flex flex-col bg-white pb-[72px]" style={{ backgroundColor: '#f5f6f7' }}>
            <Box>
                <HeaderSub title="Tài khoản" onBackClick={() => navigate('/')} />
                <Box>

                    {
                        accessToken &&
                        <Box m={4}>
                            <div
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar Section */}
                                    <div className="relative flex-shrink-0">
                                        <Avatar
                                            className="border border-primary-color shadow-md"
                                            src={images.vnpt}
                                            size={80}
                                        />
                                        {/* Premium badge nếu có gói trả phí */}
                                        {data?.result && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                                                <Icon icon="solar:crown-bold" fontSize={14} className="text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 min-w-0">
                                        {/* Phone Number */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-800 tracking-wider">
                                                {account?.phoneNumber || ''}
                                            </h3>
                                        </div>

                                        {/* Subscription Info */}
                                        <div className="space-y-2">
                                            {/* Package Type */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        icon={data?.result ? "solar:star-bold" : "solar:user-bold"}
                                                        fontSize={16}
                                                        className={data?.result ? "text-yellow-500" : "text-gray-500"}
                                                    />
                                                    <span className={`text-sm font-semibold ${data?.result ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {isLoading ? (
                                                            <Icon icon="line-md:loading-twotone-loop" fontSize={16} />
                                                        ) : data?.result ? (
                                                            `Gói ${data.result.chuKy} tháng`
                                                        ) : (
                                                            'Tài khoản miễn phí'
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Expiry Date */}
                                            {data?.result?.ngayKetThuc && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Icon icon="solar:calendar-bold" fontSize={16} className="text-orange-500" />
                                                        <div className="text-sm">
                                                            <span className="text-gray-600 font-medium">Hết hạn: </span>
                                                            <span className="text-orange-600 font-bold">
                                                                {formatDate(data.result.ngayKetThuc)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    }

                    {
                        accessToken ?
                            <>

                                <Box m={4}>
                                    <List className="bg-white rounded-lg shadow-sm">
                                        <ManagementTitle title="Tài khoản" />
                                        <Item
                                            onClick={() => navigate('/plan')}
                                            title="Nâng cấp tài khoản"
                                            prefix={<div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                                                <Icon icon="solar:crown-bold" fontSize={16} className="text-white" />
                                            </div>}
                                            suffix={<Icon fontSize={20} icon="formkit:right" />}
                                        />
                                        <Item
                                            onClick={logout}
                                            title="Đăng xuất"
                                            prefix={<img src={images.logout} width={28} />}
                                            suffix={<Icon fontSize={20} icon="formkit:right" />}
                                        />
                                    </List>
                                </Box>
                            </>
                            :
                            <Box m={4}>
                                <List className="bg-white rounded-lg shadow-sm">
                                    <ManagementTitle title="Đăng nhập" />
                                    <Item
                                        onClick={() => navigate('/login')}
                                        title="Bằng tài khoản"
                                        prefix={<img src={images.login} width={30} />}
                                        suffix={<Icon fontSize={20} icon="formkit:right" />}
                                    />
                                    <Item
                                        onClick={() => loginWithZalo()}
                                        title="Liên kết số điện thoại"
                                        prefix={<div className="bg-blue-600 rounded-lg pt-[1px] pr-[2px]"><img src={images.zalo} width={30}/></div>}
                                        suffix={<Icon fontSize={20} icon="formkit:right" />}
                                        subTitle={'Yêu cầu truy cập số điện thoại'}
                                    />
                                </List>
                            </Box>
                    }
                    <Box m={4}>
                        <List className="bg-white rounded-lg shadow-sm">
                            <ManagementTitle title="Cài đặt" />

                            <Item
                                onClick={async () => {
                                    await openShareSheet({
                                        type: "link",
                                        data: {
                                            link: "https://zalo.me/s/3941810339733563958/",
                                            chatOnly: false,
                                        },
                                    });
                                }}
                                title="Chia sẻ ứng dụng"
                                prefix={<img src={images.share} width={30} />}
                                suffix={<Icon fontSize={20} icon="formkit:right" />}
                            />
                            <Item
                                onClick={() => createMiniAppShortcut()}
                                title="Thêm vào màn hình chính"
                                prefix={<img src={images.shortcut} width={30} />}
                                suffix={<Icon fontSize={20} icon="formkit:right" />}
                            />
                        </List>
                    </Box>
                </Box>
            </Box>
        </Page>
    )
}

export default AccountPage