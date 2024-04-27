import { ReactNode } from "react";

interface SlotComponentProps {
  name?: string | null;
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

const SlotComponent = ({
  name = null,
  className = "",
  children,
  hover,
}: SlotComponentProps) => {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 px-6 py-4 ${
        hover ? "hover:bg-slate-800 duration-200 ease-in-out" : ""
      } ${className ?? ""}
      }`}
    >
      {name && (
        <div className="flex w-full mb-4 items-center justify-center border-b border-b-slate-800 text-xl">
          {name}
        </div>
      )}
      <div className="">{children}</div>
    </div>
  );
};

export default SlotComponent;
