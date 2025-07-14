import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Header, Input, Modal } from 'zmp-ui'
import { FormDataFarmerResult, schemaFarmerResult } from './type'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormInputField, FormInputNumbericField } from 'components/form'
import { Icon } from '@iconify/react'
import { debounce, isEqual } from 'lodash'
import { formatCurrency, parseNumber, roundWeight } from 'utils/number'
import HeaderDetail from 'components/header-detail'
import InfoBox from './InfoBox'
import { WeightTable } from '.'

const defaultValues: FormDataFarmerResult = {
    tenNongDan: "",
    donGia: 0,
    soDienThoai: "",
    ghiChu: "",
    truBaoBi: 0,
    truTapChat: 0,
    truTienCoc: 0,
    truTienDaTra: 0
}

const FarmerResultForm: React.FC = () => {

    const [visibleTruBiModal, setVisibleTruBiModal] = useState(false);

    const [tongKhoiLuong, setTongKhoiLuong] = useState(5367.9);
    const [soLanCan, setSoLanCan] = useState(83);

    const {
        control,
        reset,
        watch,
        getValues,
        formState: { errors }
    } = useForm<FormDataFarmerResult>({
        resolver: yupResolver(schemaFarmerResult),
        defaultValues
    });

    const donGia = watch('donGia');
    const truTienCoc = watch('truTienCoc');
    const truTienDaTra = watch('truTienDaTra');

    const khoiLuongConLai = useMemo(() => {
        const truBaoBi = parseNumber(getValues('truBaoBi'));
        const truTapChat = parseNumber(getValues('truTapChat'));
        const khoiLuongTruBaoBi = truBaoBi === 0 ? 0 : roundWeight(soLanCan / truBaoBi, 'nearest', 1);

        const result = Number((tongKhoiLuong - khoiLuongTruBaoBi - truTapChat).toFixed(1));

        return result;
    }, [getValues('truBaoBi'), getValues('truTapChat'), tongKhoiLuong, soLanCan]);

    const tongTien = useMemo(() => {
        return Math.round(parseNumber(donGia) * khoiLuongConLai);
    }, [donGia, khoiLuongConLai]);

    const tongTienConLai = useMemo(() => {
        return tongTien - parseNumber(truTienCoc) - parseNumber(truTienDaTra);
    }, [tongTien, truTienCoc, truTienDaTra]);

    // API cập nhật form
    const updateFarmerResult = async (data: FormDataFarmerResult) => {
        try {

            const normalizedData: FormDataFarmerResult = {
                ...data,
                truTapChat: typeof data.truTapChat === 'string'
                    ? (data.truTapChat as string).trim() === ''
                        ? 0
                        : parseFloat(data.truTapChat as string)
                    : data.truTapChat ?? 0,
                donGia: parseNumber(data.donGia)
            };

            console.log('🔄 Gọi API cập nhật với data:', normalizedData);

            console.log('✅ Gọi API và Cập nhật lại form với data:');
            reset(normalizedData);
            lastValuesRef.current = normalizedData;
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật:", error);
        }
    };

    // Debounce hàm update để tránh spam
    const debouncedUpdate = useCallback(
        debounce((data: FormDataFarmerResult) => {
            updateFarmerResult(data);
        }, 800),
        []
    );

    const lastValuesRef = useRef<FormDataFarmerResult>(defaultValues);
    const skipFirstUpdate = useRef(true);

    // Fetch detail đừng xóa
    useEffect(() => {

        const detailData = {
            tenNongDan: "Chú 2",
            donGia: 8000,
            soDienThoai: "",
            ghiChu: "",
            truBaoBi: 8,
            truTapChat: 0.0,
            truTienCoc: 1000000,
            truTienDaTra: 0
        };

        reset(detailData);
        lastValuesRef.current = detailData;
    }, []);

    // Lắng nghe toàn bộ form thay đổi
    const watchedFields = watch();

    // Gọi Debounce khi có thay đổi
    useEffect(() => {
        if (skipFirstUpdate.current) {
            skipFirstUpdate.current = false;
            return;
        }

        if (!isEqual(watchedFields, lastValuesRef.current)) {
            lastValuesRef.current = watchedFields;
            debouncedUpdate(watchedFields);
        }
    }, [watchedFields]);

    return (
        <Box>
            <HeaderDetail title='Chú 2' weight={tongKhoiLuong.toString()} count={soLanCan.toString()} />
            <Box px={3} pt={6} pb={3}>
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
                            label="Đơn giá (đ/kg)"
                            maxLength={10}
                            placeholder="Nhập đơn giá"
                            control={control}
                            error={errors.donGia?.message}
                        />
                    </div>
                    <div className="col-span-12 mb-3">
                        <Input
                            label="Trừ bao bì (kg)"
                            value={getValues('truBaoBi') === 0 ? "0" : `${roundWeight(soLanCan / (Number(getValues('truBaoBi'))), 'nearest', 1)}`}
                            suffix={
                                <Box className='bg-[#74b4da] rounded-lg' p={3} onClick={() => setVisibleTruBiModal(true)}>
                                    <Icon icon="solar:settings-linear" fontSize={20} color='#ffffff' />
                                </Box>
                            }
                            disabled
                            helperText={`${getValues('truBaoBi')} bao (lần cân)/1kg`}
                        />
                    </div>
                    <div className="col-span-12">
                        <Box pb={4}>
                            <Controller
                                name="truTapChat"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        inputMode="decimal"
                                        maxLength={4}
                                        label="Trừ tạp chất (kg)"
                                        value={field.value?.toString() || "0"}
                                        onChange={(e) => {
                                            const input = e.target.value.replace(',', '.');
                                            field.onChange(input);
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </div>
                    <div className="col-span-12">
                        <FormInputNumbericField
                            name="truTienCoc"
                            label="Trừ tiền cọc (đ)"
                            placeholder=""
                            control={control}
                            error={errors.truTienCoc?.message}
                        />
                    </div>
                    <div className="col-span-12">
                        <FormInputNumbericField
                            name="truTienDaTra"
                            label="Trừ tiền đã trả (đ)"
                            placeholder=""
                            control={control}
                            error={errors.truTienDaTra?.message}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-x-0 border-[1px] bg-white">
                    <InfoBox label="Tổng khối lượng" value={tongKhoiLuong} colorClass="text-blue-700" />
                    <InfoBox label="Số lần cân (bao)" value={soLanCan} colorClass="text-blue-700" />
                    <InfoBox label="Khối lượng còn lại" value={khoiLuongConLai} note='(Trừ tạp chất và bao bì)' noteFs={12} colorClass='text-blue-700' />
                    <InfoBox
                        label="Tổng tiền"
                        value={tongTien}
                        formatNumber
                        note='(Đơn giá x KL còn lại)'
                        noteFs={12}
                        colorClass='text-blue-700'
                    />
                    <InfoBox
                        label="Tổng tiền còn lại"
                        labelFs={18}
                        value={tongTienConLai}
                        formatNumber
                        colorClass="text-blue-700"
                        fs={24}
                        fw='bold'
                        span={12}
                        note="(Đã trừ tiền cọc và tiền đã trả)"
                    />
                </div>
            </Box>

            <Box>
                <WeightTable />
            </Box>

            <Modal
                visible={visibleTruBiModal}
            >
                <Box>
                    <Box>
                        <h2 className='text-[22px] font-medium mb-6 text-center'>Cài đặt trừ số kí bao bì</h2>
                    </Box>
                    <Box>
                        <Controller
                            name="truBaoBi"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    inputMode="numeric"
                                    maxLength={4}
                                    label="Số bao bì trên 1kg"
                                    value={field.value?.toString() || "0"}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value === "" ? 0 : Number(value));
                                    }}
                                    suffix={
                                        <Box pr={4} className="text-[16px] font-medium whitespace-nowrap">
                                            bao / 1 kg
                                        </Box>
                                    }
                                />
                            )}
                        />

                    </Box>
                    <Box mt={4}>
                        <div className="grid grid-cols-12 gap-x-3">
                            <div className="col-span-5">
                                <Button
                                    fullWidth variant="secondary" size='medium'
                                    onClick={() => setVisibleTruBiModal(false)}
                                >
                                    Đóng
                                </Button>
                            </div>
                            <div className="col-span-7">
                                <Button
                                    fullWidth variant="primary" size='medium'
                                    onClick={() => setVisibleTruBiModal(false)}
                                >
                                    Lưu lại
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default FarmerResultForm;
