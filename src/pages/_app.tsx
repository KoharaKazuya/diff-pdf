import { defaultTheme, Provider, SSRProvider } from "@adobe/react-spectrum";
import type { AppProps } from "next/app";
import "sanitize.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Provider theme={defaultTheme} locale="ja">
        <Component {...pageProps} />
      </Provider>
    </SSRProvider>
  );
}
