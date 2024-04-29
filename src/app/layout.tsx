import "~/styles/globals.css";

import { GeistMono } from "geist/font/mono";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "../components/theme-provider";

export const metadata = {
  title: "Rainy Day",
  description: "Weather app!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistMono.className}`}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}