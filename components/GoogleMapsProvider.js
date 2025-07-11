"use client"; // Mark this as a Client Component

import { APIProvider } from "@vis.gl/react-google-maps";
import React from "react";

const GoogleMapsProvider = ({ children }) => {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY || ""}>
      {children}
    </APIProvider>
  );
};

export default GoogleMapsProvider;
