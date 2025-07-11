import { FarmerResultForm } from "components/farmer";
import React from "react";
import { Page } from "zmp-ui";

const FarmerDetailPage: React.FunctionComponent = () => {

  return (
    <Page className="relative flex-1 flex flex-col !bg-white !mt-[76px]">
      <FarmerResultForm />
    </Page>
  );
};

export default FarmerDetailPage;