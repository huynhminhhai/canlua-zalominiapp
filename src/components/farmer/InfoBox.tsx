import React from 'react';

type InfoBoxProps = {
    label: string;
    value: string | number;
    colorClass?: string;
    span?: number;
    note?: string;
    formatNumber?: boolean;
    fs?: number;
    fw?: 'normal' | 'medium' | 'semibold' | 'bold';
    labelFs?: number;
    noteFs?: number;
};

const InfoBox = ({
    label,
    value,
    colorClass = 'text-black',
    span = 6,
    note,
    formatNumber = false,
    fs = 20,
    fw = 'semibold',
    labelFs = 15,
    noteFs = 14
}: InfoBoxProps) => {

    const displayValue =
        formatNumber && typeof value === 'number'
            ? value.toLocaleString('vi-VN')
            : value;

    return (
        <div className={`col-span-${span} h-full`}>
            <div className='flex flex-col items-center gap-1 px-2 py-4 border-[1px] h-full'>
                <div className={`text-[${labelFs}px] text-gray-600 leading-[22px] font-medium`}>{label}</div>
                <div className={`text-[${fs}px] ${colorClass} leading-[24px] font-${fw}`}>
                    {displayValue}
                </div>
                {note && (
                    <div className={`text-[${noteFs}px] text-gray-600 leading-[22px] font-medium italic text-center`}>{note}</div>
                )}
            </div>
        </div>
    );
};

export default InfoBox;