import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import GroupUpdateForm from "./GroupUpdateForm";
import { ConfirmModal } from "components/modal";
import { useDeleteNhomThuMua } from "apiRequest/nhomThuMua";
import { GroupItemType } from "./type";

type GroupDropdownProps = {
    data: GroupItemType;
};

const GroupDropdown: React.FC<GroupDropdownProps> = ({
    data
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const { mutate: deleteNhomThuMua } = useDeleteNhomThuMua();

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
            deleteNhomThuMua(data.id);
        }, 'Xác nhận xóa', `Bạn có chắc chắn muốn xóa nhóm thu mua ${data.tenNhom}?`)
    };

    return (
        <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            {/* Trigger Button */}
            <button
                className="w-12 h-12 border border-gray-100 rounded-full flex items-center justify-center"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
            >
                <Icon
                    icon="solar:menu-dots-linear"
                    fontSize={24}
                    className={`text-heading-color transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                        {/* Edit Option */}
                        <button
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-150 group"
                            onClick={(e) => handleEdit(e)}
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Icon
                                    icon="solar:pen-bold"
                                    fontSize={16}
                                    className="text-blue-600"
                                />
                            </div>
                            <div>
                                <div className="text-[16px] font-medium">Chỉnh sửa</div>
                                <div className="text-sm text-gray-500 font-medium">Cập nhật thông tin nhóm</div>
                            </div>
                        </button>

                        {/* Divider */}
                        <div className="mx-3 my-1 border-t border-gray-100"></div>

                        {/* Delete Option */}
                        <button
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                            onClick={(e) => handleDelete(e)}
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                <Icon
                                    icon="solar:trash-bin-trash-bold"
                                    fontSize={16}
                                    className="text-red-600"
                                />
                            </div>
                            <div>
                                <div className="text-[16px] font-medium">Xóa nhóm</div>
                                <div className="text-sm text-gray-500 font-medium">Không thể hoàn tác</div>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-10 bg-black bg-opacity-10"
                    onClick={() => setOpen(false)}
                />
            )}

            <GroupUpdateForm
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

export default GroupDropdown;