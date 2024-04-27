import { Address, address } from "@ton/core";
import { TonClient } from "@ton/ton";
import { useTonClient } from "../../hooks/useTonClient";

export function websiteValidator(value: string) {
  let validators = [
    (value: string) => {
      // url validation
      const pattern = new RegExp(
        "\\b(?:(https?|ftp|file)://|www\\.)?[-A-Z0-9+&#/%?=~_|$!:,.;]*[A-Z0-9+&@#/%=~_|$]\\.[-A-Z0-9+&@#/%?=~_|$!:,.;]*[A-Z0-9+&@#/%=~_|$]",
        "i",
      );
      if (!pattern.test(value)) return "Invalid Url";
      return null;
    },
    (value: string) => {
      // not http or https
      if (value.startsWith("http://") || value.startsWith("https://"))
        return "Please do not include http or https";
    },
    (value: string) => {
      // no whitespace
      if (value.includes(" ")) return "No whitespace allowed";
    },
  ];

  for (let i = 0; i < validators.length; i++) {
    let result = validators[i](value);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

export function addressValidator(value: string) {
  try {
   Address.parse(value);

    return null;
  } catch (e) {
    return "Invalid Address";
  }
}
