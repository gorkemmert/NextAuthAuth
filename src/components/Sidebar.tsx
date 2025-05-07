"use client";

import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";

const drawerWidth = 260;

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          color: "#000",
          borderRight: "none"
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            px: 3,
            py: 1,
            fontWeight: "bold",
            fontSize: "24px",
            letterSpacing: "2px",
            color: "#000",
          }}
        >
          LOGO
        </Box>
      </Box>
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2, 
          overflow: "hidden", 
          height: "calc(100% - 32px)"
        }}
      >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
          MENÜ
        </Typography>
      </Box>
      
      <List>
        <ListItem disablePadding>
          <Link href="/" className="flex w-full">
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Inventory2OutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Ürünler" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
          Satış
        </Typography>
      </Box>

      <Box sx={{ px: 2 }}>
        <ListItemButton sx={{ border: "1px solid #000", borderRadius: 1 }}>
          <ListItemIcon>
            <ShoppingCartOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Koleksiyon" />
        </ListItemButton>
      </Box>
      </Box>
    </Drawer>
  );
}
