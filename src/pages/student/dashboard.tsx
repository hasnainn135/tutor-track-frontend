import React, { FC } from "react";
import ContainerLayout from "../layouts/ContainerLayout";

const Dashboard: FC = () => {
  return (
    <div className="h-full flex-col flex gap-3">
      <ContainerLayout heading="">
        Student Dashboard <br />
      </ContainerLayout>
      <ContainerLayout heading="Upcoming Sessions">
        Upcoming Sessions <br />
      </ContainerLayout>
      <ContainerLayout heading="Your Tutors">
        Your Tutors <br />
      </ContainerLayout>
    </div>
  );
};

export default Dashboard;
