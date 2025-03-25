//import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { LoadingBarContainer } from "react-top-loading-bar";

createRoot(document.getElementById("root")!).render(
  <LoadingBarContainer>
    <App />
  </LoadingBarContainer>
);
