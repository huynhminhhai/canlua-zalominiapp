import React, { useEffect } from "react";
import { Box, Sheet } from "zmp-ui";
import { FormDataGroup, GroupItemType, schemaGroup } from "./type";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInputField } from "components/form";
import { PrimaryButton } from "components/button";
import { useUpdateNhomThuMua } from "apiRequest/nhomThuMua";

type GroupUpdateFormProps = {
    visible: boolean;
    onClose: () => void;
    data: GroupItemType;
};

const GroupUpdateForm: React.FC<GroupUpdateFormProps> = ({ visible, onClose, data }) => {

    const defaultValues: FormDataGroup = {
        id: data.id,
        tenNhom: data.tenNhom,
        moTa: data.moTa,
    }
    
    const { handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<FormDataGroup>({
        resolver: yupResolver(schemaGroup),
        defaultValues
    });

    const { mutateAsync: updateNhomThuMua, isPending } = useUpdateNhomThuMua();

    useEffect(() => {
        if (visible && data) {
            reset({
                id: data.id,
                tenNhom: data.tenNhom,
                moTa: data.moTa,
            });
        }
    }, [visible, data, reset]);

    const onSubmit: SubmitHandler<FormDataGroup> = async (data) => {

        if (data) {
            try {
                const dataSubmit = {...data, id: defaultValues.id};
                
                await updateNhomThuMua(dataSubmit);

                onClose();
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    const onCloseForm = (e) => {
        e.stopPropagation();
        reset(defaultValues);
        onClose();
    }

    return (
        <Sheet
            visible={visible}
            onClose={onCloseForm}
            title="Chỉnh sửa nhóm"
            className="rounded-t-2xl"
        >
            <Box mt={2} px={4} pb={6} mb={10}>
                <div className="grid grid-cols-12 gap-x-3">
                    <div className="col-span-12">
                        <FormInputField
                            name="tenNhom"
                            label="Tên nhóm/phương tiện"
                            placeholder="Nhập tên nhóm"
                            control={control}
                            error={errors.tenNhom?.message}
                            required
                        />
                    </div>
                    <div className="col-span-12">
                        <FormInputField
                            name="moTa"
                            label="Số điện thoại"
                            placeholder="Nhập tên số điện thoại"
                            control={control}
                            error={errors.moTa?.message}
                        />
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 flex justify-center w-[100%] bg-white box-shadow-3">
                    <Box py={2} className="w-[100%]" flex alignItems="center" justifyContent="center">
                        <PrimaryButton size="large" fullWidth disabled={isPending} label={isPending ? "Đang xử lý..." : "Lưu lại"} handleClick={handleSubmit(onSubmit)} />
                    </Box>
                </div>
            </Box>
        </Sheet>
    );
};

export default GroupUpdateForm;
