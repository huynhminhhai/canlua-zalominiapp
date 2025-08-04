import { useGetCauHinhHeThong } from "apiRequest/cauHinhHeThong";
import { HeaderSub } from "components/header-sub";
import React from "react";
import { Box, Page } from "zmp-ui";
import _ from "lodash";
import { SettingsSkeleton } from "components/skeleton";
import { CaiDatNhomCan, QuyCachNhap, QuyCachTruBi } from "components/settings";

const FarmerPage: React.FunctionComponent = () => {
  
  const { data: cauHinhHeThong, isLoading, refetch } = useGetCauHinhHeThong();

  return (
    <Page className="relative flex-1 flex flex-col pb-[66px]">
      <HeaderSub title="Cấu hình hệ thống" />
      {
        isLoading ?
          <Box px={2} py={4} className="flex items-center justify-center">
            <SettingsSkeleton />
          </Box>
          :
          <Box px={2} py={4}>
            <div className="grid grid-cols-12 gap-6">

              <QuyCachTruBi cauHinhHeThong={cauHinhHeThong} />

              <CaiDatNhomCan cauHinhHeThong={cauHinhHeThong} />

              <QuyCachNhap cauHinhHeThong={cauHinhHeThong}  />
            </div>
          </Box>
      }
    </Page>
  );
};

export default FarmerPage;