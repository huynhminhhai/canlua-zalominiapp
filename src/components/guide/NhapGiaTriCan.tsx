import { Icon } from "@iconify/react";
import images from "assets/images";
import React, { useState } from "react"
import { Box, Button, List, Sheet, Text } from "zmp-ui"

const NhapGiaTriCan: React.FC = () => {

    const [sheetVisible, setSheetVisible] = useState(false);
    const { Item } = List;

    return (
        <>
            <Item
                onClick={() => {
                    setSheetVisible(true);
                }}
                title="Nhập liệu số cân"
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
                            Nhập liệu số cân
                        </Text.Title>
                    </Box>
                    <Box mb={4} className="bottom-sheet-cover max-h-[70vh] overflow-y-auto">
                        <div className="p-4 space-y-5 text-[16px] leading-[24px] text-gray-700">
                            {/* Giới thiệu */}
                            <p>
                                Từ màn hình <span className="font-semibold text-primary">Danh sách hộ bán lúa</span>,
                                chọn <span className="font-semibold">“Mở”</span> để xem
                                <span className="font-semibold text-primary"> Chi tiết hộ bán lúa</span>.
                            </p>

                            {/* 1. Nhóm thông tin có thể tùy chỉnh */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    1. Nhóm thông tin có thể tùy chỉnh
                                </h3>
                                <ul className="space-y-1">
                                    <li><strong>Tên hộ bán lúa:</strong> Tạo sẵn, có thể chỉnh.</li>
                                    <li><strong>Đơn giá thu mua:</strong> Thiết lập trước, có thể chỉnh.</li>
                                    <li><strong>Trừ bao bì:</strong> Lấy từ cấu hình hệ thống, chỉnh riêng.</li>
                                    <li><strong>Trừ tạp chất:</strong> Nhập thủ công.</li>
                                    <li><strong>Trừ tiền cọc:</strong> Nhập số tiền đã đặt cọc.</li>
                                    <li><strong>Trừ tiền đã trả:</strong> Nhập số tiền đã thanh toán.</li>
                                </ul>
                                <img
                                    src={images.nhapsolieucan1}
                                    alt="Màn hình tùy chỉnh quy cách trừ bì"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.nhapsolieucan3}
                                    alt="Màn hình tùy chỉnh quy cách trừ bì"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">Màn hình tùy chỉnh quy cách trừ bì</div>
                            </section>

                            {/* 2. Nhóm thông tin tự động */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    2. Nhóm thông tin tự động tính
                                </h3>
                                <ul className="space-y-1">
                                    <li><strong>Tổng khối lượng</strong> = tổng tất cả lần cân.</li>
                                    <li><strong>Số cân lần</strong> = số lần nhập dữ liệu.</li>
                                    <li><strong>Khối lượng còn lại</strong> = Tổng khối lượng – Bao bì – Tạp chất.</li>
                                    <li><strong>Tổng tiền</strong> = Khối lượng còn lại × Đơn giá.</li>
                                    <li><strong>Tổng tiền còn lại</strong> = Tổng tiền – Tiền cọc – Tiền đã trả.</li>
                                </ul>
                                <img
                                    src={images.nhapsolieucan2}
                                    alt="Màn hình thông tin tự động"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">Màn hình thông tin tự động tạo từ hệ thống</div>
                                <p className="text-gray-600 mt-2">
                                    Có thể bật <strong>“Đã trả đủ tiền”</strong> để tự động điền số tiền còn lại.
                                </p>
                                <img
                                    src={images.nhapsolieucan4}
                                    alt="Màn hình thông tin tự động"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">Chức năng "Đã trả đủ tiền"</div>
                            </section>

                            {/* 3. Bảng nhập liệu */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    3. Bảng nhập liệu số cân
                                </h3>
                                <p>
                                    Nhập các giá trị cân theo từng lần, giúp quản lý và tổng hợp số liệu chính xác.
                                </p>
                                <ol className="list-decimal list-inside space-y-1 mt-2">
                                    <li>Nhấn <strong>“Bắt đầu nhập số cân”</strong>.</li>
                                    <li>Ứng dụng tự chuyển đến ô nhập liệu đầu tiên hoặc ô trống.</li>
                                    <li>Nhập theo <strong>Quy cách nhập liệu</strong> đã cấu hình.</li>
                                    <li>Sau khi nhập xong, hệ thống tự sang ô kế tiếp.</li>
                                    <li>Nhấn <strong>“Chuyển sang chế độ xem”</strong> để tạm dừng và khóa bảng.</li>
                                </ol>
                                <img
                                    src={images.nhapsolieucan5}
                                    alt="Màn hình nhập liệu số cân"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.nhapsolieucan6}
                                    alt="Màn hình nhập liệu số cân"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.nhapsolieucan7}
                                    alt="Màn hình nhập liệu số cân"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">Màn hình nhập liệu số cân</div>
                            </section>
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

export default NhapGiaTriCan