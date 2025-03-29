import React, { useEffect, useState } from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import { useUsers } from "@/hooks/useUsers";
import { TutorType } from "@/types/usertypes";

const MyTutors = () => {
  const { loggedInStudent, getTutorById } = useUsers();
  const [bookedTutors, setBookedTutors] = useState<TutorType[] | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      if (!loggedInStudent) return;

      try {
        if (loggedInStudent.booked_tutors) {
          const tutors = await Promise.all(
            loggedInStudent.booked_tutors.map(async (tutorId) => {
              return await getTutorById(tutorId.tutor_id);
            })
          );

          // Filter out null values
          const validTutors = tutors.filter(
            (tutor): tutor is TutorType => tutor !== null
          );
          setBookedTutors(validTutors);
        }
      } catch (e) {
        console.error("Error fetching Tutor Data:", e);
      }
    };

    fetchTutors();
  }, [loggedInStudent]);

  return (
    <div>
      <ContainerLayout heading="My Tutors" margin="0">
        <div className="">
          {bookedTutors?.map((tutor) => {
            return (
              <div key={tutor.id} className="even:bg-light_green px-7 py-3">
                <div className="flex items-center justify-start gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                    <img src={tutor.pfp} alt="" className="object-cover h-9" />
                  </div>
                  <p>{tutor.name}</p>
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
