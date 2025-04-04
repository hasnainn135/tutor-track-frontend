import React from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import {
    MdOutlineStarPurple500,
    MdOutlineStarHalf,
    MdOutlineStarBorderPurple500,
} from "react-icons/md";
import {IoLocationOutline} from "react-icons/io5";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import useAuthState from "@/states/AuthState";
import {TutorSchema} from "@/types/firebase";
import pfp2 from "@/assets/pfp2.png"
import Image from "next/image";

const MyProfile = () => {
    const {user, userData} = useAuthState();
    const tutorData = userData as TutorSchema;

    const renderStars = (rating: number, size: number) => {
        // Calculate the number of full, half, and empty stars based on the rating
        const fullStars = Math.floor(rating); // Full stars (integer part)
        const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star (check if there is a 0.5 or higher remainder)
        const emptyStars = 5 - fullStars - halfStars; // Empty stars

        // Create an array of star components based on the calculated number of stars
        const stars = [
            ...Array(fullStars).fill(
                <MdOutlineStarPurple500 className={`size-${size}`}/>
            ),
            ...Array(halfStars).fill(
                <MdOutlineStarHalf className={`size-${size}`}/>
            ),
            ...Array(emptyStars).fill(
                <MdOutlineStarBorderPurple500 className={`size-${size}`}/>
            ),
        ];

        return stars;
    };

    if (!tutorData.yearsOfExperience || !tutorData.displayChargesPerHour || !tutorData.instituteName || !tutorData.country) {
        return (
            <ContainerLayout>
                <p>Please enter data about yourself in <Link href="/tutor/settings" className="underline">Settings</Link> to view your profile</p>
            </ContainerLayout>
        )
    }

    if (tutorData)
        return (
            <ContainerLayout>
                <div className="flex gap-12">
                    <div className="space-y-6 w-full ">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                                <Image
                                    src={tutorData?.profilePicture? tutorData?.profilePicture: pfp2}
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
                        <div className="">
                            <p className="font-semibold text-lg">About Me</p>
                            <p className="py-1">{tutorData.about}</p>
                        </div>
                        <div className="max-w-[650px] border rounded-lg overflow-hidden">
                            <div
                                className="grid grid-cols-[160px_1fr] text-lg text-primary_green font-semibold text-center">
                                <div className="p-3">Levels</div>
                                <div className="border-l p-3">Subjects</div>
                            </div>
                            {tutorData.teachingLevels.map((level) => (
                                <div
                                    key={level.level}
                                    className="grid grid-cols-[160px_1fr] border-t "
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
                            <div className="flex flex-col gap-5 py-3">
                                {tutorData.reviews ? (
                                    tutorData.reviews.map((review) => (
                                        <div key={review.id} className="flex gap-3">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 mt-1 rounded-full bg-light_gray overflow-hidden">
                                                <img src=" " alt=""/>
                                            </div>
                                            <div className="">
                                                <div className="flex items-center gap-3">
                                                    <div className="">
                                                        <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg">
                                {review.reviewerName}
                              </span>
                                                            <span className="text-light_gray font-medium text-sm">
                                {new Date(
                                    review.timestamp
                                ).toLocaleDateString()}
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
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
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
                            <IoLocationOutline className="size-5"/> {tutorData.city},{" "}
                            {tutorData.country}
                        </div>
                        <div className="flex flex-col gap-2 w-60 py-2">
                            <Link href={"/tutor/settings"} className="">
                                <Button variant={"outline_green"} className="w-full">
                                    Edit Profile
                                </Button>
                            </Link>
                            {/* <Button variant={"outline_green"}>Send a Message</Button>
              <Button>Book a Free Trial</Button>
              <Button variant={"outline_green"}>Book a Paid Session</Button> */}
                        </div>
                    </div>
                </div>
            </ContainerLayout>
        );
};

export default MyProfile;
