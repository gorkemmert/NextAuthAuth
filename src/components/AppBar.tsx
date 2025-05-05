"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean;
  handleDrawerOpen?: () => void;
}

const AppBarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<CustomAppBarProps>(({ theme, open }) => ({
  backgroundColor: "white",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AppBar({ open, handleDrawerOpen }: CustomAppBarProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <AppBarStyled position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ color: "#111827", mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Koleksiyon Yönetimi
        </Typography>
        {session && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LogoutIcon />}
            sx={{ ml: "auto", color: "#111827", borderColor: "#111827" }}
            onClick={handleLogout}
          >
            Çıkış Yap
          </Button>
        )}
      </Toolbar>
    </AppBarStyled>
  );
}
