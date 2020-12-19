import { defaultTheme, Provider, SSRProvider } from "@adobe/react-spectrum";
import type { AppProps } from "next/app";
import "sanitize.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Provider theme={defaultTheme} locale="ja">
        <Header />
        <Component {...pageProps} />
      </Provider>
    </SSRProvider>
  );
}
