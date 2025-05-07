"use client";

import { useState } from "react";
import './globals.css';
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import AppBar from "@/components/AppBar";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const theme = createTheme({
    palette: {
      mode: themeMode, 
      background: {
        default: themeMode === "light" ? "#ffffff" : "#0d47a1", 
        paper: themeMode === "light" ? "#ffffff" : "#1565c0", 
      },
      text: {
        primary: themeMode === "light" ? "#000000" : "#ffffff", 
        secondary: themeMode === "light" ? "#555555" : "#bbdefb", 
      },
    },
  });

  const handleSwitchChange = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };
  return (
    <html lang="tr">
      <body style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SessionProvider>
              <AuthGuard>
                <LayoutContent handleSwitchChange={handleSwitchChange}>
                  {children}
                </LayoutContent>
              </AuthGuard>
            </SessionProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children, handleSwitchChange }: any) {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Yükleniyor...</p>;

  if (!session) {
    return <>{children}</>;
  }

  return (
    <>
      <AppBar handleSwitchChange={handleSwitchChange} />
      <Sidebar />
      <div className="content" style={{ marginLeft: 260, marginTop: 90, marginBottom: 5 }}>
        {children}
      </div>
    </>
  );
}
