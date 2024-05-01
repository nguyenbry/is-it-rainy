import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "~/components/ui/sonner";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
