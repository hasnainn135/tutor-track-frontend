// import { useContext, useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import NoChats from "@/assets/images/inbox/NoChats.png";
// import { db } from "@/firebase/firebase";

// // import { AuthContext } from "@/context/AuthContext";
// import {
//   collection,
//   doc,
//   getDocs,
//   onSnapshot,
//   query,
//   serverTimestamp,
//   where,
// } from "firebase/firestore";
// import LoadingSpinner from "@/components/ui/loading-spinner";
// import { FaCheck, FaRegClock } from "react-icons/fa";
// import { IoMdClose, IoMdSend } from "react-icons/io";
// import { HiOutlineDotsVertical } from "react-icons/hi";
// import { MdDeleteForever, MdReportProblem } from "react-icons/md";
// import { ImBlocked } from "react-icons/im";
// // import sendMessageTest from "@/utils/firebase/inbox/sendMessageTest";
// // import deleteChat from "@/utils/firebase/inbox/deleteChat";
// // import timestampToTime from "@/utils/timestampToTime";
// // import updateMessagesSeenValue from "@/utils/firebase/inbox/updateMessageSeenValue";
// import Link from "next/link";
// // import fetchUserDetails from "@/utils/firebase/user/fetchUserDetails";
// // import blockUser from "@/utils/firebase/user/blockUser";
// // import unblockUser from "@/utils/firebase/user/unblockUser";
// import { CgUnblock } from "react-icons/cg";
// // import ReportUserUI from "@/components/ReportUserUI";
// import useAuthState from "@/states/AuthState";

// export default function Chat() {
//   // Auth Context
//   // const {currentUser} = useContext(AuthContext);
//   const { userData } = useAuthState();

//   // Chats States
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [displayedChats, setDisplayedChats] = useState([]);
//   const [fetchedChats, setFetchedChats] = useState([]);

//   // Search Users States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [usersSearchResult, setUsersSearchResult] = useState([]);

//   // Specific Chat Messages States
//   const [openedChatMessages, setOpenedChatMessages] = useState([]);
//   const [newFetchedMessages, setNewFetchedMessages] = useState([]);
//   const [messageSentPending, setMessageSentPending] = useState(false);

//   // Loader States
//   const [chatsAreLoading, setChatsAreLoading] = useState(false);
//   const [messagesAreLoading, setMessagesAreLoading] = useState(false);

//   // Overlay States
//   const [openChatActions, setOpenChatActions] = useState({
//     id: null,
//     value: false,
//   });
//   const [reportModalOpen, setReportModalOpen] = useState(false);

//   // Refs
//   const messageInputFieldRef = useRef<HTMLInputElement>(null);
//   const messageTextRef = useRef<HTMLDivElement>(null);

//   //FETCH PREVIOUS CHATS
//   useEffect(() => {
//     fetchChatsFromDatabase();

//     // if (!userData) {
//     //     const getUserDetails = async () => {
//     //         let user_data = await fetchUserDetails(currentUser.uid)
//     //         setUserData(user_data)
//     //     }
//     //     getUserDetails()
//     // }
//   }, []);

//   //FETCHING MESSAGES FOR THE SELECTED CHAT
//   useEffect(() => {
//     fetchMessagesOfChat();
//   }, [selectedChat]);

//   useEffect(() => {
//     messageTextRef.current?.scrollIntoView({ behavior: "auto" });
//     if (selectedChat && newFetchedMessages) {
//       // updateMessagesSeenValue(
//       //   newFetchedMessages,
//       //   selectedChat,
//       //   currentUser,
//       //   newFetchedMessages
//       // );
//     }
//   }, [newFetchedMessages]);

//   //SEARCHING USERS
//   useEffect(() => {
//     let isMounted = true; // Variable to track component mount state

//     const searchUsers = async () => {
//       try {
//         const q = query(
//           collection(db, "users"),
//           where("displayName", ">=", searchQuery),
//           where("displayName", "<=", searchQuery + "\uf8ff")
//         );
//         const querySnapshot = await getDocs(q);

