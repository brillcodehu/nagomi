import type { InferSelectModel } from "drizzle-orm";
import type {
  classTypes,
  passTypes,
  instructors,
  scheduledClasses,
  bookings,
  customerPasses,
} from "@/lib/db/schema";

export type ClassType = InferSelectModel<typeof classTypes>;
export type PassType = InferSelectModel<typeof passTypes>;
export type Instructor = InferSelectModel<typeof instructors>;
export type ScheduledClass = InferSelectModel<typeof scheduledClasses>;
export type Booking = InferSelectModel<typeof bookings>;
export type CustomerPass = InferSelectModel<typeof customerPasses>;

export type ScheduledClassWithDetails = ScheduledClass & {
  classType: ClassType;
  instructor: Instructor;
  bookingCount: number;
};
