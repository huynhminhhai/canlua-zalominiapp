import React from 'react';
import clsx from 'clsx';

type PhienCanType = {
    quyCachNhap: number;
    choPhepNhapSoLe: boolean;
};

type Props = {
    phienCan: PhienCanType | null;
};

const InputGuide: React.FC<Props> = ({ phienCan }) => {
    if (!phienCan) return null;

    const { quyCachNhap, choPhepNhapSoLe } = phienCan;

    const renderHuongDan = () => {
        if (quyCachNhap === 2) {
            return (
                <div className="mt-2">
                    <p className="text-[16px] text-gray-700">Ví dụ: <span className="font-semibold">75</span> ⟹ <span className="font-semibold">75 kg</span></p>
                </div>
            );
        }

        if (quyCachNhap === 3 && choPhepNhapSoLe) {
            return (
                <div className="mt-2">
                    <p className="text-[16px] text-gray-700">Ví dụ: <span className="font-semibold">755</span> ⟹ <span className="font-semibold">75.5 kg</span></p>
                </div>
            );
        }

        if (quyCachNhap === 3 && !choPhepNhapSoLe) {
            return (
                <div className="mt-2">
                    <p className="text-[16px] text-gray-700">Ví dụ: <span className="font-semibold">155</span> ⟹ <span className="font-semibold">155 kg</span></p>
                </div>
            );
        }

        if (quyCachNhap === 4) {
            return (
                <div className="mt-2">
                    <p className="text-[16px] text-gray-700">Ví dụ: <span className="font-semibold">1505</span> ⟹ <span className="font-semibold">150.5 kg</span></p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="text-[16px] text-gray-800 font-medium mb-3 bg-blue-200 rounded-lg border-blue-400 border p-3">
            <p>
                <span className="font-semibold">Lưu ý:</span> Nhập <span className="font-semibold">{quyCachNhap}</span> chữ số
                {choPhepNhapSoLe && <span> có số dư</span>}
            </p>
            {renderHuongDan()}
        </div>
    );
};

export default InputGuide;
