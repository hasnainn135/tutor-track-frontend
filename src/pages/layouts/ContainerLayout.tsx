import React, { FC } from "react";

type ContainerLayoutProps = {
  children: React.ReactNode;
  heading?: string;
  margin?: string;
};

const ContainerLayout: FC<ContainerLayoutProps> = ({
  heading,
  children,
  margin = "5",
}) => {
  return (
    <div className="bg-white border border-[#BABABA] rounded-lg  py-4 flex flex-col gap-3 w-full overflow-x-hidden h-full relative overflow-hidden">
      {heading && <h2 className="font-semibold text-xl px-5">{heading}</h2>}
      <div className={`w-full px-${margin}`}>{children}</div>
    </div>
  );
};

export default ContainerLayout;
