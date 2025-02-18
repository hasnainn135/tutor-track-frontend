import React, { FC } from "react";

type ContainerLayoutProps = {
  children: React.ReactNode;
  heading?: string;
};

const ContainerLayout: FC<ContainerLayoutProps> = ({ heading, children }) => {
  return (
    <div className="bg-white border border-[#BABABA] rounded-lg px-5 py-4 flex flex-col gap-3 w-full h-full">
      {heading && <h2 className="font-semibold text-xl ">{heading}</h2>}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ContainerLayout;