//         if (isMounted) {
//           // Check if component is still mounted before updating state
//           const users = querySnapshot.docs.map((doc) => doc.data());

//           setUsersSearchResult(users);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (searchQuery.trim() === "") {
//       setUsersSearchResult([]);
//     } else {
//       searchUsers();
//     }

//     // Cleanup function to cancel pending tasks
//     return () => {
//       isMounted = false; // Mark component as unmounted
//     };
//   }, [searchQuery]);

//   const fetchMessagesOfChat = async () => {
//     setMessagesAreLoading(true);

//     if (selectedChat) {
//       console.log("i just freaking ran bruh");
//       // if a chat was selected previously, then remove its messages from this state
//       setOpenedChatMessages([]);

//       // real-time updates on a selected chat's messages
//       // const unsub = onSnapshot(
//       //   doc(db, "userChats", currentUser.uid, "chats", selectedChat.combinedId),
//       //   (doc) => {
//       //     if (doc.exists()) {
//       //       let newMessagesArr = doc.data().messages.map((message) => ({
//       //         ...message,
//       //         time: timestampToTime(message.date),
//       //       }));
//       //       setOpenedChatMessages([...newMessagesArr]);
//       //       setNewFetchedMessages(newMessagesArr);
//       //       setMessagesAreLoading(false);
//       //     } else {
//       //       setMessagesAreLoading(false);
//       //     }
//       //   }
//       // );

//       // return () => unsub();
//     }
//   };

//   const fetchChatsFromDatabase = async () => {
//     setChatsAreLoading(true);

//     if (userData && userData.uid) {
//       // let counter = 0
//       const subCollectionRef = collection(
//         db,
//         "userChats",
//         userData.uid,
//         "chats"
//       );
//       const unsub = onSnapshot(subCollectionRef, (querySnapshot) => {
//         const documents = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         // console.log("Received real-time update:", documents);
//         // setFetchedChats([...documents, ...fetchedChats]);
//         // setDisplayedChats([...documents, ...fetchedChats]);
//         setChatsAreLoading(false);
//       });

//       return () => unsub();
//     }
//   };

//   // const addNewChat = async (user) => {
//   //   const combinedId =
//   //     currentUser.uid > user.uid
//   //       ? currentUser.uid + user.uid
//   //       : user.uid + currentUser.uid;

//   //   const chatObject = {
//   //     combinedId: combinedId,
//   //     timestamp: serverTimestamp(),
//   //     lastMessage: "",
//   //     userInfo: {
//   //       displayName: user.displayName,
//   //       photoURL: user.photoURL,
//   //       uid: user.uid,
//   //     },
//   //     messages: [],
//   //   };

//   //   setDisplayedChats([chatObject, ...fetchedChats]);
//   //   setSelectedChat(chatObject);
//   //   setUsersSearchResult([]);
//   //   setSearchQuery("");
//   // };

//   const sendMessageHandler = async (e) => {
//     e.preventDefault();
//     setMessageSentPending(true);

//     let messageText = e.target.message_input.value;
//     if (messageInputFieldRef.current) messageInputFieldRef.current.value = "";
//     if (!messageText.trim()) {
//       return;
//     }

//     // const combinedId = selectedChat.combinedId;
//     // const user = selectedChat.userInfo;

//     // await sendMessageTest(combinedId, messageText, user, currentUser);
//     setMessageSentPending(false);
//   };

//   // console.log("user data = ", userData)

//   // if (!userData) {
//   //     return (
//   //         <div className='h-screen w-full'>
//   //             <LoadingSpinner/>
//   //         </div>
//   //     )
//   // }

//   return (
//     <>
//       <div className="flex h-screen w-full md:flex-row">
//         {/* INBOX SIDEBAR */}
//         <div
//           className={`${
//             selectedChat ? "hidden md:flex" : "flex"
//           } w-full md:w-[35rem] flex-col overflow-auto bg-dark_green px-6 py-8`}
//         >
//           {/* NOTIFICATION BAR AND NEW CHAT BUTTON*/}
//           <div className="flex flex-row justify-between">
//             <div className="flex flex-row items-center space-x-2">
//               <h1 className="text-2xl font-[600] text-lime-400">Inbox</h1>
//             </div>

