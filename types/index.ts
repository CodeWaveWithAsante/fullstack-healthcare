export interface SearchParamsProps {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export type DeleteType =
  | "doctor"
  | "staff"
  | "patient"
  | "auditLog"
  | "bill"
  | "payment"
  | "service"
  | "vital_signs"
  | "diagnosis";
