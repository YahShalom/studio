export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          contact: string
          created_at: string
          id: string
          message: string
          name: string
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          message: string
          name: string
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      product_media: {
        Row: {
          created_at: string
          id: string
          product_id: string
          sort_order: number
          type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          type?: Database["public"]["Enums"]["media_type"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          colors: string[] | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          in_stock: boolean
          is_new: boolean
          name: string
          on_sale: boolean
          price_ttd: number
          sizes: string[] | null
          slug: string
          tags: string[] | null
        }
        Insert: {
          category_id: string
          colors?: string[] | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          in_stock?: boolean
          is_new?: boolean
          name: string
          on_sale?: boolean
          price_ttd: number
          sizes?: string[] | null
          slug: string
          tags?: string[] | null
        }
        Update: {
          category_id?: string
          colors?: string[] | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          in_stock?: boolean
          is_new?: boolean
          name?: string
          on_sale?: boolean
          price_ttd?: number
          sizes?: string[] | null
          slug?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          role: string
        }
        Insert: {
          id: string
          role?: string
        }
        Update: {
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          announcement_banner: string | null
          id: number
          instagram_handle: string
          location_1_address: string
          location_1_gmaps_url: string
          location_1_name: string
          location_2_address: string
          location_2_gmaps_url: string
          location_2_name: string
          opening_hours: string
          payments_enabled: boolean
          phone_number: string
          site_name: string
          tagline: string
          whatsapp_number: string
        }
        Insert: {
          announcement_banner?: string | null
          id?: number
          instagram_handle?: string
          location_1_address?: string
          location_1_gmaps_url?: string
          location_1_name?: string
          location_2_address?: string
          location_2_gmaps_url?: string
          location_2_name?: string
          opening_hours?: string
          payments_enabled?: boolean
          phone_number?: string
          site_name?: string
          tagline?: string
          whatsapp_number?: string
        }
        Update: {
          announcement_banner?: string | null
          id?: number
          instagram_handle?: string
          location_1_address?: string
          location_1_gmaps_url?: string
          location_1_name?: string
          location_2_address?: string
          location_2_gmaps_url?: string
          location_2_name?: string
          opening_hours?: string
          payments_enabled?: boolean
          phone_number?: string
          site_name?: string
          tagline?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      media_type: "image" | "video"
      user_role: "staff" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// Custom application types
export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductMedia = Database['public']['Tables']['product_media']['Row'];
export type Inquiry = Database['public']['Tables']['inquiries']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type ProductWithRelations = Product & {
  categories?: Category;
  product_media?: ProductMedia[];
};

export type UserRole = Database['public']['Enums']['user_role'];
