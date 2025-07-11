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
            className="sub shadow-sm"
            title={
                (
                    <div className="flex items-center mt-[6px] gap-2">
                        <Box flex flexDirection='column' alignItems="flex-start" className='gap-[4px]'>
                            <h4 className="text-[20px] leading-[24px] font-medium">{title}</h4>
                            <div className='text-[16px] leading-[18px] font-medium'>
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