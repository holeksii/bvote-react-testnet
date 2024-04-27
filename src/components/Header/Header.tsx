import { TonConnectButton } from "@tonconnect/ui-react";
import "./header.scss";
import Search from "./Search";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header>
      <span>
        <Link to="/"> BVote </Link>
      </span>
      <Search />
      <TonConnectButton />
    </header>
  );
};
