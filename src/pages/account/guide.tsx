import { Icon } from "@iconify/react";
import images from "assets/images";
import { CauHinh, HoBanLua, NhapGiaTriCan, Nhom, ThanhToan } from "components/guide";
import { HeaderSub } from "components/header-sub"
import React, { useState } from "react"
import { Box, Button, List, Page, Sheet, Text } from "zmp-ui"

const GuidePage: React.FC = () => {

    const [sheetVisible, setSheetVisible] = useState(false);
    const { Item } = List;

    return (
        <Page className="relative flex-1 flex flex-col bg-white pb-[72px]">
            <Box>
                <HeaderSub title="Hướng dẫn sử dụng" />
                <Box>
                    <Box p={3}>
                        <List className="bg-white rounded-lg">
                            <CauHinh />
                            <Nhom />
                            <HoBanLua />
                            <NhapGiaTriCan />
                            <ThanhToan />
                        </List>
                    </Box>
                </Box>
            </Box>
        </Page>
    )
}

export default GuidePage