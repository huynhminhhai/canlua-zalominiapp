import React from 'react';

type InfoBoxProps = {
    label: string;
    value: string | number;
    color?: 'black' | 'blue';
    span?: number;
    note?: string;
};

const InfoBox = ({ label, value, color = 'black', span = 6, note }: InfoBoxProps) => {
    const colorClass = color === 'blue' ? 'text-blue-700' : 'text-black';

    return (
        <div className={`col-span-${span}`}>
            <div className='flex flex-col items-center gap-1 p-3 border-[1px]'>
                <div className='text-[15px] text-gray-color leading-[22px] font-medium'>{label}</div>
                <div className={`text-[20px] ${colorClass} leading-[24px] font-bold`}>
                    {value.toLocaleString?.('vi-VN') ?? value}
                </div>
                {note && (
                    <div className='text-[14px] text-gray-color leading-[22px] font-normal italic'>{note}</div>
                )}
            </div>
        </div>
    );
};

export default InfoBox;