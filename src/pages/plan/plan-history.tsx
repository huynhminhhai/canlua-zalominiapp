import { HeaderSub } from "components/header-sub";
import { PlanList } from "components/plan";
import React from "react";
import { Page } from "zmp-ui";

const PlanHistoryPage: React.FunctionComponent = () => {

  return (
    <Page className="relative flex-1 flex flex-col">
      <HeaderSub title={'Lịch sử nâng cấp'} />
      <PlanList />
    </Page>
  );
};

export default PlanHistoryPage;