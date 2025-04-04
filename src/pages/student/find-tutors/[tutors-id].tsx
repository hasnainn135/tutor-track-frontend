import React, { use, useEffect } from "react";
import {
  MdOutlineStarPurple500,
  MdOutlineStarHalf,
  MdOutlineStarBorderPurple500,
} from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuthState from "@/states/AuthState";
import { Reviews, TutorSchema } from "@/types/firebase";
import pfp2 from "@/assets/pfp2.png";
import Image from "next/image";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import { useParams } from "next/navigation";
import { addReview, getAllReviews, getTutorById } from "@/utils/firestore";
import { fi } from "date-fns/locale";
import { set } from "date-fns";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Timestamp } from "firebase/firestore";

const FindTutorProfile = () => {
  const [tutorData, setTutorData] = React.useState<TutorSchema | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [reviewContent, setReviewContent] = React.useState<string>("");
  const [rating, setRating] = React.useState<number>(0);
  const [tutorReviews, setTutorReviews] = React.useState<Reviews[]>([]);

  const params = useParams();
  const tutorId = params["tutors-id"] as string;
  const { userData } = useAuthState();

  useEffect(() => {
    try {
      const fetchTutorData = async () => {
        if (!tutorId) return;
        setLoading(true);
        const tutor = await getTutorById(tutorId);
        setTutorData(tutor);
        setLoading(false);
        const reviews = await getAllReviews(tutorId);
        setTutorReviews(reviews);
      };
      fetchTutorData();
    } catch (error) {
      console.error("Error fetching tutor data:", error);
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

  const renderStars = (rating: number, size: number) => {
    // Calculate the number of full, half, and empty stars based on the rating
    const fullStars = Math.floor(rating); // Full stars (integer part)
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star (check if there is a 0.5 or higher remainder)
    const emptyStars = 5 - fullStars - halfStars; // Empty stars

    // Create an array of star components based on the calculated number of stars
    const stars = [
      ...Array(fullStars).fill(
        <MdOutlineStarPurple500 className={`size-${size}`} />
      ),
      ...Array(halfStars).fill(
        <MdOutlineStarHalf className={`size-${size}`} />
      ),
      ...Array(emptyStars).fill(
        <MdOutlineStarBorderPurple500 className={`size-${size}`} />
      ),
    ];

    return stars;
  };

  if (loading) return <LoadingSpinner />;

  if (tutorData && userData)
    return (
      <ContainerLayout>
        <div className="flex gap-12">
          <div className="space-y-6 w-full ">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                <Image
                  src={
                    tutorData?.profilePicture ? tutorData?.profilePicture : pfp2
                  }
                  alt=""
                  className="object-cover h-full"
                />
              </div>
              <div className="">
                <p className="text-lg font-medium">{tutorData?.displayName}</p>
                <p className="">
                  <span className="font-semibold">
                    {tutorData?.educationLevel}
                  </span>{" "}
                  from{" "}
                  <span className="font-semibold text-primary_green">
                    {tutorData.instituteName}
                  </span>
                </p>
                <p className="">
                  Experience{" "}
                  <span className="font-semibold text-primary_green">
                    {tutorData?.yearsOfExperience}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex sm:hidden flex-col  gap-2 flex-shrink-0">
              <div className="text-3xl font-semibold ">
                <span>£{tutorData.displayChargesPerHour}</span>
                <span className="font-bold text-light_gray"> /hour</span>
              </div>

              {tutorData?.overallRating && (
                <div className=" font-medium text-gold flex items-center gap-2">
                  {tutorData?.overallRating}
                  rating
                  <div className="flex items-center gap-1">
                    {renderStars(tutorData?.overallRating, 4)}
                  </div>
                </div>
              )}
              {tutorData.totalStudentsTaught && (
                <div className="font-medium ">
                  <span className="text-primary_green font-bold">
                    {tutorData.totalStudentsTaught < 10
                      ? tutorData.totalStudentsTaught
                      : Math.floor(tutorData.totalStudentsTaught / 10) * 10 +
                        "+"}
                  </span>{" "}
                  Students Taught
                </div>
              )}
              <div className="flex items-center gap-1 text-sm">
                <IoLocationOutline className="size-4" /> {tutorData.city},{" "}
                {tutorData.country}
              </div>
              <div className="flex flex-col gap-2 w-60 py-2">
                <Button variant={"outline_green"}>Send a Message</Button>
                <Link href={`/student/book-a-session`} className="w-full">
                  <Button className="w-full">Book a Free Trial</Button>
                </Link>
                <Link href={`/student/book-a-session`} className="w-full">
                  <Button className="w-full" variant={"outline_green"}>
                    Book a Paid Session
                  </Button>
                </Link>
              </div>
            </div>
            <div className="">
              <p className="font-semibold text-lg">About Me</p>
              <p className="py-1">{tutorData.about}</p>
            </div>
            <div className="max-w-[650px] border rounded-lg overflow-hidden">
              <div className="grid sm:grid-cols-[160px_1fr] grid-cols-2 smtext-lg text-primary_green font-semibold text-center">
                <div className="p-3">Levels</div>
                <div className="border-l p-3">Subjects</div>
              </div>
              {tutorData.teachingLevels.map((level) => (
                <div
                  key={level.level}
                  className="grid sm:grid-cols-[160px_1fr] grid-cols-2 border-t "
                >
                  <div className="font-semibold   p-3 flex items-center text-justify">
                    {level.level}
                  </div>
                  <div className="p-3 flex items-center gap-2 flex-wrap border-l">
                    {level.subjects.map((sub) => (
                      <div
                        key={sub}
                        className="bg-primary_green py-1.5 px-3 text-white rounded-lg"
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="">
              <p className="font-semibold text-lg">Reviews</p>
              <form
                className="my-3 flex md:flex-row flex-col gap-3 items-center justify-between "
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await addReview(
                      userData.uid,
                      userData.displayName,
                      userData.profilePicture,
                      tutorData.uid,
                      rating,
                      reviewContent
                    );
                  } catch (e) {
                    console.log(e);
                  } finally {
                    setReviewContent("");
                    setRating(0);
                  }
                  // GET LATEST REVIEWS
                  try {
                    const reviews = await getAllReviews(tutorId);
                    setTutorReviews(reviews);
                  } catch (error) {
                    console.log(e);
                  }
                }}
              >
                <div className="w-full flex md:flex-row flex-col gap-3 items-center justify-between">
                  <textarea
                    required
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.currentTarget.value)}
                    placeholder="Add a Review"
                    rows={1}
                    className="resize-none border border-light_gray p-2 w-full rounded-md"
                  ></textarea>
                  <input
                    type="number"
                    required
                    placeholder="Rating"
                    value={rating}
                    onChange={(e) =>
                      setRating(parseFloat(e.currentTarget.value))
                    }
                    step={0.5}
                    max={5}
                    min={0.5}
                    className="md:w-fit w-full border border-light_gray p-2  rounded-md"
                  />
                </div>

                <Button
                  variant={"outline_green"}
                  type="submit"
                  className="w-full md:w-fit"
                >
                  Add {/* <IoMdAdd className="size-5" /> */}
                </Button>
              </form>
              <div className="flex flex-col gap-5 py-3">
                {tutorReviews.length > 0 ? (
                  tutorReviews.map((review) => (
                    <div key={review.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 mt-1 rounded-full bg-light_gray overflow-hidden">
                        <Image src={review.reviewerPhotoURL ?? pfp2} alt="" />
                      </div>
                      <div className="">
                        <div className="flex items-center gap-3">
                          <div className="">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg">
                                {review.reviewerName}
                              </span>
                              <span className="text-light_gray font-medium text-sm">
                                {(review.timestamp as Timestamp)
                                  .toDate()
                                  .toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gold font-bold">
                              {review.rating} {renderStars(review.rating, 5)}
                            </div>
                          </div>
                        </div>
                        <div className="">{review.content}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-light_gray ">No reviews</div>
                )}
              </div>
            </div>
          </div>
          <div className="sm:flex hidden flex-col items-end gap-2 flex-shrink-0">
            <div className="text-5xl font-semibold ">
              <span>£{tutorData.displayChargesPerHour}</span>
              <span className="font-bold text-light_gray"> /hour</span>
            </div>

            {tutorData?.overallRating && (
              <div className="text-xl font-medium text-gold flex items-center gap-2">
                {tutorData?.overallRating}
                rating
                <div className="flex items-center gap-1">
                  {renderStars(tutorData?.overallRating, 6)}
                </div>
              </div>
            )}
            {tutorData.totalStudentsTaught && (
              <div className="font-medium text-xl">
                <span className="text-primary_green font-bold">
                  {tutorData.totalStudentsTaught < 10
                    ? tutorData.totalStudentsTaught
                    : Math.floor(tutorData.totalStudentsTaught / 10) * 10 + "+"}
                </span>{" "}
                Students Taught
              </div>
            )}
            <div className="flex items-center gap-1">
              <IoLocationOutline className="size-5" /> {tutorData.city},{" "}
              {tutorData.country}
            </div>
            <div className="flex flex-col gap-2 w-60 py-2">
              <Button variant={"outline_green"}>Send a Message</Button>
              <Link href={`/student/book-a-session`} className="w-full">
                <Button className="w-full">Book a Free Trial</Button>
              </Link>
              <Link href={`/student/book-a-session`} className="w-full">
                <Button className="w-full" variant={"outline_green"}>
                  Book a Paid Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </ContainerLayout>
    );
};

export default FindTutorProfile;
