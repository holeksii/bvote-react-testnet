import {
  BorderRadius,
  Locales,
  ReturnStrategy,
  Theme,
  THEME,
  useTonConnectUI,
} from "@tonconnect/ui-react";

import { useEffect, useState } from "react";

const defaultWalletsSelectValue = '["Tonkeeper", "OpenMask"]';

export const Footer = () => {
  const [checkboxes, setCheckboxes] = useState([
    true,
    false,
    false,
    true,
    true,
    true,
  ]);

  const [returnStrategy, setReturnStrategy] = useState("back");
  const [skipRedirect, setSkipRedirect] = useState("ios");
  const [enableAndroidBackHandler, setEnableAndroidBackHandler] =
    useState(true);

  const [_, setOptions] = useTonConnectUI();

  const onLangChange = (lang: string) => {
    setOptions({ language: lang as Locales });
  };

  const onThemeChange = (theme: string) => {
    setOptions({ uiPreferences: { theme: theme as Theme } });
  };

  const onBordersChange = (borders: string) => {
    setOptions({ uiPreferences: { borderRadius: borders as BorderRadius } });
  };

  const onCheckboxChange = (position: number) => {
    setCheckboxes((state) =>
      state.map((item, index) => (index === position ? !item : item)),
    );
  };

  const onEnableAndroidBackHandlerChange = (value: boolean) => {
    setEnableAndroidBackHandler(value);
  };

  const onReturnStrategyInputBlur = () => {
    if (!returnStrategy) {
      setReturnStrategy("back");
      return;
    }

    setOptions({
      actionsConfiguration: {
        returnStrategy: returnStrategy as ReturnStrategy,
      },
    });
  };

  const onSkipRedirectInputBlur = () => {
    if (!skipRedirect) {
      setSkipRedirect("ios");
      return;
    }

    setOptions({
      actionsConfiguration: {
        skipRedirectToWallet: skipRedirect as "ios" | "never" | "always",
      },
    });
  };

  useEffect(() => {
    const actionValues = ["before", "success", "error"];
    const modals = actionValues
      .map((item, index) => (checkboxes[index] ? item : undefined))
      .filter((i) => i) as ("before" | "success" | "error")[];
    const notifications = actionValues
      .map((item, index) => (checkboxes[index + 3] ? item : undefined))
      .filter((i) => i) as ("before" | "success" | "error")[];

    setOptions({ actionsConfiguration: { modals, notifications } });
  }, [checkboxes]);

  useEffect(() => {
    setOptions({ enableAndroidBackHandler });
  }, [enableAndroidBackHandler]);

  return (
    <footer className="w-full p-2 flex flex-row  justify-center">
      <div> BVote {"💙"}</div>
      {/* add github link to right corner and add github logo*/}
      <div className="absolute right-2">
        <a
          href="https://github.com/holeksii/"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};
