import {reportUser} from "@/utils/firestore";

const ReportUserUI = ({popupOpen, setPopupOpen, currentUser, reportedUser}:any) => {
    const report_reasons = [
        { id: "hate_speech_or_symbols", title: "Hate speech or symbols" },
        { id: "scam_or_fraud", title: "Scam or fraud" },
        { id: "violence_or_dangerous_activity", title: "Violence or dangerous activity" },
        { id: "bullying_or_harassment", title: "Bullying or harassment" },
        { id: "inappropriate_activity", title: "Inappropriate activity" },
        { id: "spam", title: "Spam" },
        { id: "identity_theft", title: "Identity theft" },
        { id: "other", title: "Other" }
    ];

    return (
        <>
            {popupOpen && (
                <div className="bg-white-400 absolute z-20 flex h-screen w-full flex-col items-center justify-center px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
                    {/* Heading */}
                    <h1 className="mt-10 text-3xl font-bold text-black sm:text-4xl">
                        Issue a report
                    </h1>
                    <h2 className="mb-5 mt-1 text-lg font-semibold text-black sm:text-xl">
                        Select a problem to report
                    </h2>

                    <div className="mb-3 mt-3 flex flex-col justify-center space-y-2">
                        {report_reasons.map(reason => (
                            <button
                                onClick={()=> {
                                    reportUser(reason.id, currentUser, reportedUser);
                                    setPopupOpen(false)
                                }}
                                key={reason.id}
                                className="w-30 whitespace-nowrap rounded-2xl bg-[#CEE7D9] px-6 py-3 font-semibold text-black transition duration-150 hover:bg-[#BEBEBE]"
                            >
                                {reason.title}
                            </button>
                        ))}
                    </div>

                    {/*submit button*/}
                    <div className="mt-6 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <button
                            onClick={()=>setPopupOpen(false)}
                            className="w-48 whitespace-nowrap rounded-2xl bg-primary_red px-6 py-3 font-semibold text-black transition duration-150 hover:bg-red-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReportUserUI;