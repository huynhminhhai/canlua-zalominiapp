import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { App, SnackbarProvider, ZMPRouter, useNavigate } from "zmp-ui";
import { RecoilRoot } from "recoil";
import ScrollToTop from "./scroll-top";
import { HomePage } from "pages/homepage";
import { AccountPage, ChangePasswordPage, GuidePage, LoginPage, ProfileAccountPage, RegisterApPage, WelcomePage } from "pages/account";
import { LoadingFullScreen } from "./loading";
import { useStoreApp } from "store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDataFromStorage } from "services/zalo";
import ForbiddenPage from "pages/403";
import { IsComingSoonModal, LoginModal, RegisterApModal } from "./modal";
import { useRefreshToken } from "apiRequest/auth";
import Navigation from "./navigation";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AuthWrapper = ({ children }) => {
  const { setToken, setAccount, accessToken, fetchResidentTypes } = useStoreApp();
  const navigate = useNavigate();
  const refreshTokenMutation = useRefreshToken();

  const loadAuthData = async () => {

    try {
      const storedData = await getDataFromStorage(["account", "accessToken", "refreshToken", "hanSuDungToken"]);

      if (!storedData || !storedData.accessToken) {
        setToken({ accessToken: null, refreshToken: null, hanSuDungToken: null });
        setAccount(null);
        navigate("/");
        return;
      }

      const storedAccount = storedData.account ? JSON.parse(storedData.account) : null;
      const storedAccessToken = storedData.accessToken || null;
      const storedRefreshToken = storedData.refreshToken || null;
      const storedHanSuDungToken = storedData.hanSuDungToken || null;

      console.log('Thông tin account:', storedAccount);
      console.log('Hạn sử dụng token:', storedHanSuDungToken);

      if (storedHanSuDungToken) {
        const now = new Date();
        const expiry = new Date(storedHanSuDungToken);

        const timeDiff = expiry.getTime() - now.getTime();
        const minutesLeft = timeDiff / (1000 * 60);

        if (minutesLeft <= 0) {
          // Token đã hết hạn
          setToken({ accessToken: null, refreshToken: null, hanSuDungToken: null });
          setAccount(null);
          navigate("/");
          return;
        }

        if (minutesLeft <= 15) {
          refreshTokenMutation.mutate();
        }
      }

      fetchResidentTypes();

      setToken({
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        hanSuDungToken: storedHanSuDungToken
      });
      setAccount(storedAccount);
    } catch (error) {
      console.error("Lỗi khi load dữ liệu từ storage:", error);
      setToken({ accessToken: null, refreshToken: null, hanSuDungToken: null });
      setAccount(null);
      navigate("/");
    }
  };

  useEffect(() => {
    loadAuthData();
  }, [accessToken]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const storedHanSuDungToken = await getDataFromStorage(["hanSuDungToken"]);
      if (!storedHanSuDungToken?.hanSuDungToken) return;

      const now = new Date();
      const expiry = new Date(storedHanSuDungToken.hanSuDungToken);

      const timeDiff = expiry.getTime() - now.getTime();
      const minutesLeft = timeDiff / (1000 * 60);

      if (minutesLeft <= 0) {
        // Hết hạn → logout
        setToken({ accessToken: null, refreshToken: null, hanSuDungToken: null });
        setAccount(null);
        navigate("/");
      } else if (minutesLeft <= 15 && !refreshTokenMutation.isPending) {
        // Gần hết hạn → tự động refresh
        refreshTokenMutation.mutate();
      }
    }, 60 * 1000); // Check mỗi phút

    return () => clearInterval(interval); // Clear khi unmount
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
              <LoadingFullScreen isLoading={isLoadingFullScreen} />
              <Routes>

                <Route path="/welcome" element={<WelcomePage></WelcomePage>}></Route>
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
                        <Route path="/profile-account" element={<ProfileAccountPage></ProfileAccountPage>}></Route>
                        <Route path="/change-password" element={<ChangePasswordPage></ChangePasswordPage>}></Route>
                        <Route path="/register-ap" element={<RegisterApPage></RegisterApPage>}></Route>

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
