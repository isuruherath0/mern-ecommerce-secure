import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { CookiesProvider } from "react-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./contexts/UserContext";
import { SearchProvider } from "./contexts/SearchContext";
import { CartProvider } from "./contexts/CartContext";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <React.StrictMode>
      <BrowserRouter>
        <ChakraProvider>
          <UserProvider>
            <SearchProvider>
              <CartProvider>
                <CookiesProvider>
                  <App />
                </CookiesProvider>
              </CartProvider>
            </SearchProvider>
          </UserProvider>
        </ChakraProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
