import React, { useEffect, useState } from "react";
import { Box, Sheet } from "zmp-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInputField, FormInputNumbericField } from "components/form";
import { PrimaryButton } from "components/button";
import { FormDataFarmer, PhienCan, schemaFarmer } from "./type";
import { useUpdatePhienCan } from "apiRequest/phienCan";

type FarmerUpdateFormProps = {
    visible: boolean;
    onClose: () => void;
    data: PhienCan;
};



const FarmerUpdateForm: React.FC<FarmerUpdateFormProps> = ({ visible, onClose, data }) => {

    const defaultValues: FormDataFarmer = {
        tenHoDan: data.tenHoDan,
        donGia: data.donGia.toString()
    }

    const { handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<FormDataFarmer>({
        resolver: yupResolver(schemaFarmer),
        defaultValues
    });

    const { mutateAsync: updatePhienCan, isPending } = useUpdatePhienCan();

    useEffect(() => {
        if (visible && data) {
            reset({
                tenHoDan: data.tenHoDan,
                donGia: data.donGia.toString()
            });
        }
    }, [visible, data, reset]);

    const onSubmit: SubmitHandler<FormDataFarmer> = async (formData) => {

        if (formData) {
            try {
                console.log({...data, ...formData});

                const dataSubmit = {...data, ...formData};

                await updatePhienCan(dataSubmit);

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
            title="Chỉnh sửa nông dân"
            className="rounded-t-2xl"
        >
            <Box mt={2} px={4} pb={6} mb={10}>
                <div className="grid grid-cols-12 gap-x-3">
                    <div className="col-span-12">
                        <FormInputField
                            name="tenHoDan"
                            label="Tên nông dân"
                            placeholder="Nhập tên nông dân"
                            control={control}
                            error={errors.tenHoDan?.message}
                            required
                        />
                    </div>
                    <div className="col-span-12">
                        <FormInputNumbericField
                            name="donGia"
                            label="Đơn giá"
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

export default FarmerUpdateForm;
