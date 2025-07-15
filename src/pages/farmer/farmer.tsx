import { FarmerList } from "components/farmer";
import { HeaderSub } from "components/header-sub";
import React from "react";
import { Page, useSearchParams } from "zmp-ui";

const FarmerPage: React.FunctionComponent = () => {

  const [searchParams] = useSearchParams();
  const tenNhom = searchParams.get("tenNhom");

  return (
    <Page className="relative flex-1 flex flex-col">
      <HeaderSub title={tenNhom || "Danh sách người cân"} />
      <FarmerList />
    </Page>
  );
};

export default FarmerPage;