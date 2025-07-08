import React, { FC } from "react";
import { Avatar, Box, Header, useNavigate } from "zmp-ui";
import { useStoreApp } from "store/store";
import images from "assets/images";

export const HeaderHome: FC = () => {

  const navigate = useNavigate()

  return (
    <Header
      className="app-header no-border pl-4 flex-none relative"
      showBackIcon={false}
      title={
        (
          <Box>
            
          </Box>
        ) as unknown as string
      }
    />
  );
};