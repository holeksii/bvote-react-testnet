interface SlotComponentProps {
  info: Record<string, { value: any; type: string }>;
}

const SlotComponent = ({ info }: SlotComponentProps) => {
  function fixUrl(url: string) {
    // if not starts with http and not starts with / then add https
    if (!url.startsWith("http") && !url.startsWith("/")) {
      return "https://" + url;
    }
    return url;
  }

  return (
    <div>
      {Object.entries(info).map(([key, value]) => {
        return (
          <div className="flex justify-between" key={key}>
            <div>{key}</div>
            <div className="text-right font-light w-1/2">
              {
                // if key is status
                value.type === "status" ? (
                  <div className="flex flex-row items-center justify-end gap-2">
                    <div>{value.value.toString()}</div>
                    <div
                      className={`h-2 w-2 rounded-full ${value.value === "Active" ? "animate-pulse bg-green-500" : "bg-red-500"}`}
                    ></div>
                  </div>
                ) : value.type === "address" || value.type === "url" ? (
                  <a
                    className="underline-offset-2 hover:underline text-blue-400"
                    target="_blank"
                    href={
                      value.type === "address"
                        ? "https://testnet.tonscan.org/address/" +
                          value.value.toString()
                        : fixUrl(value.value.toString())
                    }
                  >
                    <div className="truncate">{value.value.toString()}</div>
                  </a>
                ) : (
                  value.value.toString()
                )
              }
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SlotComponent;
