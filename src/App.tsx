import "./App.scss";
import "./index.css";
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import Voting from "./pages/Voting";
import Index from "./pages/Index";
import Organization from "./pages/Organization";
import ErrorPage from "./pages/Error";

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://raw.githubusercontent.com/holeksii/bvote-react/master/public/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={{
        
        includeWallets: [
          {
            appName: "safepalwallet",
            name: "SafePal",
            imageUrl:
              "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
            aboutUrl: "https://www.safepal.com/download",
            jsBridgeKey: "safepalwallet",
            platforms: ["ios", "android", "chrome", "firefox"],
          },
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl:
              "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"],
          },
        ],
      }}
    >
      <div className="app bg-slate-950 text-gray-200">
        <BrowserRouter basename="/">
          <Header />
          <div className="content container">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="voting" element={<Voting />} />
              <Route path="organization" element={<Organization />} />
              <Route path="error" element={<ErrorPage />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
