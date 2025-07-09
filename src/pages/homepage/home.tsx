
import { GroupList } from "components/group";
import { HeaderSub } from "components/header-sub";
import React from "react";
import { useStoreApp } from "store/store";
import { Page, useNavigate } from "zmp-ui";

const HomePage: React.FunctionComponent = () => {

  const { account, hasPermission } = useStoreApp()
  const navigate = useNavigate()

  return (
    <Page className="relative flex-1 flex flex-col pb-[66px] home">
      <HeaderSub title="Danh sách nhóm" showBackIcon={false} />
      <GroupList />
    </Page>
  );
};

export default HomePage;
