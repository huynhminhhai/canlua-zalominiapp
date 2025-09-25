import { Icon } from "@iconify/react";
import images from "assets/images";
import React from "react";
import { Box, Header } from "zmp-ui";

type HeaderSubProps = {
    title: string;
    onBackClick?: () => void;
    onCreate?: () => void;
    showBackIcon?: boolean
}

export const HeaderSub: React.FC<HeaderSubProps> = ({ title, onBackClick, onCreate, showBackIcon = true }) => {

    return (
        <Header
            className="sub shadow-sm !bg-white"
            // style={{
            //     backgroundImage: `url(${images.bg})`,
            //     backgroundRepeat: "no-repeat",
            //     backgroundSize: "cover",
            //     backgroundPosition: "top",
            // }}
            {...(onBackClick ? { onBackClick } : {})}
            title={
                (
                    <div className="flex items-center mt-[6px] gap-2">
                        <Box flex alignItems="center">
                            <h4 className="text-[20px] leading-[24px] font-semibold text-heading-color">{title}</h4>
                        </Box>
                        {
                            onCreate &&
                            <Box onClick={onCreate}>
                                <Icon icon="solar:add-circle-bold" fontSize={32} className="text-dark-color" />
                            </Box>
                        }
                    </div>
                ) as unknown as string
            }
            showBackIcon={showBackIcon}
        />
    )
}