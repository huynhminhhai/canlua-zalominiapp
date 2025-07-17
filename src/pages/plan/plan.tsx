import { HeaderSub } from "components/header-sub";
import { PlanCurrent, PlanForm } from "components/plan";
import React from "react";
import { Box, Page } from "zmp-ui";

const PlanPage: React.FunctionComponent = () => {

    return (
        <Page className="relative flex-1 flex flex-col">
            <HeaderSub title={"Nâng cấp tài khoản"} />
            <PlanCurrent />
            <PlanForm />
        </Page>
    );
};

export default PlanPage;