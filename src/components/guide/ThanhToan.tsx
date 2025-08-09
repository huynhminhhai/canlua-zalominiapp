import { Icon } from "@iconify/react";
import images from "assets/images";
import React, { useState } from "react"
import { Box, Button, List, Sheet, Text } from "zmp-ui"

const ThanhToan: React.FC = () => {

    const [sheetVisible, setSheetVisible] = useState(false);
    const { Item } = List;

    return (
        <>
            <Item
                onClick={() => {
                    setSheetVisible(true);
                }}
                title="Thanh toán"
                prefix={<img src={images.guide} width={30} />}
                suffix={<Icon fontSize={20} icon="formkit:right" />}
            />
            <Sheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                autoHeight
                mask
                handler
                swipeToClose
            >
                <Box p={2} className="custom-bottom-sheet" flex flexDirection="column">
                    <Box mb={4}>
                        <Text.Title className="text-center">
                            Thanh toán
                        </Text.Title>
                    </Box>
                    <Box mb={4} className="bottom-sheet-cover max-h-[70vh] overflow-y-auto">
                        <div className="p-4 space-y-5 text-[16px] leading-[24px] text-gray-700">
                            <p>
                                Mặc định, khi mới tạo, tài khoản sẽ ở chế độ{" "}
                                <strong>miễn phí</strong>, cho phép người dùng tạo tối đa{" "}
                                <strong>1 nhóm</strong> và <strong>1 hộ bán lúa</strong>.
                            </p>

                            <img
                                src={images.thanhtoan1}
                                alt="Màn hình đăng ký gói nâng cấp"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <hr className="mt-3" />
                            <img
                                src={images.thanhtoan2}
                                alt="Màn hình đăng ký gói nâng cấp"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <hr className="mt-3" />
                            <img
                                src={images.thanhtoan3}
                                alt="Màn hình đăng ký gói nâng cấp"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <div className="italic text-gray-600 mt-2 text-center">
                                Màn hình đăng ký gói nâng cấp
                            </div>

                            <p>
                                Khi đạt đến giới hạn này, ứng dụng sẽ hiển thị{" "}
                                <strong>thông báo</strong> để người dùng biết và{" "}
                                <span className="text-red-500 font-semibold">không thể tạo thêm mới</span>.
                            </p>

                            <img
                                src={images.thanhtoan4}
                                alt="Màn hình thông báo giới hạn tài khoản miễn phí"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <div className="italic text-gray-600 mt-2 text-center">
                                Màn hình thông báo giới hạn tài khoản miễn phí
                            </div>
                        </div>
                    </Box>
                    <Box style={{ flex: 1 }} pr={1}>
                        <Button
                            size="medium"
                            fullWidth
                            variant="secondary"
                            onClick={() => {
                                setSheetVisible(false);
                            }}
                        >
                            Đóng
                        </Button>
                    </Box>
                </Box>
            </Sheet>
        </>
    )
}

export default ThanhToan