import { useUsers } from "@/hooks/useUsers";
import React from "react";
import ContainerLayout from "../layouts/ContainerLayout";

const MyProfile = () => {
  const { loggedInTutor } = useUsers();

  if (loggedInTutor)
    return (
      <div>
        <ContainerLayout>
          <div className="flex items-center gap-3">
            <div className="w-24 h-24 rounded-xl overflow-hidden">
              <img src={loggedInTutor?.pfp} alt="" />
            </div>
            <div className="">
              <p className="text-lg font-medium">{loggedInTutor?.name}</p>
              <p className="">
                <span className="font-semibold">
                  {loggedInTutor?.level_of_education}
                </span>{" "}
                from{" "}
                <span className="font-semibold text-primary_green">
                  {loggedInTutor.institue}
                </span>
              </p>
              <p className="">
                Experience{" "}
                <span className="font-semibold text-primary_green">
                  {loggedInTutor?.teaching_experience}
                </span>
              </p>
            </div>
          </div>
        </ContainerLayout>
      </div>
    );
};

export default MyProfile;
