import { Icon } from "@iconify/react";
import images from "assets/images";
import React, { useState } from "react"
import { Box, Button, List, Sheet, Text } from "zmp-ui"

const CauHinh: React.FC = () => {

    const [sheetVisible, setSheetVisible] = useState(false);
    const { Item } = List;

    return (
        <>
            <Item
                onClick={() => {
                    setSheetVisible(true);
                }}
                title="Cấu hình hệ thống"
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
                            Cấu hình hệ thống
                        </Text.Title>
                    </Box>
                    <Box mb={4} className="bottom-sheet-cover max-h-[70vh] overflow-y-auto">
                        <div className="p-4 space-y-5 text-[16px] leading-[24px] text-gray-700">
                            <p>
                                Từ màn hình <strong>Trang chủ</strong>, người dùng chọn mục{" "}
                                <strong>“Cấu hình”</strong> để chuyển đến màn hình{" "}
                                <strong>Cấu hình hệ thống</strong>.
                            </p>

                            <img
                                src={images.cauhinh1}
                                alt="Màn hình Cấu hình hệ thống"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <div className="italic text-gray-600 mt-2 text-center">
                                Màn hình Cấu hình hệ thống
                            </div>

                            {/* 3.1. Quy cách trừ bì */}
                            <p className="font-semibold">3.1. Quy cách trừ bì</p>
                            <p>
                                Quy cách trừ bì là cách tính khối lượng bao bì (như bao đựng lúa) để trừ ra khỏi tổng khối lượng,
                                nhằm xác định chính xác trọng lượng lúa thực tế.
                            </p>
                            <p className="font-semibold">Các bước nhập:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Trên màn hình Cấu hình hệ thống, tìm và nhấn vào ô <strong>“Quy cách trừ bì”</strong>.</li>
                                <li>
                                    Nhập giá trị quy cách mà bạn muốn áp dụng.<br />
                                    <span className="italic">
                                        Ví dụ: Nếu nhập 10, điều này có nghĩa là mỗi 10 lần cân (bao) sẽ được quy đổi thành 1 kg bao bì.
                                    </span>
                                </li>
                            </ol>
                            <p className="mt-2">
                                <strong>Công thức tính khối lượng bao bì:</strong> Khối lượng bao bì = Số lần cân (bao) ÷ Quy cách trừ bì
                            </p>

                            <img
                                src={images.cauhinh2}
                                alt="Màn hình nhập quy cách trừ bì"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <div className="italic text-gray-600 mt-2 text-center">
                                Màn hình nhập quy cách trừ bì
                            </div>

                            {/* 3.2. Cài đặt nhóm cân */}
                            <p className="font-semibold">3.2. Cài đặt nhóm cân</p>
                            <p>
                                Chức năng Cài đặt nhóm cân giúp người dùng dễ dàng quản lý và theo dõi kết quả tổng cân theo từng nhóm cố định,
                                phục vụ cho việc thống kê và đối chiếu chính xác.
                            </p>
                            <p className="font-semibold">Các lựa chọn nhóm cân:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Nhóm 75 mã cân: 75 mã cân/trang – Hiển thị 3 bảng (mỗi bảng gồm 25 mã cân).</li>
                                <li>Nhóm 100 mã cân: 100 mã cân/trang – Hiển thị 4 bảng (mỗi bảng gồm 25 mã cân).</li>
                            </ul>
                            <p>
                                Khi chọn nhóm cân, ứng dụng sẽ tự động tính tổng khối lượng và hiển thị kết quả sau số mã cân tương ứng.
                            </p>
                            <p className="font-semibold">Cách sử dụng:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Trên màn hình Cấu hình hệ thống, chọn <strong>Nhóm 75 mã cân</strong> hoặc <strong>Nhóm 100 mã cân</strong>.</li>
                                <li>Sau khi chọn, hệ thống sẽ:
                                    <ul className="list-disc list-inside ml-5 mt-1">
                                        <li>Tự động chia mã cân thành từng trang.</li>
                                        <li>Hiển thị tổng khối lượng theo từng trang đã chọn.</li>
                                        <li>Hiển thị số bảng tương ứng để dễ theo dõi.</li>
                                    </ul>
                                </li>
                            </ol>

                            <img
                                src={images.cauhinh3}
                                alt="Màn hình chọn nhóm mã cân"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <div className="italic text-gray-600 mt-2 text-center">
                                Màn hình chọn nhóm mã cân
                            </div>

                            {/* 3.3. Quy cách nhập liệu */}
                            <p className="font-semibold">3.3. Quy cách nhập liệu</p>
                            <p>
                                Chức năng Quy cách nhập liệu giúp người dùng nhập khối lượng lúa theo nhiều cách khác nhau, phù hợp với từng loại cân hoặc thói quen.
                            </p>
                            <p className="font-semibold">Các quy cách nhập liệu:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Nhập 2 chữ số (VD: 75 → 75 kg) – Phù hợp khi ≤ 99 kg.</li>
                                <li>Nhập 3 chữ số có số dư (VD: 755 → 75.5 kg) – Chữ số cuối là phần thập phân.</li>
                                <li>Nhập 3 chữ số (VD: 155 → 155 kg) – Dùng khi cần nhập chính xác trọng lượng 3 số.</li>
                                <li>Nhập 4 chữ số có số dư (VD: 1505 → 150.5 kg) – Dùng khi cân trọng lượng lớn có phần lẻ.</li>
                            </ul>
                            <p className="font-semibold">Cách sử dụng:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Trên màn hình Cấu hình hệ thống, chọn quy cách nhập liệu phù hợp.</li>
                                <li>Hệ thống sẽ tự động xử lý và hiển thị kết quả chuẩn trong quá trình nhập.</li>
                            </ol>

                            <img
                                src={images.cauhinh4}
                                alt="Màn hình chọn quy cách nhập liệu"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <hr className="mt-3" />
                            <img
                                src={images.cauhinh5}
                                alt="Màn hình chọn quy cách nhập liệu"
                                className="mt-3 w-full rounded-xl border shadow-sm"
                            />
                            <div className="italic text-gray-600 mt-2 text-center">
                                Màn hình chọn quy cách nhập liệu
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

export default CauHinh