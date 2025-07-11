import React from 'react';

type InfoBoxProps = {
    label: string;
    value: string | number;
    colorClass?: string;
    span?: number;
    note?: string;
    formatNumber?: boolean;
};

const InfoBox = ({ label, value, colorClass = 'text-black', span = 6, note, formatNumber = false }: InfoBoxProps) => {

    const displayValue =
        formatNumber && typeof value === 'number'
            ? value.toLocaleString('vi-VN')
            : value;

    return (
        <div className={`col-span-${span}`}>
            <div className='flex flex-col items-center gap-1 p-3 border-[1px]'>
                <div className='text-[15px] text-gray-color leading-[22px] font-medium'>{label}</div>
                <div className={`text-[20px] ${colorClass} leading-[24px] font-semibold`}>
                    {displayValue}
                </div>
                {note && (
                    <div className='text-[14px] text-gray-color leading-[22px] font-normal italic'>{note}</div>
                )}
            </div>
        </div>
    );
};

export default InfoBox;