//             <button className="rounded-2xl bg-lime-400 px-6 py-1.5 font-[600] text-dark_green transition-all duration-300 hover:bg-lime-500">
//               Online
//             </button>
//           </div>

//           {/** SEARCH BAR**/}
//           <div className="relative my-4 rounded-xl bg-white">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="h-[3rem] w-full rounded-xl px-2 outline-none focus:outline-none"
//               placeholder="Search a user here to begin chat"
//             />

//             {usersSearchResult && (
//               <div className="rounded-xl bg-white">
//                 {usersSearchResult.map((user) => (
//                   <div
//                     // key={user.uid}
//                     // onClick={() => addNewChat(user)}
//                     className="flex flex-row items-center space-x-2 rounded-xl bg-light_green px-2 py-2 text-lg font-[600] transition-all duration-200 hover:bg-light_green/30"
//                   >
//                     <img
//                       src={user.photoURL}
//                       alt={"photo"}
//                       className="h-10 w-10 rounded-full"
//                     />
//                     <p>{user.displayName}</p>
//                     <p className="text-sm text-gray-600">@{user.username}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* LOADING SPINNER WHILE FETCHING PREVIOUS CHATS */}
//           {chatsAreLoading && (
//             <div className="my-2 flex h-full w-full items-center justify-center overflow-auto px-4">
//               <LoadingSpinner />
//             </div>
//           )}

//           {/* FETCHED PREVIOUS CHATS */}
//           {!chatsAreLoading && displayedChats && (
//             <div className="w-full text-white ">
//               {displayedChats.map((chat) => (
//                 <div key={chat.combinedId} className="relative group">
//                   {/* CHAT CONTAINER (PHOTO, NAME, LAST MESSAGE */}
//                   <div
//                     onClick={() => setSelectedChat(chat)}
//                     className={`hover:bg-[#0b241a] ${
//                       selectedChat?.combinedId === chat.combinedId
//                         ? "bg-[#316d55]"
//                         : "bg-transparent"
//                     } flex flex-row space-x-2 items-center rounded-lg px-2 py-2 transition-all duration-150`}
//                   >
//                     <img
//                       src={chat.userInfo.photoURL}
//                       alt={"photo"}
//                       className="h-14 w-14 rounded-full hover:opacity-80"
//                     />

//                     <div>
//                       <p className="text-lg font-[500]">
//                         {chat.userInfo.displayName}
//                       </p>
//                       <p className="max-w-60 truncate text-sm font-[500] text-gray-400">
//                         {chat.lastMessage}
//                       </p>
//                     </div>
//                   </div>

//                   {/* THREE DOT BUTTON FOR REPORT, BLOCK, DELETE */}
//                   <div
//                     key={chat.combinedId}
//                     onClick={() =>
//                       setOpenChatActions({
//                         id: chat.combinedId,
//                         value: !openChatActions.value,
//                       })
//                     }
//                     className="absolute z-10 top-1/2 right-4 transform -translate-y-1/2 md:hidden h-8 w-8 items-center justify-center rounded-full bg-white/70 transition-all duration-200 hover:bg-gray-200 md:group-hover:flex"
//                   >
//                     <div
//                       className={`${
//                         openChatActions?.id === chat.combinedId &&
//                         openChatActions.value
//                           ? "hidden"
//                           : "block"
//                       } h-full w-full flex items-center justify-center `}
//                     >
//                       <HiOutlineDotsVertical
//                         className={`h-4 w-6 text-gray-900`}
//                       />
//                     </div>

//                     <div
//                       className={` ${
//                         openChatActions?.id === chat.combinedId &&
//                         openChatActions.value
//                           ? "block"
//                           : "hidden"
//                       } h-full w-full flex items-center justify-center `}
//                     >
//                       <IoMdClose className={`h-4 w-6 text-gray-900 `} />
//                     </div>

