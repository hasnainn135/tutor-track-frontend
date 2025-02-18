import React, { FC } from "react";
import ContainerLayout from "../layouts/ContainerLayout";

const BookSession: FC = () => {
  return (
    <div className="h-full flex-col flex gap-3">
      <ContainerLayout heading="Book a Session">
        Book a Session <br />
        Book a Session <br />
      </ContainerLayout>
    </div>
  );
};

export default BookSession;
