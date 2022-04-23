import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Provider } from "./context/context";
import { SpeechProvider } from "@speechly/react-client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider>
    {/* @ts-ignore */}
    <SpeechProvider appId="56431240-dae0-4559-a297-e353ea763287" lang="en-US">
      <App />
    </SpeechProvider>
  </Provider>
);
