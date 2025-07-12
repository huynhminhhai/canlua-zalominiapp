import { Icon } from "@iconify/react";
import React, { FC, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { BottomNavigation } from "zmp-ui";
import { MenuItem } from "constants/types";
import { useStoreApp } from "store/store";

const Navigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { account, isTrigger, setIsTrigger } = useStoreApp();

  const tabs: Record<string, MenuItem & { requiresLogin?: boolean; requiredRole?: string }> = {
    "/": {
      label: "Trang chủ",
      icon: <div className="relative"><Icon icon="solar:home-linear" /></div>,
    },
    "/settings": {
      label: "Cài đặt",
      icon: <div className="relative"><Icon icon="solar:settings-linear" /></div>,
    },
    "/account": {
      label: "Tài khoản",
      icon: <div className="relative"><Icon icon="stash:person-duotone" /></div>,
    },
  };

  const HAS_BOTTOM_NAVIGATION_PAGES = ["/", "/account", "/settings"];

  const hasBottomNav = useMemo(() => {
    return HAS_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (!hasBottomNav) return null;

  const visibleTabs = Object.keys(tabs).filter((path) => {
    // Luôn hiển thị các tab cố định
    if (path === "/" || path === "/account" || path === "/settings") {
      return true;
    }
  
    // Các tab khác chỉ hiện nếu đã có tài khoản (đã đăng nhập)
    return !!account;
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
            setIsTrigger(!isTrigger);
            navigate(path)
          }}
        />
      ))}
    </BottomNavigation>
  );
};

export default Navigation;
