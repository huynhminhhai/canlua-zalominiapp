import { FarmerList } from "components/farmer";
import { HeaderSub } from "components/header-sub";
import React from "react";
import { Page } from "zmp-ui";

const FarmerPage: React.FunctionComponent = () => {

  return (
    <Page className="relative flex-1 flex flex-col">
      <HeaderSub title="Xe 10 tấn 62n1-12345" />
      <FarmerList />
    </Page>
  );
};

export default FarmerPage;