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
import { IsComingSoonModal, LoginModal, RegisterApModal } from "./modal";
import Navigation from "./navigation";
import { pdfjs } from 'react-pdf';
import { FarmerDetailPage, FarmerListPage } from "pages/farmer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AuthWrapper = ({ children }) => {
  const { setToken, setAccount, accessToken } = useStoreApp();
  const navigate = useNavigate();

  const loadAuthData = async () => {

    try {
      const storedData = await getDataFromStorage(["account", "accessToken"]);

      if (!storedData || !storedData.accessToken) {
        setToken({ accessToken: null });
        setAccount(null);
        navigate("/");
        return;
      }

      const storedAccount = storedData.account ? JSON.parse(storedData.account) : null;
      const storedAccessToken = storedData.accessToken || null;

      console.log('Thông tin account:', storedAccount);
      console.log('Hạn sử dụng token:', storedAccount?.expireInSeconds);

      setToken({
        accessToken: storedAccessToken,
      });
      setAccount(storedAccount);
    } catch (error) {
      console.error("Lỗi khi load dữ liệu từ storage:", error);
      setToken({ accessToken: null });
      setAccount(null);
      navigate("/");
    }
  };

  useEffect(() => {
    loadAuthData();
  }, [accessToken]);

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
