import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { ConfirmModal } from "components/modal";
import FarmerUpdateForm from "./FarmerUpdateForm";
import { PhienCan } from "./type";
import { useDeletePhienCan } from "apiRequest/phienCan";

type FarmerDropdownProps = {
    data: PhienCan;
};

const FarmerDropdown: React.FC<FarmerDropdownProps> = ({
    data
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const { mutate: deletePhienCan } = useDeletePhienCan();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openConfirmModal = (action: () => void, title: string, message: string) => {
        setConfirmAction(() => action);
        setModalContent({ title, message });
        setConfirmVisible(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
            setConfirmVisible(false);
            setConfirmAction(null);
        }
    };

    const handleCancel = () => {
        setConfirmVisible(false);
        setConfirmAction(null);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        setShowUpdateForm(true);
        setOpen(false);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setOpen(false);

        openConfirmModal(() => {
            deletePhienCan(data.id);
        }, 'Xác nhận xóa', 'Bạn có chắc chắn muốn xóa hộ hộ bán lúa này?')
    };

    return (
        <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            {/* Trigger Button */}
            <button
                className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 backdrop-blur-sm transition-all duration-200 flex items-center justify-center shadow-lg border border-white border-opacity-20"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
            >
                <Icon
                    icon="solar:menu-dots-linear"
                    fontSize={20}
                    className={`text-white transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-30 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                        {/* Send Invoice Option */}
                        {/* <button
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-green-50 transition-colors duration-150 group"
                            onClick={async (e) => {
                                e.stopPropagation();
                                setOpen(false);
                                await openShareSheet({
                                    type: "image",
                                    data: {
                                        imageUrls: ["https://congnghemavach.com.vn/wp-content/uploads/2017/08/giay-in-hoa-don.jpg"]
                                    },
                                });
                            }}
                        >
                            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                                <Icon
                                    icon="solar:share-bold"
                                    fontSize={18}
                                    className="text-green-600"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[16px] font-semibold">Gửi hóa đơn</div>
                                <div className="text-sm font-medium text-gray-500 truncate">Chia sẻ hóa đơn cân lúa</div>
                            </div>
                        </button> */}

                        {/* <button
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-green-50 transition-colors duration-150 group"
                            onClick={async (e) => {
                                e.stopPropagation();
                                setOpen(false);

                            }}
                        >
                            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                                <Icon
                                    icon="file-icons:microsoft-excel"
                                    fontSize={18}
                                    className="text-green-600"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[16px] font-semibold">Xuất Excel</div>
                                <div className="text-sm font-medium text-gray-500 truncate">Tải về dữ liệu dưới dạng Excel</div>
                            </div>
                        </button> */}

                        {/* Divider */}
                        {/* <div className="mx-3 my-2 border-t border-gray-100"></div> */}

                        {/* Edit Option */}
                        <button
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-150 group"
                            onClick={(e) => handleEdit(e)}
                        >
                            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                                <Icon
                                    icon="solar:pen-bold"
                                    fontSize={18}
                                    className="text-blue-600"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[16px] font-semibold">Chỉnh sửa</div>
                                <div className="text-sm font-medium text-gray-500 truncate">Cập nhật thông tin hộ bán lúa</div>
                            </div>
                        </button>

                        {/* Divider */}
                        <div className="mx-3 my-2 border-t border-gray-100"></div>

                        {/* Delete Option */}
                        <button
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                            onClick={(e) => handleDelete(e)}
                        >
                            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                                <Icon
                                    icon="solar:trash-bin-trash-bold"
                                    fontSize={18}
                                    className="text-red-600"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[16px] font-semibold">Xóa hộ bán lúa</div>
                                <div className="text-sm font-medium text-gray-500 truncate">Không thể hoàn tác</div>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-10"
                    onClick={() => setOpen(false)}
                />
            )}

            <FarmerUpdateForm
                visible={showUpdateForm}
                onClose={() => setShowUpdateForm(false)}
                data={data}
            />

            <ConfirmModal
                visible={isConfirmVisible}
                title={modalContent.title}
                message={modalContent.message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default FarmerDropdown;