import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>AfterHours HVAC - When Everyone Else Closes, We Keep The Heat On</title>
        <meta name="description" content="Professional HVAC services in Calgary and surrounding areas. 24/7 emergency repairs, installations, and maintenance for residential and commercial properties." />
      </Helmet>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
