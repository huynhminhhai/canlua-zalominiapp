import { Icon } from "@iconify/react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { BottomNavigation } from "zmp-ui";
import { MenuItem } from "constants/types";
import { useStoreApp } from "store/store";

const Navigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { account, accessToken, isTrigger, setIsTrigger } = useStoreApp();

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

  const isAdmin = account?.vaiTros.some((r) => r.tenVaiTro === "Administrators");
  const isRegisteredWithAnotherRole =
    account?.vaiTros.some((r) => r.tenVaiTro === "Registered Users") &&
    (account?.vaiTros.length ?? 0) > 1;

  const visibleTabs = Object.keys(tabs).filter((path) => {
    if (path === "/") return true;
    if (path === "/account") return true;
    if (path === "/settings") return true;
    if (!account) return false;
    if (isAdmin) return true;
    return isRegisteredWithAnotherRole;
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
