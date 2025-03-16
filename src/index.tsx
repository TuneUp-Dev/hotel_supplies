import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HeroUIProvider } from "@heroui/system";

import ReactGA from "react-ga4";

ReactGA.initialize("G-H3TY81GEQT");
ReactGA.send("pageview");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>
);
