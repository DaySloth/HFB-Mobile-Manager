import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import { Provider } from "next-auth/client";
import ThemeContext from "../util/context/darkTheme";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <Provider session={pageProps.session}>
      <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </Provider>
  );
}
