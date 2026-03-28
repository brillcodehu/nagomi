export type BookingStep = "summary" | "details" | "payment" | "confirmation";

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  usePass: boolean;
  passId: string | null;
}

export interface BookingSlot {
  scheduledClassId: string;
  classDate: string;
  className: string;
  classSlug: string;
  startTime: string;
  durationMin: number;
  instructorName: string;
  priceHuf: number;
  maxSpots: number;
  bookedSpots: number;
  availableSpots: number;
  difficulty: number;
  isPrivate: boolean;
}

export interface PassBalance {
  id: string;
  passTypeName: string;
  remainingOccasions: number;
  expiresAt: string;
}
