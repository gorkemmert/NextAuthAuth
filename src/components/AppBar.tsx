"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Switch from "@mui/material/Switch";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import TuneIcon from "@mui/icons-material/Tune";

const drawerWidth = 260;

interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean;
  handleDrawerOpen?: () => void;
}

const AppBarStyled = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "none",
  border: "1px solid #e0e0e0",
  borderRadius: 2, 
  color: "#111827",
  minHeight: 80,
  justifyContent: "center",
  width: `calc(100% - ${drawerWidth+22}px)`,
  marginLeft: `${drawerWidth}px`, 
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

export default function AppBar({ handleSwitchChange }: { handleSwitchChange: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = async () => {
    handleMenuClose();
    await signOut({ redirect: false });
    router.push("/login");
  };

  const getPageTitle = () => {
    if (pathname === "/collections") {
      
      return { title: "Koleksiyon", subtitle: "Koleksiyon Listesi" };
    } else if (pathname === "/collections/edit") {
      return { title: "Sabitleri Düzenle", subtitle: "Koleksiyon" };
    }
    return { title: "Başlık", subtitle: "Alt Başlık" }; // Varsayılan değer
  };
      
  const { title, subtitle } = getPageTitle();
  // const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsDarkMode(event.target.checked); // Switch durumunu güncelle
  // };

  return (
    <AppBarStyled position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 100, alignItems: "center" }}>
        {/* Sol Kısım */}
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        {/* Sağ Kısım */}
        <Stack
          direction="row"
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%" }} // burası eklendi
        >
          <Brightness7Icon color="primary" />
          <Switch
            checked={isDarkMode}
            onChange={handleSwitchChange}
            color="primary"
          />
          <Brightness4Icon />
          <Divider orientation="vertical" flexItem />

          <PublicIcon />
          <Badge badgeContent={12} color="primary">
            <NotificationsIcon />
          </Badge>
          <EmailIcon />
          <TuneIcon />
          <>
          <Avatar
            sx={{ bgcolor: "#bdbdbd", width: 32, height: 32, cursor: "pointer" }}
            onClick={handleAvatarClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogoutClick}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                Çıkış Yap
              </Typography>
            </MenuItem>
          </Menu>
        </>
        </Stack>
      </Toolbar>
    </AppBarStyled>
  );
}
