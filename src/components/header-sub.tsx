import { Icon } from "@iconify/react";
import React from "react";
import { Box, Header } from "zmp-ui";

type HeaderSubProps = {
    title: string;
    onBackClick?: () => void;
    onCreate?: () => void;
}

export const HeaderSub: React.FC<HeaderSubProps> = ({title, onBackClick, onCreate}) => {
    
    return (
        <Header 
            className="sub shadow-sm"
            {...(onBackClick ? { onBackClick } : {})}
            title={
                (
                    <Box flex alignItems="center" className="gap-2">
                        <Box flex alignItems="center">
                            <h4 className="text-[20px] leading-[20px] font-medium">{title}</h4>
                        </Box>
                        {
                            onCreate &&
                            <Box onClick={onCreate}>
                                <Icon icon="solar:add-circle-bold" fontSize={32} />
                            </Box>
                        }
                    </Box>
                ) as unknown as string
            }
            showBackIcon={false}
        />
    )
}