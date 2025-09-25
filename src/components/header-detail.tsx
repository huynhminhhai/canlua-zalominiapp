import images from 'assets/images'
import React from 'react'
import { Box, Header } from 'zmp-ui'

type HeaderDetailProps = {
    title: string,
    weight: string,
    count: string
}

const HeaderDetail: React.FC<HeaderDetailProps> = ({
    title,
    weight,
    count
}) => {
    return (
        <Header
            className="sub shadow-sm !bg-white"
            // style={{
            //     backgroundImage: `url(${images.bg})`,
            //     backgroundRepeat: "no-repeat",
            //     backgroundSize: "cover",
            //     backgroundPosition: "top",
            // }}
            title={
                (
                    <div className="flex items-center mt-[6px] gap-2">
                        <Box flex flexDirection='column' alignItems="flex-start" className='gap-[4px]'>
                            <h4 className="text-[20px] leading-[24px] font-semibold text-dark-color">{title}</h4>
                            <div className='text-[18px] leading-[20px] font-semibold text-dark-color'>
                                {weight} kg / {count} lần cân (bao)
                            </div>
                        </Box>
                    </div>
                ) as unknown as string
            }
        />
    )
}

export default HeaderDetail