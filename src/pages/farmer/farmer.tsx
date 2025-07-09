import { FarmerList } from "components/farmer";
import { GroupList } from "components/group";
import { HeaderSub } from "components/header-sub";
import React from "react";
import { Page } from "zmp-ui";

const FarmerPage: React.FunctionComponent = () => {

  return (
    <Page className="relative flex-1 flex flex-col">
      <HeaderSub title="Danh sách hộ nông dân" />
      <FarmerList />
    </Page>
  );
};

export default FarmerPage;