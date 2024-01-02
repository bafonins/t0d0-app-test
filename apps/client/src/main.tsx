import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createGqlClient } from "@/shared/api/graphql/client";
import { GqlProviderComponent } from "@/shared/api/graphql/types";
import { AuthProvider } from "@/features/auth/providers/AuthProvider.tsx";
import { RootPage } from "@/pages";

import "./index.css";

const client = createGqlClient(
  import.meta.env.VITE_SERVER_URI,
  import.meta.env.VITE_SERVER_WS_URI
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GqlProviderComponent client={client}>
      <AuthProvider>
        <BrowserRouter>
          <RootPage />
        </BrowserRouter>
      </AuthProvider>
    </GqlProviderComponent>
  </React.StrictMode>
);
