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
                            <div onClick={() => navigate('/profile-account')} className="flex items-center gap-3 bg-white rounded-lg p-4" >
                                <div className="flex-1">
                                    <Avatar className="border-[2px] border-primary-color" src={images.vnpt} size={80} />
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="text-[20px] leading-6 font-semibold text-primary-color mb-2 tracking-[1px]">{account && account?.phoneNumber}</div>

                                    <div className="text-[15px] font-semibold flex items-center gap-1">
                                        <Icon icon="fluent:premium-16-filled" fontSize={16} className="mb-[2px]" />
                                        {
                                            isLoading && <Icon icon="line-md:loading-twotone-loop" fontSize={16} />
                                        }
                                        {
                                            data && data?.result ? `Gói ${data?.result?.chuKy} tháng` :
                                                'Tài khoản miễn phí'
                                        }
                                    </div>
                                    {
                                        data && data?.result?.ngayKetThuc &&
                                        <div className="font-semibold flex items-center gap-1">
                                            {/* <Icon icon={'ri:time-fill'} fontSize={16} /> */}
                                            Hạn sử dụng:
                                            <span className="text-orange-600">
                                                {formatDate(data?.result?.ngayKetThuc)}
                                            </span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </Box>
                    }

                    {
                        accessToken ?
                            <>

                                <Box m={4}>
                                    <List className="bg-white rounded-lg">
                                        <ManagementTitle title="Tài khoản" />
                                        <Item
                                            onClick={() => navigate('/plan')}
                                            title="Nâng cấp tài khoản"
                                            prefix={<Icon fontSize={28} icon="fluent:premium-28-regular" ></Icon>}
                                            suffix={<Icon fontSize={20} icon="formkit:right" />}
                                        />
                                        <Item
                                            onClick={logout}
                                            title="Đăng xuất"
                                            prefix={<Icon fontSize={28} icon="clarity:logout-line" />}
                                            suffix={<Icon fontSize={20} icon="formkit:right" />}
                                        />
                                    </List>
                                </Box>
                            </>
                            :
                            <Box m={4}>
                                <List className="bg-white rounded-lg">
                                    <ManagementTitle title="Đăng nhập" />
                                    <Item
                                        onClick={() => navigate('/login')}
                                        title="Bằng tài khoản"
                                        prefix={<Icon fontSize={28} icon="clarity:login-line" ></Icon>}
                                        suffix={<Icon fontSize={20} icon="formkit:right" />}
                                    />
                                    <Item
                                        onClick={() => loginWithZalo()}
                                        title="Liên kết số điện thoại"
                                        prefix={<img src={images.zalo} width={30} />}
                                        suffix={<Icon fontSize={20} icon="formkit:right" />}
                                        subTitle={'Yêu cầu truy cập số điện thoại'}
                                    />
                                </List>
                            </Box>
                    }
                    <Box m={4}>
                        <List className="bg-white rounded-lg">
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
                                prefix={<Icon fontSize={28} icon="ph:share-fat-light" ></Icon>}
                                suffix={<Icon fontSize={20} icon="formkit:right" />}
                            />
                            <Item
                                onClick={() => createMiniAppShortcut()}
                                title="Thêm vào màn hình chính"
                                prefix={<Icon fontSize={28} icon="iconoir:apple-shortcuts" ></Icon>}
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