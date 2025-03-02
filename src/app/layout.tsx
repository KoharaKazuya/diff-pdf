"use client";

import {
  defaultTheme,
  Provider as ReactSpectrumProvider,
} from "@adobe/react-spectrum";
import { LocalizedStringProvider } from "@adobe/react-spectrum/i18n";
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
        <LocalizedStringProvider locale="ja" />
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
