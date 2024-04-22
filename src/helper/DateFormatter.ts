export const formattedDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",  // dd
        month: "2-digit", // mm
        year: "numeric" // yyyy
    };
    const userLocale = navigator.language || "de-AT";
    return new Date(date).toLocaleDateString(userLocale, options);
}