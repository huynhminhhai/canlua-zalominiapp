import BusinessCalculator from "components/BusinessCalculator";
import { HeaderSub } from "components/header-sub";
import React from "react";
import { Page } from "zmp-ui";

const CalcPage: React.FunctionComponent = () => {

  return (
    <Page className="relative flex-1 flex flex-col">
      <HeaderSub title={"Máy tính"} />
      <BusinessCalculator />
    </Page>
  );
};

export default CalcPage;