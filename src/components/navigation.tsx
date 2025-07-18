import { Icon } from "@iconify/react";
import React, { FC, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { BottomNavigation } from "zmp-ui";
import { MenuItem } from "constants/types";
import { useStoreApp } from "store/store";

const Navigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { account, isTrigger, setIsTrigger, accessToken, setIsShowModalIsLogin } = useStoreApp();

  const tabs: Record<string, MenuItem & { requiresLogin?: boolean; requiredRole?: string }> = {
    "/": {
      label: "Trang chủ",
      icon: <div className="relative"><Icon icon="solar:home-linear" /></div>,
    },
    "/calc": {
      label: "Máy tính",
      icon: <div className="relative"><Icon icon="solar:calculator-minimalistic-linear" /></div>,
    },
    "/settings": {
      label: "Cấu hình",
      icon: <div className="relative"><Icon icon="solar:settings-linear" /></div>,
    },
    "/account": {
      label: "Tài khoản",
      icon: <div className="relative"><Icon icon="stash:person-duotone" /></div>,
    },
  };

  const HAS_BOTTOM_NAVIGATION_PAGES = ["/", "/account", "/settings", "/calc"];

  const hasBottomNav = useMemo(() => {
    return HAS_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (!hasBottomNav) return null;

  const visibleTabs = Object.keys(tabs).filter((path) => {
    // // Luôn hiển thị các tab cố định
    // if (path === "/" || path === "/account" || path === "/settings") {
    //   return true;
    // }
  
    // // Các tab khác chỉ hiện nếu đã có tài khoản (đã đăng nhập)
    // return !!account;

    return true;
  });

  return (
    <BottomNavigation id="footer" activeKey={location.pathname} className="z-10 box-shadow-3">
      {visibleTabs.map((path) => (
        <BottomNavigation.Item
          key={path}
          label={tabs[path].label}
          icon={tabs[path].icon}
          activeIcon={tabs[path].activeIcon}
          onClick={() => {

            if (path === "/settings" && !accessToken) {
              setIsShowModalIsLogin(true);
              return;
            }      

            setIsTrigger(!isTrigger);
            navigate(path)
          }}
        />
      ))}
    </BottomNavigation>
  );
};

export default Navigation;
