import React, { useState } from "react";
import { Box, Sheet } from "zmp-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormInputAreaField, FormInputField, FormInputNumbericField } from "components/form";
import { PrimaryButton } from "components/button";
import { FormDataFarmer, schemaFarmer } from "./type";

type FarmerCreateFormProps = {
    visible: boolean;
    onClose: () => void;
};

const defaultValues: FormDataFarmer = {
    tenNongDan: "",
    donGia: "",
    soDienThoai: "",
    ghiChu: "",
}

const FarmerCreateForm: React.FC<FarmerCreateFormProps> = ({ visible, onClose }) => {

    // const [formData, setFormData] = useState<FormDataFarmer>(defaultValues)

    const { handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<FormDataFarmer>({
        resolver: yupResolver(schemaFarmer),
        defaultValues
    });

    const onSubmit: SubmitHandler<FormDataFarmer> = (data) => {
        // setFormData(data)

        if (data) {
            try {
                console.log(data)

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
            title="Thêm nông dân"
            className="rounded-t-2xl"
        >
            <Box mt={2} px={4} pb={6} mb={10}>
                <div className="grid grid-cols-12 gap-x-3">
                    <div className="col-span-12">
                        <FormInputField
                            name="tenNongDan"
                            label="Tên nông dân"
                            placeholder="Nhập tên nông dân"
                            control={control}
                            error={errors.tenNongDan?.message}
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
                    {/* <div className="col-span-12">
                        <FormInputField
                            name="soDienThoai"
                            label="Số điện thoại"
                            placeholder="Nhập tên số điện thoại"
                            control={control}
                            error={errors.soDienThoai?.message}
                        />
                    </div> */}
                    {/* <div className="col-span-12">
                        <FormInputAreaField
                            name="ghiChu"
                            label="Ghi chú"
                            placeholder="Nhập ghi chú"
                            control={control}
                            error={errors.ghiChu?.message}
                        />
                    </div> */}
                </div>
                <div className="fixed bottom-0 left-0 flex justify-center w-[100%] bg-white box-shadow-3">
                    <Box py={2} className="w-[100%]" flex alignItems="center" justifyContent="center">
                        <PrimaryButton size="large" fullWidth disabled={false} label={false ? "Đang xử lý..." : "Lưu lại"} handleClick={handleSubmit(onSubmit)} />
                    </Box>
                </div>
            </Box>
        </Sheet>
    );
};

export default FarmerCreateForm;
