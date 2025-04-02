import React, { FC, useEffect, useState } from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/ui/date-picker";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useUsers } from "@/hooks/useUsers";
import { TutorType } from "@/types/usertypes";

const BookSession: FC = () => {
  const { tutors, loading, error } = useUsers();

  const [date, setDate] = useState<Date | undefined>();
  const [selectedTutor, setSelectedTutor] = useState<TutorType | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    sessionWith: "",
    sessionLimit: "",
    timeSlot: "",
    notes: "",
    date: undefined,
  });

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //Update date in Form Data
  useEffect(() => {
    handleChange("date", date);
  }, [date]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setFormError("Please Select a Session Date");
      return;
    } else setFormError(null);
    setIsSubmitting(true);
    //
    console.log("Form Data:", formData);
    setIsSubmitting(false);
  };

  return (
    <ContainerLayout heading="Book a Session">
      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-3 grid-cols-1 gap-6"
      >
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Session With */}
          <div className="flex flex-col gap-2">
            <label htmlFor="session-with" className="font-medium text-sm">
              Session With
            </label>
            <Select
              required
              onValueChange={(value) => {
                handleChange("sessionWith", value);
                setSelectedTutor(
                  tutors.find((tutor) => tutor.id === value) || null
                );
              }}
            >
              <SelectTrigger
                id="session-with"
                className="w-full h-14 font-medium "
              >
                <SelectValue placeholder="Select Tutor" />
              </SelectTrigger>
              <SelectContent>
                {tutors.map((tutor) => {
                  return (
                    <SelectItem key={tutor.id} value={tutor.id}>
                      <div className="flex items-center justify-start gap-2">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                          <img
                            src={tutor.pfp}
                            alt=""
                            className="object-cover h-9"
                          />
                        </div>
                        <p>{tutor.name}</p>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {/* Session Limit */}
          <div className="flex flex-col gap-2">
            <label htmlFor="session-limit" className="font-medium text-sm">
              Session Limit
            </label>
            <Select
              required
              onValueChange={(value) => {
                handleChange("sessionLimit", value);
              }}
            >
              <SelectTrigger id="session-limit" className="w-full font-medium ">
                <SelectValue placeholder="Select Session Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 minutes">30 minutes</SelectItem>
                <SelectItem value="1 hour">1 hour</SelectItem>
                <SelectItem value="1 hour 30 minutes">
                  1 hour 30 minutes
                </SelectItem>
                <SelectItem value="2 hours ">2 hours</SelectItem>
                <SelectItem value="2 hours 30 minutes">
                  2 hours 30 minutes
                </SelectItem>
                <SelectItem value="3 hours">3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Time Slot */}
          {selectedTutor?.timeSlots && (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">Pick Time Slot</p>
              <div className="flex gap-2 flex-wrap">
                {selectedTutor?.timeSlots.map((slot) => (
                  <div key={slot} className="relative">
                    <input
                      onChange={(e) =>
                        handleChange("timeSlot", e.currentTarget.value)
                      }
                      required
                      type="radio"
                      name="slot"
                      id={slot}
                      value={slot}
                      className="peer absolute opacity-0"
                    />
                    <label
                      htmlFor={slot}
                      className="text-center block w-32 cursor-pointer border border-primary_green rounded-md px-3 py-1.5 text-primary_green font-medium peer-checked:bg-primary_green peer-checked:text-white"
                    >
                      {slot}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Date */}
          <div className="lg:hidden flex flex-col gap-2">
            <label htmlFor="date" className="font-medium text-sm">
              Date
            </label>
            <DatePicker
              className="w-full border-neutral-200"
              date={date}
              setDate={setDate}
              disablePrev={true}
            />
          </div>
          {/* Additional Notes */}
          <div className="flex flex-col gap-2">
            <label htmlFor="additional-notes" className="font-medium text-sm">
              Additional Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.currentTarget.value)}
              placeholder="Type additional notes here."
              id="notes"
            />
          </div>

          {formError && (
            <p className="text-red text-sm font-semibold  text-center">
              {formError}
            </p>
          )}
          <Button
            className="w-full flex items-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="6" />
                <p>Booking Session</p>
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
        <div className="">
          {/* Date */}
          <div className="lg:flex hidden flex-col gap-2">
            <label htmlFor="date" className="font-medium text-sm">
              Date
            </label>
            <DatePicker
              className="w-full border-neutral-200"
              date={date}
              setDate={setDate}
              disablePrev={true}
            />
          </div>
        </div>
      </form>
    </ContainerLayout>
  );
};

export default BookSession;
