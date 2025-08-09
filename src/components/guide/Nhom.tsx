import { Icon } from "@iconify/react";
import images from "assets/images";
import React, { useState } from "react"
import { Box, Button, List, Sheet, Text } from "zmp-ui"

const Nhom: React.FC = () => {

    const [sheetVisible, setSheetVisible] = useState(false);
    const { Item } = List;

    return (
        <>
            <Item
                onClick={() => {
                    setSheetVisible(true);
                }}
                title="Quản lý nhóm"
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
                            Quản lý nhóm
                        </Text.Title>
                    </Box>
                    <Box mb={4} className="bottom-sheet-cover max-h-[70vh] overflow-y-auto">
                        <div className="p-4 space-y-5 text-[16px] leading-[24px] text-gray-700">
                            {/* Giới thiệu */}
                            <p>
                                Màn hình <span className="font-semibold text-primary">Trang chủ</span> của
                                ứng dụng đồng thời là màn hình{" "}
                                <span className="font-semibold">Danh sách nhóm</span>, nơi người dùng quản
                                lý thông tin các nhóm cân. Mỗi nhóm có thể đại diện cho
                                tên xe, tên ghe, hoặc tên nhóm thu mua, tùy
                                theo mục đích sử dụng.
                            </p>

                            {/* Cách thêm nhóm */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    Cách thêm nhóm
                                </h3>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>
                                        Từ màn hình <strong>Danh sách nhóm</strong>, nhấn vào nút{" "}
                                        <strong>“Thêm mới”</strong>.
                                    </li>
                                    <li>
                                        Màn hình <strong>Thêm mới nhóm</strong> sẽ hiển thị. Tại đây, bạn nhập
                                        các thông tin sau:
                                        <ul className="list-disc list-inside ml-5 space-y-1">
                                            <li>
                                                <strong>Tên nhóm</strong> (bắt buộc) - ví dụ: tên xe, tên ghe, hoặc
                                                tên nhóm thu mua.
                                            </li>
                                            <li>
                                                <strong>Số điện thoại liên hệ</strong> (không bắt buộc).
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        Sau khi hoàn tất, nhấn <strong>“Lưu lại”</strong> để tạo nhóm mới.
                                    </li>
                                </ol>
                                <img
                                    src={images.nhom1}
                                    alt="Màn hình thêm nhóm"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.nhom2}
                                    alt="Màn hình thêm nhóm"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">
                                    Màn hình thêm nhóm
                                </div>
                            </section>

                            {/* Cách chỉnh sửa nhóm */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    Cách chỉnh sửa nhóm
                                </h3>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>
                                        Từ màn hình <strong>Danh sách nhóm</strong>, nhấn vào nút{" "}
                                        <span className="italic">“3 chấm”</span> trên nhóm mà bạn muốn chỉnh
                                        sửa.
                                    </li>
                                    <li>Chọn “Chỉnh sửa”.</li>
                                    <li>
                                        Màn hình <strong>Chỉnh sửa nhóm</strong> sẽ hiển thị. Tại đây, bạn có
                                        thể chỉnh sửa các thông tin sau:
                                        <ul className="list-disc list-inside ml-5 space-y-1">
                                            <li>
                                                <strong>Tên nhóm</strong> (bắt buộc).
                                            </li>
                                            <li>
                                                <strong>Số điện thoại liên hệ</strong> (không bắt buộc).
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        Sau khi hoàn tất, nhấn <strong>“Lưu lại”</strong> để cập nhật thông tin
                                        nhóm.
                                    </li>
                                </ol>
                                <img
                                    src={images.nhom3}
                                    alt="Màn hình chỉnh sửa nhóm"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.nhom4}
                                    alt="Màn hình chỉnh sửa nhóm"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">
                                    Màn hình chỉnh sửa nhóm
                                </div>
                            </section>

                            {/* Cách xóa nhóm */}
                            <section>
                                <h3 className="text-[18px] leading-[24px] font-bold text-primary border-l-4 border-primary pl-2 mb-2">
                                    Cách xóa nhóm
                                </h3>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>
                                        Từ màn hình <strong>Danh sách nhóm</strong>, nhấn vào nút{" "}
                                        <span className="italic">“3 chấm”</span> trên nhóm mà bạn muốn xóa.
                                    </li>
                                    <li>Chọn “Xóa nhóm”.</li>
                                    <li>
                                        Màn hình <strong>Xác nhận xóa nhóm</strong> sẽ hiển thị, chọn{" "}
                                        <strong>“Đồng ý”</strong> để hoàn tất việc xóa nhóm.
                                    </li>
                                </ol>
                                <img
                                    src={images.nhom5}
                                    alt="Màn hình xóa nhóm"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <hr className="mt-3" />
                                <img
                                    src={images.nhom6}
                                    alt="Màn hình xóa nhóm"
                                    className="mt-3 w-full rounded-xl border shadow-sm"
                                />
                                <div className="italic text-gray-600 mt-2 text-center">
                                    Màn hình xóa nhóm
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

export default Nhom