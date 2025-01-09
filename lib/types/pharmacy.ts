// Pharmacy Types
export type Drug = {
  id: string;
  name: string;
  batchNumber: string;
  manufacturer: string;
  expiryDate: Date;
  quantity: number;
  pricePerUnit: number;
  category: DrugCategory;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export enum DrugCategory {
  ANTIBIOTICS = "ANTIBIOTICS",
  PAINKILLERS = "PAINKILLERS",
  ANTIVIRAL = "ANTIVIRAL",
  CARDIOVASCULAR = "CARDIOVASCULAR",
  RESPIRATORY = "RESPIRATORY",
  OTHER = "OTHER",
}

export type StockUpdate = {
  id: string;
  drugId: string;
  previousQuantity: number;
  newQuantity: number;
  type: "RESTOCK" | "ISSUANCE";
  updatedBy: string;
  updatedAt: Date;
  notes?: string;
};

export type DrugIssuance = {
  id: string;
  patientId: string;
  prescriptionId: string;
  pharmacistId: string;
  issuedAt: Date;
  drugs: IssuedDrug[];
  totalCost: number;
};

export type IssuedDrug = {
  drugId: string;
  quantity: number;
  pricePerUnit: number;
};

export type InvoiceType = {
  id: string;
  providerName: string;
  purchaseDate: Date;
  drugs: PurchasedDrug[];
  totalCost: number;
  status: "PENDING" | "PAID" | "CANCELLED";
};

export type PurchasedDrug = {
  drugId: string;
  quantity: number;
  pricePerUnit: number;
  drug: { name: string };
};
