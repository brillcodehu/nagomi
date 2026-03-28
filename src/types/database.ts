export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      class_types: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          tagline: string | null;
          duration_min: number;
          max_capacity: number;
          price_huf: number;
          difficulty: number;
          is_private: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          tagline?: string | null;
          duration_min?: number;
          max_capacity?: number;
          price_huf: number;
          difficulty?: number;
          is_private?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          tagline?: string | null;
          duration_min?: number;
          max_capacity?: number;
          price_huf?: number;
          difficulty?: number;
          is_private?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      pass_types: {
        Row: {
          id: string;
          name: string;
          occasions: number;
          price_huf: number;
          valid_days: number;
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          occasions: number;
          price_huf: number;
          valid_days?: number;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          occasions?: number;
          price_huf?: number;
          valid_days?: number;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      instructors: {
        Row: {
          id: string;
          auth_user_id: string | null;
          name: string;
          email: string;
          bio: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          name: string;
          email: string;
          bio?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          name?: string;
          email?: string;
          bio?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      scheduled_classes: {
        Row: {
          id: string;
          class_type_id: string;
          instructor_id: string;
          day_of_week: number | null;
          start_time: string;
          specific_date: string | null;
          max_spots_override: number | null;
          is_cancelled: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_type_id: string;
          instructor_id: string;
          day_of_week?: number | null;
          start_time: string;
          specific_date?: string | null;
          max_spots_override?: number | null;
          is_cancelled?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_type_id?: string;
          instructor_id?: string;
          day_of_week?: number | null;
          start_time?: string;
          specific_date?: string | null;
          max_spots_override?: number | null;
          is_cancelled?: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          scheduled_class_id: string;
          class_date: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          status: string;
          payment_type: string;
          stripe_payment_intent_id: string | null;
          stripe_checkout_session_id: string | null;
          pass_id: string | null;
          amount_huf: number | null;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          scheduled_class_id: string;
          class_date: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          status?: string;
          payment_type: string;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          pass_id?: string | null;
          amount_huf?: number | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          scheduled_class_id?: string;
          class_date?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          status?: string;
          payment_type?: string;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          pass_id?: string | null;
          amount_huf?: number | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
        };
      };
      customer_passes: {
        Row: {
          id: string;
          pass_type_id: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          remaining_occasions: number;
          purchased_at: string;
          expires_at: string;
          stripe_payment_intent_id: string | null;
          stripe_checkout_session_id: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pass_type_id: string;
          customer_email: string;
          customer_name: string;
          customer_phone?: string | null;
          remaining_occasions: number;
          purchased_at?: string;
          expires_at: string;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          pass_type_id?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string | null;
          remaining_occasions?: number;
          purchased_at?: string;
          expires_at?: string;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {
      book_class: {
        Args: {
          p_scheduled_class_id: string;
          p_class_date: string;
          p_customer_name: string;
          p_customer_email: string;
          p_customer_phone: string;
          p_payment_type: string;
          p_stripe_session_id?: string;
          p_pass_id?: string;
          p_amount_huf?: number;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
  };
};

// Convenience type aliases
export type ClassType = Database["public"]["Tables"]["class_types"]["Row"];
export type PassType = Database["public"]["Tables"]["pass_types"]["Row"];
export type Instructor = Database["public"]["Tables"]["instructors"]["Row"];
export type ScheduledClass = Database["public"]["Tables"]["scheduled_classes"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type CustomerPass = Database["public"]["Tables"]["customer_passes"]["Row"];

// Joined types for frontend
export type ScheduledClassWithDetails = ScheduledClass & {
  class_types: ClassType;
  instructors: Instructor;
  booking_count: number;
};
