import React, { useState } from "react";
import { Box, Sheet } from "zmp-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInputAreaField, FormInputField, FormInputNumbericField } from "components/form";
import { PrimaryButton } from "components/button";
import { FormDataFarmer, schemaFarmer } from "./type";
import { useCreatePhienCan } from "apiRequest/phienCan";

type FarmerCreateFormProps = {
    visible: boolean;
    onClose: () => void;
    nhomThuMuaId: number;
};

const defaultValues: FormDataFarmer = {
    tenHoDan: "",
    donGia: "",
    soDienThoai: "",
    ghiChu: "",
}

const FarmerCreateForm: React.FC<FarmerCreateFormProps> = ({ visible, onClose, nhomThuMuaId }) => {

    const { handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<FormDataFarmer>({
        resolver: yupResolver(schemaFarmer),
        defaultValues
    });

    const { mutateAsync: createPhienCan, isPending } = useCreatePhienCan();

    const onSubmit: SubmitHandler<FormDataFarmer> = (data) => {

        if (data) {
            try {

                const dataSumbit = {...data, nhomThuMuaId, donGia: Number(data.donGia)};

                createPhienCan(dataSumbit);

                reset(defaultValues);
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
            title="Thêm hộ bán lúa"
            className="rounded-t-2xl"
        >
            <Box mt={2} px={4} pb={6} mb={10}>
                <div className="grid grid-cols-12 gap-x-3">
                    <div className="col-span-12">
                        <FormInputField
                            name="tenHoDan"
                            label="Tên hộ bán lúa"
                            placeholder="Nhập tên hộ bán lúa"
                            control={control}
                            error={errors.tenHoDan?.message}
                            required
                        />
                    </div>
                    <div className="col-span-12">
                        <FormInputNumbericField
                            name="donGia"
                            label="Đơn giá (đ)"
                            maxLength={10}
                            placeholder="Nhập đơn giá"
                            control={control}
                            error={errors.donGia?.message}
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

export default FarmerCreateForm;
