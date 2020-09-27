import { defaultTheme, Provider } from "@adobe/react-spectrum";
import type { AppProps } from "next/app";
import "sanitize.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider theme={defaultTheme}>
      <Component {...pageProps} />
    </Provider>
  );
}
