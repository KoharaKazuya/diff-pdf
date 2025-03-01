"use client";

import {
  defaultTheme,
  Provider as ReactSpectrumProvider,
} from "@adobe/react-spectrum";
import "sanitize.css";
import AppStateProvider from "../components/AppStateProvider";
import Header from "../components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ReactSpectrumProvider theme={defaultTheme} locale="ja">
          <AppStateProvider>
            <Header />
            {children}
          </AppStateProvider>
        </ReactSpectrumProvider>
      </body>
    </html>
  );
}
