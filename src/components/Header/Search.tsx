import { useEffect, useState } from "react";

import { useTonClient } from "../../hooks/useTonClient";
import { Voting } from "../../sdk/wrappers/Voting";
import { Address } from "@ton/core";

import { useNavigate } from "react-router-dom";
import { Organization } from "../../sdk/wrappers/Organization";
import Overlay from "../Page/Overlay";

export default () => {
  const tonClient = useTonClient();

  const navigate = useNavigate();

  const [isUpdating, setIsUpdating] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  async function findContract(address: string) {
    if (!tonClient) return;

    let addressParsed = null as Address | null;
    try {
      addressParsed = Address.parse(address);
    } catch (e) {
      setErrorMessage("Invalid address");
      return;
    }

    setIsUpdating(true);

    let found = false;
    // check if voted
    try {
      const voting = Voting.fromAddress(addressParsed);
      await voting.getTimeToLive(tonClient.provider(voting.address));
      setIsUpdating(false);
      found = true;
      return navigate(`/voting?a=${voting.address.toString()}`);
    } catch (e) {}

    // check if organization
    try {
      const org = Organization.fromAddress(addressParsed);
      await org.getOrganizationId(tonClient.provider(org.address));
      setIsUpdating(false);
      setErrorMessage("");
      found = true;
      return navigate(`/organization?a=${org.address.toString()}`);
    } catch (e) {}

    // check if found
    if (!found) {
      setErrorMessage("Contract not found");
    }

    setIsUpdating(false);
  }

  // watch error message, remove if more than 3 seconds
  useEffect(() => {
    if (errorMessage !== "") {
      const timeout = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }
  , [errorMessage]);

  return (
    <div className="relative max-w-96 w-full">
      <div
        className={
          " rounded-md bg-slate-800 pr-6 w-full " +
          (errorMessage !== "" ? "animate-twitch" : "")
        }
      >
        <input
          type="text"
          className={"bg-transparent text-gray-200 p-2 w-full pr-10"}
          placeholder="Enter contract address"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              findContract(e.currentTarget.value);
            } else {
              setErrorMessage("");
            }
          }}
        />
        {isUpdating && (
          <div className="top-3 right-2 w-4 h-4 animate-spin absolute">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="251"
                strokeDashoffset="50"
              ></circle>
            </svg>
          </div>
        )}
      </div>
      {errorMessage !== "" && (
        <div className="absolute bottom-0 h-0 left-0 w-full z-10">
          <div className="bg-slate-800 rounded-xl p-2 mt-2 w-min m-auto whitespace-nowrap">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};
