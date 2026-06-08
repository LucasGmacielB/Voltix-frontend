import { ReactNode } from "react";

type CircleProps = {
  icon: ReactNode;
};

export function CircleAuth({ icon }: CircleProps) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/60 bg-green-500/10 shadow-[0_0_25px_rgba(34,197,94,0.35)]">
      <span className="text-3xl text-green-500/75">
        {icon}
      </span>
    </div>
  );
}