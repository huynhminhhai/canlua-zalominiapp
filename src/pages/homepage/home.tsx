
import { GroupList } from "components/group";
import { HeaderHome } from "components/header";
import React from "react";
import { Page } from "zmp-ui";

const HomePage: React.FunctionComponent = () => {

  return (
    <Page className="relative flex-1 flex flex-col pb-[66px] home !mt-0">
      <HeaderHome />
      <GroupList />
    </Page>
  );
};

export default HomePage;
