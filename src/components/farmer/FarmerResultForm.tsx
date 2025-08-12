import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Input, Modal, Switch, useSnackbar } from 'zmp-ui'
import { FormDataFarmerResult, PhienCan, schemaFarmerResult, tinhKhoiLuongThucTe } from './type'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { FormInputField, FormInputNumbericField } from 'components/form'
import { Icon } from '@iconify/react'
import { debounce, get, isEqual } from 'lodash'
import { parseNumber, replaceDotToComma, roundWeight } from 'utils/number'
import HeaderDetail from 'components/header-detail'
import InfoBox from './InfoBox'
import { WeightTable } from '.'
import { useStoreApp } from 'store/store'
import { getDataFromStorage } from 'services/zalo'
import { useUpdatePhienCanOnChange } from 'apiRequest/phienCan'
import { EmptyData } from 'components/data'
import { useCustomSnackbar } from 'utils/useCustomSnackbar'

const FarmerResultForm: React.FC = () => {

    const { showSuccess } = useCustomSnackbar();

    const [visibleTruBiModal, setVisibleTruBiModal] = useState(false);
    const [phienCanData, setPhienCanData] = useState<PhienCan | null>(null);
    const [isDone, setIsDone] = useState(true);
    const { phienCan } = useStoreApp();

    const { mutateAsync: updatePhienCan } = useUpdatePhienCanOnChange();

    useEffect(() => {
        const loadPhienCanData = async () => {
            if (!phienCan) {
                const data = await getDataFromStorage(["phienCan"]);
                const localData = JSON.parse(data?.phienCan);

                if (localData) {
                    setPhienCanData(localData);
                }
            } else {
                setPhienCanData(phienCan);
            }
        };

        loadPhienCanData();
    }, [phienCan]);

    const {
        control,
        reset,
        watch,
        getValues,
        formState: { errors }
    } = useForm<FormDataFarmerResult>({
        resolver: yupResolver(schemaFarmerResult),
        defaultValues: {
            tenHoDan: "",
            donGia: 0,
            quyCachTruBi: 0,
            truTapChat: 0,
            tienCoc: 0,
            tienDaTra: 0
        }
    });

    // Khi có phienCanData thì reset form
    useEffect(() => {
        if (phienCanData) {
            const formData = {
                tenHoDan: phienCanData.tenHoDan || '',
                donGia: phienCanData.donGia || 0,
                quyCachTruBi: phienCanData.quyCachTruBi || 0,
                truTapChat: phienCanData.truTapChat || 0,
                tienCoc: phienCanData.tienCoc || 0,
                tienDaTra: phienCanData.tienDaTra || 0
            };

            reset(formData);
            lastValuesRef.current = formData;

            // Set thông tin khối lượng
            setTongKhoiLuong(phienCanData.tongTrongLuong || 0);
            setSoLanCan(phienCanData.soLanCan || 0);

            // Reset skip flag để enable auto-save
            skipFirstUpdate.current = true;
        }
    }, [phienCanData, reset]);

    const [tongKhoiLuong, setTongKhoiLuong] = useState(0);
    const [soLanCan, setSoLanCan] = useState(0);

    // DI CHUYỂN TẤT CẢ HOOKS LÊN ĐÂY - TRƯỚC KHI RETURN SỚM
    const donGia = watch('donGia');
    const tienCoc = watch('tienCoc');
    const tienDaTra = watch('tienDaTra');
    const quyCachTruBi = watch('quyCachTruBi');
    const truTapChat = watch('truTapChat');

    const khoiLuongConLai = useMemo(() => {
        // const _truBaoBi = parseNumber(quyCachTruBi);
        // const _truTapChat = parseNumber(truTapChat);
        // const khoiLuongTruBaoBi = _truBaoBi === 0 ? 0 : roundWeight(soLanCan / _truBaoBi, 'nearest', 1);

        // const result = Number((tongKhoiLuong - khoiLuongTruBaoBi - _truTapChat).toFixed(1));

        // return result;
        return tinhKhoiLuongThucTe({
            tongKhoiLuong,
            soLanCan,
            quyCachTruBi,
            truTapChat,
            roundWeight,
            parseNumber
        });
    }, [quyCachTruBi, truTapChat, tongKhoiLuong, soLanCan]);

    const tongTien = useMemo(() => {
        return Math.round(parseNumber(donGia) * khoiLuongConLai);
    }, [donGia, khoiLuongConLai]);

    const tongTienConLai = useMemo(() => {
        return tongTien - parseNumber(tienCoc) - parseNumber(tienDaTra);
    }, [tongTien, tienCoc, tienDaTra]);

    const updateFarmerResult = async (data: FormDataFarmerResult) => {

        console.log('tien da tra', data.tienDaTra);

        const tongKhoiLuongThucTe = tinhKhoiLuongThucTe({
            tongKhoiLuong: phienCanData?.tongTrongLuong || 0,
            soLanCan: phienCanData?.soLanCan || soLanCan,
            quyCachTruBi: data.quyCachTruBi,
            truTapChat: data.truTapChat,
            roundWeight,
            parseNumber,
        });

        const tongTienToiDa = Math.round(tongKhoiLuongThucTe * parseNumber(data.donGia)) - parseNumber(data.tienCoc);

        try {
            const normalizedData: FormDataFarmerResult = {
                tenHoDan: (data.tenHoDan || '').trim(),
                donGia: parseNumber(data.donGia) || 0,
                quyCachTruBi: parseNumber(data.quyCachTruBi) || 0,
                truTapChat: typeof data.truTapChat === 'string'
                    ? (data.truTapChat as string).trim() === ''
                        ? 0
                        : parseFloat(data.truTapChat as string)
                    : parseNumber(data.truTapChat) || 0,
                tienCoc: parseNumber(data.tienCoc) || 0,
                tienDaTra: (parseNumber(data.tienDaTra) > tongTienToiDa && tongTienToiDa > 0) ? tongTienToiDa : parseNumber(data.tienDaTra) || 0
            };

            const dataSubmit = { ...phienCanData, ...normalizedData };

            console.log('🔄 Gọi API cập nhật với data:', dataSubmit);

            const response = await updatePhienCan(dataSubmit);

            reset(normalizedData);
            lastValuesRef.current = normalizedData;

            if (response?.result) {
                console.log(response.result);
                setPhienCanData(response.result);
            }

        } catch (error) {
            console.error("❌ Lỗi khi cập nhật:", error);
        }
    };

    const debouncedUpdate = useCallback(
        debounce((data: FormDataFarmerResult) => {
            updateFarmerResult(data);
        }, 1500),
        [phienCanData]
    );

    const lastValuesRef = useRef<FormDataFarmerResult>({
        tenHoDan: "",
        donGia: 0,
        quyCachTruBi: 0,
        truTapChat: 0,
        tienCoc: 0,
        tienDaTra: 0
    });

    const skipFirstUpdate = useRef(true);

    const watchedFields = watch();

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

    useEffect(() => {

        if ((tongTien - parseNumber(tienCoc) === tienDaTra)) {
            setIsDone(true);
        } else {
            setIsDone(false);
        }
    }, [tongTien, tienDaTra, tienCoc]);

    // CHỈ SAU KHI TẤT CẢ HOOKS ĐÃ ĐƯỢC GỌI MỚI RETURN SỚM
    if (!phienCanData) return <Box px={2}>
        <HeaderDetail title={"Chi tiết phiên cân"} weight={'0.0'} count={'0'} />
        <EmptyData
            title="Không tìm thấy dữ liệu"
        />
    </Box>;

    return (
        <Box>
            <HeaderDetail title={phienCanData?.tenHoDan || "Chi tiết phiên cân"} weight={replaceDotToComma(tongKhoiLuong.toFixed(1)).toString()} count={soLanCan.toString()} />
            <Box px={2} pt={6} pb={3}>
                <div className="grid grid-cols-12 gap-x-3 shadow-md bg-white px-3 pb-2 pt-4 rounded-lg mb-4">
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
                            value={getValues('quyCachTruBi') === 0 ? "0" : `${replaceDotToComma(roundWeight(soLanCan / (Number(getValues('quyCachTruBi'))), 'nearest', 1))}`}
                            suffix={
                                <Box className='bg-primary-color rounded-lg' p={3} onClick={() => setVisibleTruBiModal(true)}>
                                    <Icon icon="solar:settings-linear" fontSize={20} color='#ffffff' />
                                </Box>
                            }
                            disabled
                            helperText={`${getValues('quyCachTruBi')} bao (lần cân)/1kg`}
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
                                        maxLength={6}
                                        label="Trừ tạp chất (kg)"
                                        // value={field.value?.toString() || "0"}
                                        value={field.value?.toString().replace('.', ',') || "0"}
                                        onFocus={(e) => e.target.select()}
                                        // onChange={(e) => {
                                        //     const input = e.target.value.replace(',', '.');
                                        //     field.onChange(input);
                                        // }}
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
                            name="tienCoc"
                            label="Trừ tiền cọc (đ)"
                            placeholder=""
                            control={control}
                            error={errors.tienCoc?.message}
                        />
                    </div>
                    <div className="col-span-12">
                        <FormInputNumbericField
                            name="tienDaTra"
                            label="Trừ tiền đã trả (đ)"
                            placeholder=""
                            control={control}
                            error={errors.tienDaTra?.message}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-1 p-1 bg-white rounded-lg overflow-hidden shadow-md">
                    <InfoBox label="Tổng khối lượng" value={`${replaceDotToComma(tongKhoiLuong.toFixed(1))}`} colorClass="text-primary-color" fw='bold' />
                    <InfoBox label="Số lần cân (bao)" value={soLanCan} colorClass="text-primary-color" fw='bold' />
                    <InfoBox label="Khối lượng còn lại" value={replaceDotToComma(khoiLuongConLai)} note='(Trừ tạp chất và bao bì)' noteFs={12} colorClass='text-primary-color' fw='bold' />
                    <InfoBox
                        label="Tổng tiền"
                        value={tongTien}
                        formatNumber
                        note='(Đơn giá x KL còn lại)'
                        noteFs={12}
                        colorClass='text-primary-color'
                        fw='bold'
                    />
                    <InfoBox
                        label="Tổng tiền còn lại"
                        labelFs={18}
                        value={tongTienConLai}
                        formatNumber
                        colorClass="text-primary-color"
                        fs={34}
                        fw='bold'
                        span={12}
                        note="(Đã trừ tiền cọc và tiền đã trả)"
                    />
                    <div className='col-span-12 p-2 text-center'>
                        <div className='flex flex-col gap-2 items-center'>
                            <Switch
                                checked={isDone}
                                size='medium'
                                onClick={async () => {

                                    const newIsDone = !isDone;
                                    setIsDone(newIsDone);


                                    const newTienDaTra = newIsDone ? tongTien - parseNumber(tienCoc) : 0;

                                    await updateFarmerResult({
                                        ...getValues(),
                                        tienDaTra: newTienDaTra,
                                    })

                                    if (newIsDone) {
                                        showSuccess('Đã trả đủ tiền');
                                    }
                                }}
                            />
                            <span className='text-[14px] font-medium text-gray-600'>Đã trả đủ tiền</span>
                        </div>
                    </div>
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
                            name="quyCachTruBi"
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
                                    onFocus={(e) => e.target.select()}
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