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
                className="border py-[6px] px-[16px] rounded-lg bg-gray-50"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
            >
                <Icon icon="solar:menu-dots-bold" fontSize={24} color="#2262c6" />
            </button>

            {open && (  
                <div className="absolute right-0 mt-1 w-40 bg-gray-100 border rounded-lg shadow-lg z-10">
                    <ul className="py-1 text-[15px] leading-[22px] font-semibold text-gray-700">
                        <li className="px-6 py-3 flex items-center gap-[8px]" onClick={(e) => handleEdit(e)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#353844" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9m67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32"/></svg>
                            Chỉnh sửa
                        </li>
                        <hr />
                        <li className="px-6 py-3 flex items-center gap-[8px] text-[#bd373a]" onClick={(e) => handleDelete(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 2048 2048"><path fill="#bd373a" d="M1792 384h-128v1472q0 40-15 75t-41 61t-61 41t-75 15H448q-40 0-75-15t-61-41t-41-61t-15-75V384H128V256h512V128q0-27 10-50t27-40t41-28t50-10h384q27 0 50 10t40 27t28 41t10 50v128h512zM768 256h384V128H768zm768 128H384v1472q0 26 19 45t45 19h1024q26 0 45-19t19-45zM768 1664H640V640h128zm256 0H896V640h128zm256 0h-128V640h128z" /></svg>
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