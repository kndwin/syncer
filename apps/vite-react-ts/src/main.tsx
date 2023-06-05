import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";

import { Router } from "~/routes";
import { Providers } from "./providers";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <Router />
    </Providers>
  </React.StrictMode>
);
