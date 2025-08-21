import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { App, SnackbarProvider, ZMPRouter, useNavigate } from "zmp-ui";
import { RecoilRoot } from "recoil";
import ScrollToTop from "./scroll-top";
import { HomePage } from "pages/homepage";
import { AccountPage, GuidePage, LoginPage } from "pages/account";
import { LoadingFullScreen } from "./loading";
import { useStoreApp } from "store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDataFromStorage } from "services/zalo";
import ForbiddenPage from "pages/403";
import { IsComingSoonModal, LoginModal, RegisterApModal, UpgradeModal } from "./modal";
import Navigation from "./navigation";
import { pdfjs } from 'react-pdf';
import { FarmerDetailPage, FarmerListPage } from "pages/farmer";
import { SettingsPage } from "pages/settings";
import { CalcPage } from "pages/calc";
import { PlanHistoryPage, PlanPage, PlanPayPage } from "pages/plan";
import { authApiRequest } from "apiRequest/auth";
import { getExpiresAt } from "utils/date";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AuthWrapper = ({ children }) => {
  const { setAccount } = useStoreApp();
  const navigate = useNavigate();

  const loadAuthData = async () => {

    try {
      const storedData = await getDataFromStorage(["account"]);

      if (!storedData || !storedData.account) {
        setAccount(null);
        navigate("/");
        return;
      }

      const storedAccount = JSON.parse(storedData.account);
      const { accessToken, refreshToken, expiresAt } = storedAccount;

      const now = Date.now();

      console.log('Thông tin tài khoản: ', storedAccount);
      console.log('Tài khoản hết hạn: ', now > expiresAt)

      // if (!accessToken || now > expiresAt) {
      //   try {
      //     const newTokens = await authApiRequest.refreshToken(refreshToken);

      //     console.log('new token', newTokens);

      //     const updatedAccount = {
      //       ...storedAccount,
      //       ...newTokens,
      //       expiresAt: getExpiresAt(newTokens?.expireInSeconds)
      //     };

      //     setAccount(updatedAccount);
      //   } catch (err) {
      //     console.error("Refresh token failed:", err);
      //     setAccount(null);
      //     navigate("/");
      //   }
      // } else {
      //   setAccount(storedAccount);
      // }

      setAccount(storedAccount);
      
    } catch (error) {
      console.error("Lỗi khi load dữ liệu từ storage:", error);
      setAccount(null);
      navigate("/");
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  // If accessToken is null, we'll redirect to login; otherwise, render children
  return children;
};

const MyApp = () => {

  const { isLoadingFullScreen } = useStoreApp();
  const queryClient = new QueryClient()

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <ScrollToTop />
              <RegisterApModal />
              <IsComingSoonModal />
              <LoginModal />
              <UpgradeModal />
              <LoadingFullScreen isLoading={isLoadingFullScreen} />
              <Routes>

                <Route path="/guide" element={<GuidePage></GuidePage>}></Route>
                <Route path="/403" element={<ForbiddenPage></ForbiddenPage>}></Route>

                <Route
                  path="/*"
                  element={
                    <AuthWrapper>
                      <Routes>

                        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
                        <Route path="/" element={<HomePage></HomePage>}></Route>

                        {/* ACCOUNT */}
                        <Route path="/account" element={<AccountPage></AccountPage>}></Route>

                        {/* FARMER */}
                        <Route path="/farmer-list" element={<FarmerListPage></FarmerListPage>}></Route>
                        <Route path="/farmer-detail" element={<FarmerDetailPage></FarmerDetailPage>}></Route>
                      
                        {/* SETTINGS */}
                        <Route path="/settings" element={<SettingsPage></SettingsPage>}></Route>

                        {/* CALC */}
                        <Route path="/calc" element={<CalcPage></CalcPage>}></Route>

                        {/* PLAN */}
                        <Route path="/plan" element={<PlanPage></PlanPage>}></Route>
                        <Route path="/plan-pay" element={<PlanPayPage></PlanPayPage>}></Route>
                        <Route path="/plan-history" element={<PlanHistoryPage></PlanHistoryPage>}></Route>

                      </Routes>
                      <Navigation />
                    </AuthWrapper>
                  }
                />
              </Routes>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </QueryClientProvider>
    </RecoilRoot>
  );
};
export default MyApp;
