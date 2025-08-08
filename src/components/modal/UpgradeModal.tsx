import { Icon } from '@iconify/react'
import images from 'assets/images'
import React from 'react'
import { useLoginWithZalo } from 'services/loginWithZalo'
import { useStoreApp } from 'store/store'
import { Button, List, Modal, useNavigate } from 'zmp-ui'

const UpgradeModal = () => {

    const { isShowModalUpgrade, setIsShowModalUpgrade } = useStoreApp()
    const { Item } = List;
    const { loginWithZalo } = useLoginWithZalo();

    const navigate = useNavigate()

    return (
        <Modal
            visible={isShowModalUpgrade}
            onClose={() => setIsShowModalUpgrade(false)}
            title='Tài khoản miễn phí đã hết'
        >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl mb-6 mt-4">
                <div className="flex items-start gap-2 px-3 py-5">
                    <Icon icon={'mynaui:sparkles'} className="text-indigo-500 mt-0.5 flex-shrink-0" fontSize={22} />
                    <div className="text-gray-700 leading-relaxed">
                        <p className="font-semibold text-gray-900 mb-2 text-[16px] leading-[24px]">
                            Bạn đã sử dụng hết giới hạn của tài khoản miễn phí.
                        </p>
                        <p className="text-gray-600 text-[16px] leading-[24px] font-medium">
                            Để tiếp tục sử dụng đầy đủ tính năng, vui lòng nâng cấp lên gói phù hợp.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1 text-[16px] leading-[24px]">
                    <Icon icon={'material-symbols:star-outline-rounded'} className="text-indigo-500" fontSize={22} />
                    Những gì bạn sẽ nhận được:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 pl-6">
                    <li className="flex items-center gap-2 text-[16px] leading-[24px] font-medium">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Tạo nhóm không giới hạn
                    </li>
                    <li className="flex items-center gap-2 text-[16px] leading-[24px] font-medium">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Tạo hộ bán lúa không giới hạn
                    </li>
                </ul>
            </div>

            <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-5'>
                    <Button variant='secondary' onClick={() => setIsShowModalUpgrade(false)} fullWidth>
                        Để sau
                    </Button>
                </div>
                <div className='col-span-7'>
                    <Button
                        variant='primary'
                        onClick={() => {
                            setIsShowModalUpgrade(false)
                            navigate('/plan')
                        }}
                        fullWidth
                    >
                        <div className='flex items-center gap-2 justify-center'>
                            Nâng cấp
                            <Icon icon={'ep:right'} />
                        </div>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default UpgradeModal