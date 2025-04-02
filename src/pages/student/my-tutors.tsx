import React, { useEffect, useState } from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import { getMyTutors, getTutorById } from "@/utils/firestore";
import useAuthState from "@/states/AuthState";
import { TutorSchema } from "@/types/firebase";

const MyTutors = () => {
  // const { loggedInStudent, getTutorById } = useUsers();
  const { user, userData } = useAuthState();
  const [bookedTutors, setBookedTutors] = useState<TutorSchema[] | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      if (!user) return;

      try {
        const tutors = await getMyTutors(user?.uid);

        setBookedTutors(tutors);
      } catch (e) {
        console.error("Error fetching Tutor Data:", e);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div>
      <ContainerLayout heading="My Tutors" margin="0">
        <div className="">
          {bookedTutors?.map((tutor) => {
            return (
              <div key={tutor.uid} className="even:bg-light_green px-7 py-3">
                <div className="flex items-center justify-start gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                    <img
                      src={tutor.profilePicture ?? undefined}
                      alt=""
                      className="object-cover h-9"
                    />
                  </div>
                  <p>{tutor.fullName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ContainerLayout>
    </div>
  );
};

export default MyTutors;
