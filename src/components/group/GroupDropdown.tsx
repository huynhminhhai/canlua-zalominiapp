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
            <button
                className="border py-[2px] px-[12px] rounded-[16px] bg-gray-50"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
            >
                <Icon icon="solar:menu-dots-bold" fontSize={24} color="#2262c6" />
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-40 bg-gray-50 border rounded-lg shadow-md z-10">
                    <ul className="py-1 text-[15px] leading-[22px] font-semibold text-gray-700">
                        <li className="px-4 py-3 flex items-center gap-[8px]" onClick={(e) => handleEdit(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 32 32"><path fill="#353844" d="M28.565 3.434a4.89 4.89 0 0 0-6.915 0L4.357 20.73a3.7 3.7 0 0 0-1.002 1.84l-1.333 6.22a1 1 0 0 0 1.188 1.188l6.22-1.333a3.7 3.7 0 0 0 1.84-1.002l17.295-17.295a4.89 4.89 0 0 0 0-6.914m-5.5 1.414a2.89 2.89 0 0 1 4.085 4.086l-.9.9l-4.086-4.085zm-2.316 2.315l4.086 4.086L9.857 26.23a1.7 1.7 0 0 1-.846.46L4.3 27.7l1.01-4.71a1.7 1.7 0 0 1 .46-.846z" /></svg>
                            Chỉnh sửa
                        </li>
                        <hr />
                        <li className="px-4 py-3 flex items-center gap-[8px] text-[#bd373a]" onClick={(e) => handleDelete(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 2048 2048"><path fill="#bd373a" d="M1792 384h-128v1472q0 40-15 75t-41 61t-61 41t-75 15H448q-40 0-75-15t-61-41t-41-61t-15-75V384H128V256h512V128q0-27 10-50t27-40t41-28t50-10h384q27 0 50 10t40 27t28 41t10 50v128h512zM768 256h384V128H768zm768 128H384v1472q0 26 19 45t45 19h1024q26 0 45-19t19-45zM768 1664H640V640h128zm256 0H896V640h128zm256 0h-128V640h128z" /></svg>
                            Xóa
                        </li>
                    </ul>
                </div>
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