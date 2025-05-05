"use client";

import { useSession } from "next-auth/react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { deepPurple } from "@mui/material/colors";
import Link from "next/link";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface SidebarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

export default function Sidebar({ open, handleDrawerClose }: SidebarProps) {
  const theme = useTheme();
  const { data: session } = useSession();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#111827",
          color: "white",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton sx={{ color: "white" }} onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box sx={{ padding: 2, display: "flex", alignItems: "center", flexDirection: "column", marginBottom: 2 }}>
        <Avatar sx={{ width: 56, height: 56, marginBottom: 1, bgcolor: deepPurple[500] }} />
        <Typography variant="body1" align="center" sx={{ textAlign: "center" }}>
          {session?.user?.name || "Misafir"}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <Link className="w-full" href="/">
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: "#849DB5",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Ana Sayfa"} />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <Link className="w-full" href="/settings">
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: "#849DB5",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={"Ayarlar"} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
}
