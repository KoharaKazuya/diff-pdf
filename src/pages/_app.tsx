import {
  defaultTheme,
  Provider as SpectrumProvider,
  SSRProvider,
} from "@adobe/react-spectrum";
import type { AppProps } from "next/app";
import "sanitize.css";
import AppStateProvider from "../components/AppStateProvider";
import Header from "../components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <SpectrumProvider theme={defaultTheme} locale="ja">
        <AppStateProvider>
          <Header />
          <Component {...pageProps} />
        </AppStateProvider>
      </SpectrumProvider>
    </SSRProvider>
  );
}
