import { Icon } from "@iconify/react";
import { useGetCauHinhHeThong, useUpdateCauHinhHeThong } from "apiRequest/cauHinhHeThong";
import { HeaderSub } from "components/header-sub";
import React, { useState, useCallback, useEffect } from "react";
import { Box, Page, Input } from "zmp-ui";
import _ from "lodash";
import { SettingsSkeleton } from "components/skeleton";

// Enum cho các loại nhập liệu
enum InputType {
  TWO_DIGITS = "nhap2",
  THREE_DIGITS_REMAINDER = "nhap3laydu",
  THREE_DIGITS = "nhap3",
  FOUR_DIGITS_REMAINDER = "nhap4"
}

// Interface cho cấu hình nhập liệu
interface InputConfig {
  id: InputType;
  name: string;
  title: string;
  example: string;
  result: string;
  description: string;
}

// Interface cho kết quả tính toán
interface CalculationResult {
  input: string;
  output: number;
  unit: string;
}

// Interface cho API config
interface ApiConfig {
  quyCachNhap: number;
  choPhepNhapSoLe: boolean;
  soThapPhan: number;
}

const FarmerPage: React.FunctionComponent = () => {
  // State quản lý loại nhập liệu được chọn
  const [selectedInputType, setSelectedInputType] = useState<InputType | null>(null);

  // State cho input test
  const [testInput, setTestInput] = useState<string>("");

  // State cho kết quả tính toán
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // State cho trạng thái loading khi update
  const [isUpdating, setIsUpdating] = useState(false);

  // State cho quy cách trừ bì
  const [quyCachTruBi, setQuyCachTruBi] = useState<number>(0);

  // State cho trạng thái loading khi update quy cách trừ bì
  const [isUpdatingTruBi, setIsUpdatingTruBi] = useState(false);

  // Hook gọi API lấy cấu hình hệ thống
  const { data: cauHinhHeThong, isLoading, refetch } = useGetCauHinhHeThong();
  const { mutateAsync: updateCauHinh } = useUpdateCauHinhHeThong();

  // Cấu hình các loại nhập liệu
  const inputConfigs: InputConfig[] = [
    {
      id: InputType.TWO_DIGITS,
      name: "Nhập 2 chữ số",
      title: "Nhập 2 chữ số",
      example: "Ví dụ: 75",
      result: "75 kg",
      description: "Nhập trọng lượng đơn giản"
    },
    {
      id: InputType.THREE_DIGITS_REMAINDER,
      name: "Nhập 3 chữ số có phần dư",
      title: "Nhập 3 chữ số có phần dư",
      example: "Ví dụ: 755",
      result: "75.5 kg",
      description: "Chữ số cuối làm phần thập phân"
    },
    {
      id: InputType.THREE_DIGITS,
      name: "Nhập 3 chữ số",
      title: "Nhập 3 chữ số",
      example: "Ví dụ: nhập 150",
      result: "155 kg",
      description: "Nhập trọng lượng 3 số"
    },
    {
      id: InputType.FOUR_DIGITS_REMAINDER,
      name: "Nhập 4 chữ số có số dư",
      title: "Nhập 4 chữ số có số dư",
      example: "Ví dụ: nhập 1505",
      result: "150.5 kg",
      description: "Chữ số cuối làm phần thập phân"
    }
  ];

  // Function map InputType sang API config
  const mapInputTypeToApiConfig = useCallback((inputType: InputType): ApiConfig => {
    switch (inputType) {
      case InputType.TWO_DIGITS:
        return {
          quyCachNhap: 2,
          choPhepNhapSoLe: false,
          soThapPhan: 0
        };
      case InputType.THREE_DIGITS_REMAINDER:
        return {
          quyCachNhap: 3,
          choPhepNhapSoLe: true,
          soThapPhan: 1
        };
      case InputType.THREE_DIGITS:
        return {
          quyCachNhap: 3,
          choPhepNhapSoLe: false,
          soThapPhan: 0
        };
      case InputType.FOUR_DIGITS_REMAINDER:
        return {
          quyCachNhap: 4,
          choPhepNhapSoLe: true,
          soThapPhan: 1
        };
      default:
        throw new Error("Loại nhập liệu không hợp lệ");
    }
  }, []);

  // Function map API config sang InputType
  const mapApiConfigToInputType = useCallback((apiConfig: any): InputType | null => {
    const { quyCachNhap, choPhepNhapSoLe, soThapPhan } = apiConfig;

    if (quyCachNhap === 2 && !choPhepNhapSoLe && soThapPhan === 0) {
      return InputType.TWO_DIGITS;
    }
    if (quyCachNhap === 3 && choPhepNhapSoLe && soThapPhan === 1) {
      return InputType.THREE_DIGITS_REMAINDER;
    }
    if (quyCachNhap === 3 && !choPhepNhapSoLe && soThapPhan === 0) {
      return InputType.THREE_DIGITS;
    }
    if (quyCachNhap === 4 && choPhepNhapSoLe && soThapPhan === 1) {
      return InputType.FOUR_DIGITS_REMAINDER;
    }

    return null;
  }, []);

  // Function xử lý tính toán theo loại nhập liệu
  const calculateWeight = useCallback((input: string, inputType: InputType): number => {
    const numericInput = parseFloat(input);

    if (isNaN(numericInput)) {
      throw new Error("Vui lòng nhập số hợp lệ");
    }

    switch (inputType) {
      case InputType.TWO_DIGITS:
        return numericInput;

      case InputType.THREE_DIGITS_REMAINDER:
        return numericInput / 10;

      case InputType.THREE_DIGITS:
        return numericInput;

      case InputType.FOUR_DIGITS_REMAINDER:
        return numericInput / 10;

      default:
        throw new Error("Loại nhập liệu không hợp lệ");
    }
  }, []);

  // Function xử lý nhiều số cách nhau bởi dấu phẩy
  const calculateMultipleWeights = useCallback((input: string, inputType: InputType): CalculationResult[] => {
    const inputs = input.split(',').map(item => item.trim());

    return inputs.map(singleInput => {
      const weight = calculateWeight(singleInput, inputType);
      return {
        input: singleInput,
        output: weight,
        unit: "kg"
      };
    });
  }, [calculateWeight]);

  // Function cập nhật quy cách trừ bì
  const updateQuyCachTruBi = useCallback(async (newValue: number) => {
    try {
      setIsUpdatingTruBi(true);

      if (!cauHinhHeThong?.result) {
        throw new Error("Không thể lấy cấu hình hiện tại");
      }

      // Payload để update quy cách trừ bì
      const updatePayload = {
        ...cauHinhHeThong.result,
        quyCachTruBi: newValue
      };

      // Gọi API update
      await updateCauHinh(updatePayload);

    } catch (error) {
      console.error("Lỗi khi cập nhật quy cách trừ bì:", error);
    } finally {
      setIsUpdatingTruBi(false);
    }
  }, [cauHinhHeThong, updateCauHinh]);

  // Debounced function để update quy cách trừ bì
  const debouncedUpdateQuyCachTruBi = useCallback(
    _.debounce(async (value: number) => {
      await updateQuyCachTruBi(value);
    }, 500),
    [updateQuyCachTruBi]
  );

  // Cleanup debounced function khi component unmount
  useEffect(() => {
    return () => {
      debouncedUpdateQuyCachTruBi.cancel();
    };
  }, [debouncedUpdateQuyCachTruBi]);

  // Function cập nhật cấu hình qua API
  const updateCauHinhHeThong = useCallback(async (inputType: InputType) => {
    try {
      setIsUpdating(true);

      if (!cauHinhHeThong?.result) {
        throw new Error("Không thể lấy cấu hình hiện tại");
      }

      const apiConfig = mapInputTypeToApiConfig(inputType);

      // Payload để update
      const updatePayload = {
        ...cauHinhHeThong.result,
        ...apiConfig
      };

      console.log('call api update:', updatePayload);

      // Gọi API update
      await updateCauHinh(updatePayload);

    } catch (error) {
      console.error("Lỗi khi cập nhật cấu hình:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [cauHinhHeThong, mapInputTypeToApiConfig, updateCauHinh]);

  // Handler cho việc thay đổi quy cách trừ bì
  const handleQuyCachTruBiChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setQuyCachTruBi(value);

    // Gọi debounced function
    debouncedUpdateQuyCachTruBi(value);
  }, [debouncedUpdateQuyCachTruBi]);

  // Handler cho việc thay đổi loại nhập liệu
  const handleInputTypeChange = useCallback(async (inputType: InputType) => {
    setSelectedInputType(inputType);
    setCalculationResult(null);
    setTestInput("");

    // Cập nhật qua API
    await updateCauHinhHeThong(inputType);
  }, [updateCauHinhHeThong]);

  // Handler cho việc test tính toán
  const handleTestCalculation = useCallback(() => {
    if (!selectedInputType || !testInput.trim()) {
      return;
    }

    try {
      const results = calculateMultipleWeights(testInput, selectedInputType);
      setCalculationResult(results[0]); // Hiển thị kết quả đầu tiên

      // Log tất cả kết quả nếu có nhiều số
      if (results.length > 1) {
        console.log("Tất cả kết quả:", results);
      }
    } catch (error) {
      console.error("Lỗi tính toán:", error);
      setCalculationResult(null);
    }
  }, [selectedInputType, testInput, calculateMultipleWeights]);

  // Auto calculate when input changes
  React.useEffect(() => {
    if (selectedInputType && testInput.trim()) {
      handleTestCalculation();
    } else {
      setCalculationResult(null);
    }
  }, [testInput, selectedInputType, handleTestCalculation]);

  // Load cấu hình từ API khi có data
  React.useEffect(() => {
    if (cauHinhHeThong?.result) {
      const inputType = mapApiConfigToInputType(cauHinhHeThong.result);
      if (inputType) {
        setSelectedInputType(inputType);
      }

      // Load quy cách trừ bì từ API
      if (cauHinhHeThong.result.quyCachTruBi !== undefined) {
        setQuyCachTruBi(cauHinhHeThong.result.quyCachTruBi);
      }
    }
  }, [cauHinhHeThong, mapApiConfigToInputType]);

  const renderInputGroup = (
    title: string,
    filterIds: InputType[]
  ) => {
    return (
      <Box>
        <div className="py-4 px-4 flex items-center gap-3 bg-indigo-50 text-[20px] text-primary-color font-semibold">
          <Icon icon={'mdi:scale'} fontSize={20} className="text-primary-color" />
          {title}
        </div>
        {inputConfigs
          .filter((config) => filterIds.includes(config.id))
          .map((config) => (
            <Box
              key={config.id}
              py={3}
              px={5}
              flex
              alignItems="flex-start"
              className="gap-5 border-b last:border-b-0"
            >
              <input
                className="scale-[1.4] mt-1"
                id={config.id}
                name="input-type"
                type="radio"
                checked={selectedInputType === config.id}
                onChange={() => handleInputTypeChange(config.id)}
                disabled={isUpdating}
              />
              <label htmlFor={config.id} className="cursor-pointer flex-1">
                <div className="text-[18px] leading-[24px] font-semibold">{config.title}</div>
                <div className="text-[16px] leading-[22px] font-normal text-gray-500 mt-2">{config.description}</div>
                <div className="text-[18px] leading-[24px] font-medium text-gray-800 mt-2 mb-1">{config.example}</div>
                <div className="text-[18px] leading-[24px] font-medium text-green-700">⟹ {config.result}</div>
              </label>
            </Box>
          ))}
      </Box>
    );
  };

  return (
    <Page className="relative flex-1 flex flex-col pb-[66px]">
      <HeaderSub title="Cấu hình hệ thống" />
      {
        isLoading ?
          <Box px={2} py={4} className="flex items-center justify-center">
            <SettingsSkeleton />
          </Box>
          :
          <Box px={2} py={4}>
            <div className="grid grid-cols-12 gap-6">

              {/* Quy cách trừ bì */}
              <div className="col-span-12">
                <Box className="rounded-lg overflow-hidden shadow-md">
                  <div className="p-4 bg-primary-color text-white text-[18px] leading-[24px] font-medium flex items-center gap-3">
                    <Icon icon='carbon:settings-edit' fontSize={20} />
                    Quy cách trừ bì
                    {isUpdatingTruBi && (
                      <Icon icon="eos-icons:loading" fontSize={16} className="animate-spin ml-auto" />
                    )}
                  </div>
                  <div className="bg-white border-primary-color p-4">
                    <Input
                      type="number"
                      inputMode="numeric"
                      maxLength={4}
                      value={quyCachTruBi}
                      onChange={handleQuyCachTruBiChange}
                      disabled={isUpdatingTruBi}
                      suffix={
                        <Box pr={4} className="text-[16px] font-medium whitespace-nowrap">
                          bao / 1 kg
                        </Box>
                      }
                    />
                  </div>
                </Box>
              </div>

              {/* Quy cách nhập */}
              <div className="col-span-12">
                <Box className="rounded-lg overflow-hidden shadow-md">
                  <div className="p-4 bg-primary-color text-white text-[18px] leading-[24px] font-medium flex items-center gap-3">
                    <Icon icon='carbon:settings-edit' fontSize={20} />
                    Quy cách nhập liệu
                    {isUpdating && (
                      <Icon icon="eos-icons:loading" fontSize={16} className="animate-spin ml-auto" />
                    )}
                  </div>
                  <div className="bg-white border-[1px]">
                    {renderInputGroup('< 100 kg', [InputType.TWO_DIGITS, InputType.THREE_DIGITS_REMAINDER])}
                    {renderInputGroup('>= 100 kg', [InputType.THREE_DIGITS, InputType.FOUR_DIGITS_REMAINDER])}
                  </div>
                </Box>
              </div>
              {/* Test */}
              {selectedInputType && (
                <div className="col-span-12">
                  <Box className="rounded-lg overflow-hidden shadow-md">
                    <div className="p-4 bg-primary-color text-white text-[18px] leading-[24px] font-medium flex items-center gap-3">
                      <Icon icon='carbon:test-tool' fontSize={18} />
                      Nhập thử
                    </div>
                    <div className="bg-white p-4">
                      <div className="mb-3">
                        <label className="block text-[16px] leading-[22px] font-medium text-gray-700 mb-2">
                          Nhập số cân để thử nghiệm (cách nhau bởi dấu phẩy, ví dụ: 500, 522):
                        </label>
                        <input
                          inputMode="numeric"
                          type="text"
                          maxLength={
                            selectedInputType === InputType.TWO_DIGITS
                              ? 2
                              : selectedInputType === InputType.THREE_DIGITS_REMAINDER
                                ? 3
                                : selectedInputType === InputType.THREE_DIGITS
                                  ? 3
                                  : 4
                          }
                          value={testInput}
                          onChange={(e) => setTestInput(e.target.value)}
                          placeholder="VD: 500, 522, 555"
                          className="w-full h-[42px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[16px] font-semibold text-gray-700"
                        />
                      </div>

                      {calculationResult && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="text-[16px] font-medium text-green-800">
                            <strong>Kết quả:</strong> {calculationResult.input} ⟹ {calculationResult.output} {calculationResult.unit}
                          </div>
                        </div>
                      )}

                      {testInput.trim() && !calculationResult && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="text-sm text-red-800">
                            <strong>Lỗi:</strong> Vui lòng nhập số hợp lệ
                          </div>
                        </div>
                      )}
                    </div>
                  </Box>
                </div>
              )}

            </div>
          </Box>
      }
    </Page>
  );
};

export default FarmerPage;