//                     {/* OVERLAY FOR REPORT, BLOCK, DELETE */}
//                     <div
//                       className={`${
//                         openChatActions?.id === chat.combinedId &&
//                         openChatActions.value
//                           ? "absolute block"
//                           : "hidden"
//                       } text-lg md:text-base right-0 top-10 z-10 flex w-auto flex-col rounded-lg bg-white px-2 py-2 text-start font-[500] text-black`}
//                     >
//                       <button
//                         onClick={async () => {
//                           await deleteChat(chat, currentUser);
//                           setSelectedChat(null);
//                         }}
//                         className="flex w-60 flex-row items-center space-x-2 py-1 text-start hover:bg-gray-100"
//                       >
//                         <MdDeleteForever className="h-6 w-6 text-gray-700" />
//                         <p>Delete Chat</p>
//                       </button>
//                       <button
//                         onClick={() => blockUser(currentUser, chat.userInfo)}
//                         className={` ${
//                           chat.blockedBy === currentUser.uid ? "hidden" : "flex"
//                         } w-60 flex-row items-center space-x-2 py-1 text-start hover:bg-gray-100`}
//                       >
//                         <ImBlocked className="h-4 w-6 text-gray-700" />
//                         <p>Block User</p>
//                       </button>

//                       <button
//                         onClick={() => unblockUser(currentUser, chat.userInfo)}
//                         className={` ${
//                           chat.blockedBy === currentUser.uid ? "flex" : "hidden"
//                         } w-60 flex-row items-center space-x-2 py-1 text-start hover:bg-gray-100`}
//                       >
//                         <CgUnblock className="h-5 w-6 text-gray-700" />
//                         <p>Unblock User</p>
//                       </button>

//                       <button
//                         onClick={() => {
//                           setSelectedChat(chat);
//                           setReportModalOpen(true);
//                         }}
//                         className="flex w-60 flex-row items-center space-x-2 py-1 text-start hover:bg-gray-100"
//                       >
//                         <MdReportProblem className="h-5 w-6 text-gray-700" />
//                         <p>Report User</p>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* REPORT USER POPUP/MODAL UI */}
//         {selectedChat && (
//           <ReportUserUI
//             popupOpen={reportModalOpen}
//             setPopupOpen={setReportModalOpen}
//             currentUser={currentUser}
//             reportedUser={selectedChat.userInfo}
//           />
//         )}

//         {/* NO CHATS SELECTED PLACEHOLDER LOGO - WHEN NO CHAT IS SELECTED */}
//         <div
//           className={` ${
//             selectedChat ? "hidden" : "hidden md:flex"
//           } w-full flex-col items-center justify-center `}
//         >
//           <Image
//             src={NoChats}
//             alt={"noChatLogo"}
//             className="h-[20rem] w-auto mb-12"
//           />
//           <p className="text-2xl font-[600]">No Chats Selected</p>
//           <p className="text-base mt-2 text-black/60">
//             Search for a user in the searchbar to begin chatting
//           </p>
//         </div>

//         {/* SELECTED CHAT'S CHATBOX */}
//         {selectedChat && (
//           <div className="flex w-full flex-col justify-between">
//             {/** TOP USER INFORMATION DIV**/}
//             <div className="flex flex-row items-center justify-between bg-light_green px-4 py-4">
//               <Link
//                 href={`/user/${selectedChat?.userInfo.uid}`}
//                 className="flex flex-row space-x-4 hover:bg-white transition-all duration-150 pr-8 py-1 pl-2 rounded-lg"
//               >
//                 <img
//                   src={selectedChat?.userInfo.photoURL}
//                   alt={"user photo"}
//                   className="h-12 w-12 rounded-full"
//                 />
//                 <div className="flex flex-col">
//                   <p className="text-lg font-[500]">
//                     {selectedChat?.userInfo.displayName}
//                   </p>
//                   <p className="text-sm">Active Now</p>
//                 </div>
//               </Link>

