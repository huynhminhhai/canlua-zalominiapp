import { Icon } from "@iconify/react";
import { useGetCauHinhHeThong, useUpdateCauHinhHeThong } from "apiRequest/cauHinhHeThong";
import { HeaderSub } from "components/header-sub";
import React, { useState, useCallback } from "react";
import { Box, Page, Button } from "zmp-ui";

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

  // Hook gọi API lấy cấu hình hệ thống
  const { data: cauHinhHeThong, isLoading, refetch } = useGetCauHinhHeThong();
  const { mutateAsync: updateCauHinh } = useUpdateCauHinhHeThong();

  // Cấu hình các loại nhập liệu
  const inputConfigs: InputConfig[] = [
    {
      id: InputType.TWO_DIGITS,
      name: "Nhập 2 số",
      title: "Nhập 2 số",
      example: "Ví dụ: nhập 20",
      result: "20 kg",
      description: "Nhập trực tiếp số kg"
    },
    {
      id: InputType.THREE_DIGITS_REMAINDER,
      name: "Nhập 3 số lấy số dư", 
      title: "Nhập 3 số lấy số dư",
      example: "Ví dụ: nhập 500, 522, 555",
      result: "50.0 kg, 52.2 kg, 55.5 kg",
      description: "Chia 10 để lấy số dư"
    },
    {
      id: InputType.THREE_DIGITS,
      name: "Nhập 3 số",
      title: "Nhập 3 số", 
      example: "Ví dụ: nhập 100, 122, 155",
      result: "100 kg, 122 kg, 155 kg",
      description: "Nhập trực tiếp số kg"
    },
    {
      id: InputType.FOUR_DIGITS_REMAINDER,
      name: "Nhập 4 số lấy số dư",
      title: "Nhập 4 số lấy số dư",
      example: "Ví dụ: nhập 1000, 1025, 1055", 
      result: "100.0 kg, 102.5 kg, 105.5 kg",
      description: "Chia 10 để lấy số dư"
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
  }, [cauHinhHeThong, mapInputTypeToApiConfig, refetch]);

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
    }
  }, [cauHinhHeThong, mapApiConfigToInputType]);

  // Hiển thị loading khi đang fetch data
  if (isLoading) {
    return (
      <Page className="relative flex-1 flex flex-col pb-[66px]">
        <HeaderSub title="Cấu hình nhập liệu" />
        <Box px={2} py={4} className="flex items-center justify-center">
          <div className="text-center">
            <Icon icon="eos-icons:loading" fontSize={32} className="animate-spin text-primary-color" />
            <div className="mt-2 text-gray-600">Đang tải cấu hình...</div>
          </div>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="relative flex-1 flex flex-col pb-[66px]">
      <HeaderSub title="Cấu hình nhập liệu" />
      <Box px={2} py={4}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Box className="rounded-lg overflow-hidden shadow-md">
              <div className="p-4 bg-primary-color text-white text-[18px] leading-[24px] font-medium flex items-center gap-3">
                <Icon icon='tdesign:gesture-typing' fontSize={18} />
                Quy cách nhập liệu
                {isUpdating && (
                  <Icon icon="eos-icons:loading" fontSize={16} className="animate-spin ml-auto" />
                )}
              </div>
              <div className="bg-white border-primary-color">
                {inputConfigs.map((config) => (
                  <Box 
                    key={config.id}
                    py={3}
                    px={4}
                    flex 
                    alignItems="center" 
                    className="gap-4 border-b last:border-b-0"
                  >
                    <input 
                      className="scale-[1.4]"
                      id={config.id}
                      name="input-type"
                      type="radio"
                      checked={selectedInputType === config.id}
                      onChange={() => handleInputTypeChange(config.id)}
                      disabled={isUpdating}
                    />
                    <label htmlFor={config.id} className="cursor-pointer flex-1">
                      <div className="text-[20px] leading-[24px] font-semibold text-primary-color">{config.title}</div>
                      <div className="text-[16px] leading-[22px] font-medium text-gray-800 mt-2">{config.example}</div>
                      <div className="text-[16px] leading-[22px] font-medium text-green-700">⟹ {config.result}</div>
                    </label>
                  </Box>
                ))}
              </div>
            </Box>
          </div>

          {/* Test Area */}
          {selectedInputType && (
            <div className="col-span-12 mt-4">
              <Box className="rounded-lg overflow-hidden shadow-md">
                <div className="p-4 bg-primary-color text-white text-[18px] leading-[24px] font-medium flex items-center gap-3">
                  <Icon icon='carbon:test-tool' fontSize={18} />
                  Test tính toán
                </div>
                <div className="bg-white p-4">
                  <div className="mb-3">
                    <label className="block text-[16px] leading-[22px] font-medium text-gray-700 mb-2">
                      Nhập giá trị test (có thể nhập nhiều số cách nhau bởi dấu phẩy):
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
                      className="w-full h-[42px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </Page>
  );
};

export default FarmerPage;