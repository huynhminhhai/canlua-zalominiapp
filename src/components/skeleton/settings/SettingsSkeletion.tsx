import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SettingsSkeleton = () => {
    return (
        <>
            <div className='grid grid-cols-12 gap-6'>
                {/* Skeleton Quy cách trừ bì */}
                <div className="col-span-12">
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <div className="p-4 bg-gray-200 text-white flex items-center gap-3">
                            <Skeleton circle width={18} height={18} />
                            <Skeleton width={150} height={24} />
                            <Skeleton className="ml-auto" width={16} height={16} />
                        </div>
                        <div className="bg-white border-primary-color p-4">
                            <Skeleton height={40} />
                        </div>
                    </div>
                </div>

                {/* Skeleton Quy cách nhập */}
                <div className="col-span-12">
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <div className="p-4 bg-gray-200 text-white flex items-center gap-3">
                            <Skeleton circle width={18} height={18} />
                            <Skeleton width={180} height={24} />
                            <Skeleton className="ml-auto" width={16} height={16} />
                        </div>
                        <div className="bg-white border-primary-color">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-4 border-b last:border-b-0 p-4">
                                    <Skeleton circle width={22} height={22} className="mt-1 scale-[1.4]" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton width="60%" height={24} />
                                        <Skeleton width="80%" height={20} />
                                        <Skeleton width="40%" height={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-12">
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <div className="p-4 bg-gray-200 text-white flex items-center gap-3">
                            <Skeleton circle width={18} height={18} />
                            <Skeleton width={150} height={24} />
                            <Skeleton className="ml-auto" width={16} height={16} />
                        </div>
                        <div className="bg-white border-primary-color p-4">
                            <Skeleton height={40} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsSkeleton;