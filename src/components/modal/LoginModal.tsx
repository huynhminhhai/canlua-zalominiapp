import { Icon } from '@iconify/react'
import images from 'assets/images'
import React from 'react'
import { useLoginWithZalo } from 'services/loginWithZalo'
import { useStoreApp } from 'store/store'
import { Button, List, Modal, useNavigate } from 'zmp-ui'

const LoginModal = () => {

    const { isShowModalIsLogin, setIsShowModalIsLogin } = useStoreApp()
    const { Item } = List;
    const { loginWithZalo } = useLoginWithZalo();

    const navigate = useNavigate()

    return (
        <Modal
            visible={isShowModalIsLogin}
            onClose={() => setIsShowModalIsLogin(false)}
            title='Chức năng cần đăng nhập'
        >
            <List className="bg-white rounded-lg">
                <Item
                    onClick={() => {
                        loginWithZalo()
                        setIsShowModalIsLogin(false)
                    }}
                    title="Liên kết số điện thoại"
                    prefix={<img src={images.zalo} width={30} />}
                    suffix={<Icon fontSize={20} icon="formkit:right" />}
                    className='!px-0'
                    subTitle={'Yêu cầu truy cập số điện thoại'}
                />
            </List>

            <div className='flex justify-end items-center'>
                <button onClick={() => setIsShowModalIsLogin(false)} className='font-medium'>Đóng</button>
            </div>
        </Modal>
    )
}

export default LoginModal