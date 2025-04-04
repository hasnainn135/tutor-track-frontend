export const timestampToTime = (timestamp:any) => {
    console.log('recieved = ', timestamp)
    const milliseconds = timestamp.seconds * 1000;
    // Create a Date object
    const dateObject = new Date(milliseconds);
    // Extract hours, minutes, and AM/PM
    let hours = dateObject.getHours(); // 24-hour format
    const minutes = dateObject.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    // Convert hours to 12-hour format
    hours %= 12;
    hours = hours || 12; // Convert 0 to 12 for 12-hour format
    // Format time as "HH:MM AM/PM"
    const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
    // console.log(formattedTime); // Output: "4:30 PM"

    return formattedTime;
};