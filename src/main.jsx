import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";
import Loading from "./widgets/layouts/loading.jsx";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <Suspense fallback={<Loading />}>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>,
);