//               <div className="text-2xl" onClick={() => setSelectedChat(null)}>
//                 <IoMdClose className="h-8 w-8 transition-all duration-150 hover:text-primary_red" />
//               </div>
//             </div>

//             {/* CHAT MESSAGES DIV */}

//             {messagesAreLoading && (
//               <div className="my-2 flex h-full w-full items-center justify-center overflow-auto px-4">
//                 <LoadingSpinner />
//               </div>
//             )}

//             {!messagesAreLoading && (
//               <div className="my-2 h-full w-full overflow-auto px-4">
//                 {openedChatMessages && (
//                   <>
//                     {openedChatMessages.map((message, idx) => (
//                       <div
//                         key={message.id}
//                         className={`${
//                           message.senderId === currentUser.uid
//                             ? "justify-end"
//                             : "justify-start"
//                         } flex w-full`}
//                       >
//                         <div
//                           ref={messageTextRef}
//                           className={`${
//                             message.senderId === currentUser.uid
//                               ? "items-end bg-dark_green text-white"
//                               : "items-start bg-light_green text-black"
//                           } my-1 flex max-w-[50rem]  flex-col rounded-3xl px-4 py-2`}
//                         >
//                           <p className="text-lg">{message.text}</p>
//                           <div
//                             className={`flex flex-row items-center space-x-1`}
//                           >
//                             <p className="text-xs text-gray-400">
//                               {message.time}
//                             </p>
//                             {idx === openedChatMessages.length - 1 && (
//                               <FaRegClock
//                                 className={` ${
//                                   messageSentPending ? "block" : "hidden"
//                                 } ${
//                                   message.senderId !== currentUser.uid
//                                     ? "hidden"
//                                     : "block"
//                                 } h-3 w-auto px-1`}
//                               />
//                             )}
//                             <FaCheck
//                               className={`
//                                                             ${
//                                                               messageSentPending
//                                                                 ? "hidden"
//                                                                 : "block"
//                                                             }
//                                                             ${
//                                                               message.senderId !==
//                                                               currentUser.uid
//                                                                 ? "hidden"
//                                                                 : "block"
//                                                             }
//                                                             ${
//                                                               message.seen
//                                                                 ? "text-blue-500"
//                                                                 : "text-gray-400"
//                                                             }
//                                                             h-3 w-auto px-1`}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </div>
//             )}

//             {selectedChat.isBlocked && (
//               <div className="flex w-full items-center justify-center space-x-4 bg-light_green px-4 py-6 flex-row">
//                 <ImBlocked className="h-6 w-6 text-primary_red" />
//                 <p className="text-lg">
//                   You can not send messages in this conversation
//                 </p>
//                 <button className="relative text-lg underline group">
//                   <p>Learn more</p>
//                   <div className="absolute -top-28 -left-60 bg-light_green border-2 border-lime-400 rounded-xl lg:w-[20rem] px-4 py-2 hidden group-hover:block text-start text-sm">
//                     <p className="mb-1">
//                       Users are not able to send message due to the two
//                       following reasons :{" "}
//                     </p>
//                     <p>&bull; You have blocked them</p>
//                     <p>&bull; They have blocked you.</p>
//                   </div>
//                 </button>
//               </div>
//             )}

//             {/* SEND MESSAGE DIV - INPUT FIELD */}
//             {!selectedChat.isBlocked && (
//               <form
//                 onSubmit={sendMessageHandler}
//                 className="flex w-full flex-row space-x-4 bg-light_green px-4 py-4"
//               >
//                 <input
//                   ref={messageInputFieldRef}
//                   type="text"
//                   id="message_input"
//                   name="message_input"
//                   placeholder="Enter Your Message Here"
//                   className="w-full rounded-lg bg-white px-4 focus:outline-none"
//                 />
//                 <button
//                   type="submit"
//                   className="flex h-12 w-12 items-center justify-center rounded-full bg-dark_green
//                             font-[700] text-white transition-all duration-200 hover:bg-dark_green/90 hover:text-bright_green"
//                 >
//                   <IoMdSend className="h-6 w-6 " />
//                 </button>
//               </form>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
