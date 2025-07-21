import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { ConfirmModal } from "components/modal";
import FarmerUpdateForm from "./FarmerUpdateForm";
import { openShareSheet } from "zmp-sdk/apis";
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
        }, 'Xác nhận xóa', 'Bạn có chắc chắn muốn xóa hộ nông dân này?')
    };

    return (
        // <div className="relative" ref={dropdownRef}>
        //     <div
        //         className="flex justify-center items-center"
        //         onClick={(e) => {
        //             e.stopPropagation();
        //             setOpen((prev) => !prev);
        //         }}
        //     >
        //         <Icon icon='mage:dots' fontSize={32} color="#fff" />
        //     </div>

        //     {open && (
        //         <div className="absolute left-[4px] mt-1 w-52 bg-gray-50 border rounded-lg shadow-md z-10">
        //             <ul className="py-1 text-[15px] leading-[22px] font-semibold text-gray-700">
        //                 <li
        //                     className="px-4 py-3 flex items-center gap-[8px]"
        //                     onClick={async () => {
        //                         await openShareSheet({
        //                             type: "image",
        //                             data: {
        //                                 imageUrls: ["https://congnghemavach.com.vn/wp-content/uploads/2017/08/giay-in-hoa-don.jpg"]
        //                             },
        //                         });
        //                     }}
        //                 >
        //                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="#353844" d="M14 3a1 1 0 1 1 0 2H7.5A2.5 2.5 0 0 0 5 7.5v17A2.5 2.5 0 0 0 7.5 27h17a2.5 2.5 0 0 0 2.5-2.5V19a1 1 0 1 1 2 0v5.5a4.5 4.5 0 0 1-4.5 4.5h-17A4.5 4.5 0 0 1 3 24.5v-17A4.5 4.5 0 0 1 7.5 3zm5.58-.907a1 1 0 0 1 1.067.146l10 8.5a1 1 0 0 1 0 1.523l-10 8.5A1 1 0 0 1 18.999 20v-3.96c-3.193.258-5.636 1.722-7.34 3.213a15.6 15.6 0 0 0-2.115 2.26c-.234.307-.407.56-.52.733c-.085.13-.136.215-.152.243l-.006.006l.001.001A1 1 0 0 1 7 22.036c0-.222-.003-.444.003-.666c.011-.406.042-.982.12-1.67c.155-1.37.5-3.218 1.265-5.08s1.967-3.776 3.855-5.225C13.948 8.086 16.161 7.2 19 7.032V3a1 1 0 0 1 .58-.907M20.998 8a1 1 0 0 1-1 1c-2.925 0-5.018.814-6.539 1.98c-1.533 1.177-2.551 2.763-3.224 4.4a16.5 16.5 0 0 0-.957 3.38c.318-.33.672-.672 1.062-1.013C12.462 15.891 15.687 14 19.999 14a1 1 0 0 1 1 1v2.838l7.456-6.338L21 5.161z" /></svg>
        //                     Gửi hóa đơn
        //                 </li>
        //                 <hr />
        //                 <li className="px-4 py-3 flex items-center gap-[8px]" onClick={(e) => handleEdit(e)}>
        //                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 32 32"><path fill="#353844" d="M28.565 3.434a4.89 4.89 0 0 0-6.915 0L4.357 20.73a3.7 3.7 0 0 0-1.002 1.84l-1.333 6.22a1 1 0 0 0 1.188 1.188l6.22-1.333a3.7 3.7 0 0 0 1.84-1.002l17.295-17.295a4.89 4.89 0 0 0 0-6.914m-5.5 1.414a2.89 2.89 0 0 1 4.085 4.086l-.9.9l-4.086-4.085zm-2.316 2.315l4.086 4.086L9.857 26.23a1.7 1.7 0 0 1-.846.46L4.3 27.7l1.01-4.71a1.7 1.7 0 0 1 .46-.846z" /></svg>
        //                     Chỉnh sửa
        //                 </li>
        //                 <hr />
        //                 <li className="px-4 py-3 flex items-center gap-[8px] text-[#bd373a]" onClick={(e) => handleDelete(e)}>
        //                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 2048 2048"><path fill="#bd373a" d="M1792 384h-128v1472q0 40-15 75t-41 61t-61 41t-75 15H448q-40 0-75-15t-61-41t-41-61t-15-75V384H128V256h512V128q0-27 10-50t27-40t41-28t50-10h384q27 0 50 10t40 27t28 41t10 50v128h512zM768 256h384V128H768zm768 128H384v1472q0 26 19 45t45 19h1024q26 0 45-19t19-45zM768 1664H640V640h128zm256 0H896V640h128zm256 0h-128V640h128z" /></svg>
        //                     Xóa
        //                 </li>
        //             </ul>
        //         </div>
        //     )}

        //     <FarmerUpdateForm
        //         visible={showUpdateForm}
        //         onClose={() => setShowUpdateForm(false)}
        //         data={data}
        //     />

        //     <ConfirmModal
        //         visible={isConfirmVisible}
        //         title={modalContent.title}
        //         message={modalContent.message}
        //         onConfirm={handleConfirm}
        //         onCancel={handleCancel}
        //     />
        // </div>
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
                    icon="solar:menu-dots-bold"
                    fontSize={20}
                    className={`text-white transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-30 overflow-hidden animate-in slide-in-from-top-2 duration-200">
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
                                <div className="text-sm font-medium text-gray-500 truncate">Cập nhật thông tin nông dân</div>
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
                                <div className="text-[16px] font-semibold">Xóa nông dân</div>
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