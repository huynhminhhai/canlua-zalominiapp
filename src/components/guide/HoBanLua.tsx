import { Icon } from "@iconify/react";
import images from "assets/images";
import React, { useState } from "react"
import { Box, Button, List, Sheet, Text } from "zmp-ui"

const HoBanLua: React.FC = () => {

    const [sheetVisible, setSheetVisible] = useState(false);
    const { Item } = List;

    return (
        <>
            <Item
                onClick={() => {
                    setSheetVisible(true);
                }}
                title="Quản lý hộ bán lúa"
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
                            Quản lý hộ bán lúa
                        </Text.Title>
                    </Box>
                    <Box mb={4} className="bottom-sheet-cover max-h-[70vh] overflow-y-auto">
                        <div className="p-4 space-y-5 text-[16px] leading-[24px] text-gray-700">
                            {/* Giới thiệu */}
                            <p>
                                Từ màn hình <span className="font-semibold text-primary">Danh sách nhóm</span>,
                                người dùng chọn <strong>“Xem chi tiết”</strong> để chuyển đến màn hình{" "}
                                <span className="font-semibold">Danh sách Hộ bán lúa</span>.
                                Đây là nơi quản lý thông tin về các hộ dân bán lúa cho đại lý thu mua, cho phép
                                theo dõi và cập nhật danh sách dễ dàng.
                            </p>

                            <img
                                src={images.hobanlua1}
                                alt="Màn hình danh sách hộ bán lúa"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <div className="italic text-gray-600 mt-2 text-center">
                                Màn hình danh sách hộ bán lúa
                            </div>

                            {/* Cách thêm */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    Cách thêm
                                </h3>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>
                                        Từ màn hình <strong>Danh sách Hộ bán lúa</strong>, nhấn vào nút{" "}
                                        <strong>“Thêm mới”</strong>.
                                    </li>
                                    <li>
                                        Màn hình <strong>Thêm mới</strong> sẽ hiển thị. Tại đây, bạn nhập các
                                        thông tin sau:
                                        <ul className="list-disc list-inside ml-5 space-y-1">
                                            <li>
                                                <strong>Tên Hộ bán lúa</strong> (bắt buộc).
                                            </li>
                                            <li>
                                                <strong>Đơn giá thu mua</strong> (không bắt buộc – có thể cập nhật
                                                khi thực hiện nhập liệu số cân).
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        Sau khi hoàn tất, nhấn <strong>“Lưu lại”</strong> để tạo hộ bán lúa mới.
                                    </li>
                                </ol>
                                <img
                                    src={images.hobanlua2}
                                    alt="Màn hình thêm mới hộ bán lúa"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.hobanlua3}
                                    alt="Màn hình thêm mới hộ bán lúa"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">
                                    Màn hình thêm mới hộ bán lúa
                                </div>
                            </section>

                            {/* Cách chỉnh sửa */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    Cách chỉnh sửa
                                </h3>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>
                                        Từ màn hình <strong>Danh sách Hộ bán lúa</strong>, nhấn vào nút{" "}
                                        <span className="italic">“3 chấm”</span> trên hộ bán lúa cần chỉnh sửa.
                                    </li>
                                    <li>Chọn “Chỉnh sửa”.</li>
                                    <li>
                                        Màn hình <strong>Chỉnh sửa thông tin hộ bán lúa</strong> sẽ hiển thị.
                                        Tại đây, bạn nhập:
                                        <ul className="list-disc list-inside ml-5 space-y-1">
                                            <li>
                                                <strong>Tên Hộ bán lúa</strong> (bắt buộc).
                                            </li>
                                            <li>
                                                <strong>Đơn giá thu mua</strong> (không bắt buộc – có thể cập nhật
                                                khi thực hiện nhập liệu số cân).
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        Khi hoàn tất, nhấn <strong>“Lưu lại”</strong> để cập nhật thông tin.
                                    </li>
                                </ol>
                                <img
                                    src={images.hobanlua4}
                                    alt="Màn hình chỉnh sửa hộ bán lúa"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.hobanlua5}
                                    alt="Màn hình chỉnh sửa hộ bán lúa"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">
                                    Màn hình chỉnh sửa hộ bán lúa
                                </div>
                            </section>

                            {/* Cách xóa */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    Cách xóa
                                </h3>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>
                                        Từ màn hình <strong>Danh sách Hộ bán lúa</strong>, nhấn vào nút{" "}
                                        <span className="italic">“3 chấm”</span> trên hộ bán lúa cần xóa.
                                    </li>
                                    <li>Chọn “Xóa nông dân”.</li>
                                    <li>
                                        Màn hình <strong>Xác nhận xóa</strong> sẽ hiển thị, chọn{" "}
                                        <strong>“Đồng ý”</strong> để hoàn tất.
                                    </li>
                                </ol>
                                <img
                                    src={images.hobanlua6}
                                    alt="Màn hình xóa hộ bán lúa"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.hobanlua7}
                                    alt="Màn hình xóa hộ bán lúa"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">
                                    Màn hình xóa hộ bán lúa
                                </div>
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

export default HoBanLua