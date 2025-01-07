export function formatNumber(amount: number): string {
  return amount?.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

export function getInitials(name: string): string {
  const words = name.trim().split(" ");

  const firstTwoWords = words.slice(0, 2);

  const initials = firstTwoWords.map((word) => word.charAt(0).toUpperCase());

  return initials.join("");
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    // timeZoneName: "short", // "UTC"
  };

  return date.toLocaleString("en-US", options);
}

export function calculateAge(dob: Date): string {
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (months === 0 && today.getDate() < dob.getDate()) {
    years--;
    months = 11;
  }

  if (years === 0) {
    return `${months} months old`;
  }

  let ageString = `${years} years`;

  if (months > 0) {
    ageString += ` ${months} months`;
  }

  return ageString + " old";
}

export const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function generateRandomColor(): string {
  let hexColor = "";
  do {
    const randomInt = Math.floor(Math.random() * 16777216);

    hexColor = `#${randomInt.toString(16).padStart(6, "0")}`;
  } while (
    hexColor.toLowerCase() === "#ffffff" ||
    hexColor.toLowerCase() === "#000000"
  ); // Ensure it’s not white or black
  return hexColor;
}

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  const formattedMinute = minute.toString().padStart(2, "0");
  return `${adjustedHour}:${formattedMinute} ${period}`;
}

export function generateTimes(
  start_hour: number,
  close_hour: number,
  interval_in_minutes: number
) {
  const times = [];
  const startHour = start_hour;
  const endHour = close_hour;
  const intervalMinutes = interval_in_minutes;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break;
      const formattedTime = formatTime(hour, minute);
      times.push({ label: formattedTime, value: formattedTime });
    }
  }

  return times;
}
