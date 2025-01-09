"use client";

import { create } from "zustand";

type DrugSelection = {
  drugId: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
};

type InvoiceStore = {
  selectedDrugs: DrugSelection[];
  addDrug: (drug: DrugSelection) => void;
  removeDrug: (drugId: string) => void;
  updateQuantity: (drugId: string, quantity: number) => void;
  clearSelection: () => void;
};

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  selectedDrugs: [],
  addDrug: (drug) =>
    set((state) => ({
      selectedDrugs: [...state.selectedDrugs, drug],
    })),
  removeDrug: (drugId) =>
    set((state) => ({
      selectedDrugs: state.selectedDrugs.filter((d) => d.drugId !== drugId),
    })),

  updateQuantity: (drugId, quantity) =>
    set((state) => ({
      selectedDrugs: state.selectedDrugs.map((d) =>
        d.drugId === drugId ? { ...d, quantity } : d
      ),
    })),
  clearSelection: () => set({ selectedDrugs: [] }),
}));
