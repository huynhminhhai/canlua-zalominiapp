import React, { FC } from "react";
import { Box, useNavigate } from "zmp-ui";
import { useStoreApp } from "store/store";
import images from "assets/images";
import { maskPhoneNumber } from "utils/number";
import { Icon } from "@iconify/react";
import { useGetGoiDangKyMoiNhat } from "apiRequest/goiSuDung";

export const HeaderHome: FC = () => {

  const { account } = useStoreApp();

  const navigate = useNavigate()

  const { data, isLoading } = useGetGoiDangKyMoiNhat();

  return (
    <Box
      style={{
        backgroundImage: `url(${images.bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      px={3}
      pt={5}
      pb={10}
    >
      <Box flex alignItems="center" className="space-x-3" onClick={() => navigate(`/account`)}>
        <div className="w-[54px] h-[54px] rounded-full border-[2px] border-[#e3ecf9] overflow-hidden bg-[#f0f0f0]">
          <img
            className="h-[100%] w-[100%] object-cover"
            src={images.vnpt}
          />
        </div>
        <Box>
          <h4 className="text-[18px] font-semibold leading-[1] tracking-widest text-white uppercase mb-2">
            {account ? account?.phoneNumber ? maskPhoneNumber(account?.phoneNumber) : "Vnpt Tây Ninh" : "Khách"}
          </h4>
          {
            data &&
            <h5 className="text-[12px] font-medium leading-[1] tracking-widest text-white">
              <div className="flex items-center gap-2">
                <Icon
                  icon={data?.result ? "solar:star-bold" : "solar:user-bold"}
                  fontSize={12}
                  className={data?.result ? "text-yellow-500" : "text-white"}
                />
                <span className={`font-semibold ${data?.result ? 'text-yellow-500' : 'text-white'}`}>
                  {isLoading ? (
                    <Icon icon="line-md:loading-twotone-loop" fontSize={16} />
                  ) : data?.result ? (
                    `Gói ${data.result.chuKy} tháng`
                  ) : (
                    'Tài khoản miễn phí'
                  )}
                </span>
              </div>
            </h5>
          }
        </Box>
      </Box>
      <h5 className="mt-2 text-[11px] font-medium leading-[16px] tracking-widest text-white">
        Ứng dụng đang được phát triển, hoàn thiện
      </h5>
    </Box>
  );
};