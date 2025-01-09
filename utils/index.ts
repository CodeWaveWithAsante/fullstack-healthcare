export function getInitials(name: string): string {
  const words = name.trim().split(" ");

  const firstTwoWords = words.slice(0, 2);

  const initials = firstTwoWords.map((word) => word.charAt(0).toUpperCase());

  return initials.join("");
}

export function formatNumberToCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return amount?.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

export function getFormatTime(val: Date | string) {
  const date = new Date(val);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return time;
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

export function formatDate(date: Date): string {
  const day = String(date?.getDate()).padStart(2, "0");
  const month = String(date?.getMonth() + 1).padStart(2, "0");
  const year = date?.getFullYear();

  return `${day}-${month}-${year}`;
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

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  const formattedMinute = minute.toString().padStart(2, "0");
  return `${adjustedHour}:${formattedMinute} ${period}`;
}

export const GENDER = [
  { label: "MALE", value: "MALE" },
  { label: "FEMALE", value: "FEMALE" },
];

export const MARITAL_STATUS = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
  { label: "Separated", value: "separated" },
];

export const RELATION = [
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "husband", label: "Husband" },
  { value: "wife", label: "Wife" },
  { value: "other", label: "Other" },
];

export const USER_ROLES = {
  ADMIN: "ADMIN" as string,
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  LAB_TECHNICIAN: "LAB_TECHNICIAN",
  PATIENT: "PATIENT",
  CASHIER: "CASHIER",
};

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

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length > 10) return phoneNumber;

  if (cleaned.length !== 10) {
    throw new Error("Phone number must be 10 digits long.");
  }

  const formattedNumber = `(${cleaned.substring(0, 3)}) ${cleaned.substring(
    3,
    6
  )}-${cleaned.substring(6)}`;

  return formattedNumber;
}

type BMIResult = {
  bmi: number;
  status: string;
  colorCode: string;
};

export function calculateBMI(weight: number, heightInCm: number): BMIResult {
  const heightInMeters = heightInCm / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let status: string;
  let colorCode: string;

  if (bmi < 18.5) {
    status = "Underweight";
    colorCode = "#1E90FF"; // Light Blue
  } else if (bmi >= 18.5 && bmi < 24.9) {
    status = "Normal weight";
    colorCode = "#32CD32"; // Lime Green
  } else if (bmi >= 25 && bmi < 29.9) {
    status = "Overweight";
    colorCode = "#FFA500"; // Orange
  } else {
    status = "Obesity";
    colorCode = "#FF4500"; // Red-Orange
  }

  return {
    bmi: parseFloat(bmi.toFixed(2)),
    status,
    colorCode,
  };
}

type DiscountInput = {
  amount: number;
  discount?: number;
  discountPercentage?: number;
};

export function calculateDiscount({
  amount,
  discount,
  discountPercentage,
}: DiscountInput): {
  finalAmount: number;
  discountPercentage?: number;
  discountAmount?: number;
} {
  if (discount != null && discountPercentage != null) {
    throw new Error(
      "Provide either discount amount or discount percentage, not both."
    );
  }

  if (discount != null) {
    // Calculate discount percentage if a discount amount is provided
    const discountPercent = (discount / amount) * 100;
    return {
      finalAmount: amount - discount,
      discountPercentage: discountPercent,
      discountAmount: discount,
    };
  } else if (discountPercentage != null) {
    // Calculate discount amount if a discount percentage is provided
    const discountAmount = (discountPercentage / 100) * amount;
    return {
      finalAmount: amount - discountAmount,
      discountPercentage,
      discountAmount,
    };
  } else {
    throw new Error(
      "Please provide either a discount amount or a discount percentage."
    );
  }
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

export function isNumber(value: any): boolean {
  return typeof value === "number";
}

export function calculateRatio(staff: number, patients: number): string {
  const patientsPerStaff = Math.floor(patients / staff);

  // Return the ratio as a string
  return `1 Staff : ${patientsPerStaff} Patients`;
}
