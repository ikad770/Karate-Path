export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      belts: {
        Row: {
          color_hex: string
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          name_en: string
          name_he: string
          style_id: string
          updated_at: string | null
        
          name_ja: string | null;
          rank_label: string | null;
          kyu_number: number | null;
          dan_number: number | null;
          image_url: string | null;}
        Insert: {
          color_hex?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name_en: string
          name_he: string
          style_id: string
          updated_at?: string | null
        }
        Update: {
          color_hex?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name_en?: string
          name_he?: string
          style_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "belts_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      japanese_culture: {
        Row: {
          category: string
          content_md: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          title_en: string
          title_he: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content_md?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          title_en: string
          title_he: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content_md?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          title_en?: string
          title_he?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          belt_id: string
          category: Database["public"]["Enums"]["lesson_category"]
          common_mistakes: string[] | null
          content_md: string | null
          cover_image_url: string | null
          created_at: string | null
          display_order: number | null
          explanation: string | null
          id: string
          objectives: string[] | null
          practice_tips: string[] | null
          safety_warnings: string[] | null
          slug: string
          sources_json: Json | null
          status: Database["public"]["Enums"]["lesson_status"] | null
          steps: string[] | null
          style_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          belt_id: string
          category: Database["public"]["Enums"]["lesson_category"]
          common_mistakes?: string[] | null
          content_md?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          display_order?: number | null
          explanation?: string | null
          id?: string
          objectives?: string[] | null
          practice_tips?: string[] | null
          safety_warnings?: string[] | null
          slug: string
          sources_json?: Json | null
          status?: Database["public"]["Enums"]["lesson_status"] | null
          steps?: string[] | null
          style_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          belt_id?: string
          category?: Database["public"]["Enums"]["lesson_category"]
          common_mistakes?: string[] | null
          content_md?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          display_order?: number | null
          explanation?: string | null
          id?: string
          objectives?: string[] | null
          practice_tips?: string[] | null
          safety_warnings?: string[] | null
          slug?: string
          sources_json?: Json | null
          status?: Database["public"]["Enums"]["lesson_status"] | null
          steps?: string[] | null
          style_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_belt_id_fkey"
            columns: ["belt_id"]
            isOneToOne: false
            referencedRelation: "belts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          preferred_style_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          preferred_style_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          preferred_style_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_preferred_style_id_fkey"
            columns: ["preferred_style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answer_json: Json
          created_at: string | null
          display_order: number | null
          explanation: string | null
          id: string
          options_json: Json
          prompt: string
          quiz_id: string
          type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          answer_json: Json
          created_at?: string | null
          display_order?: number | null
          explanation?: string | null
          id?: string
          options_json?: Json
          prompt: string
          quiz_id: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          answer_json?: Json
          created_at?: string | null
          display_order?: number | null
          explanation?: string | null
          id?: string
          options_json?: Json
          prompt?: string
          quiz_id?: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          belt_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_belt_exam: boolean | null
          lesson_id: string | null
          pass_score: number | null
          style_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          belt_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_belt_exam?: boolean | null
          lesson_id?: string | null
          pass_score?: number | null
          style_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          belt_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_belt_exam?: boolean | null
          lesson_id?: string | null
          pass_score?: number | null
          style_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_belt_id_fkey"
            columns: ["belt_id"]
            isOneToOne: false
            referencedRelation: "belts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      styles: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          name_en: string
          name_he: string
          name_ja: string | null
          updated_at: string | null
        
          image_url: string | null;
          authority_name: string | null;
          authority_url: string | null;
          origin_region: string | null;
          founded_by: string | null;
          founded_year: number | null;
          lineage_md: string | null;
          governing_notes_md: string | null;
          reference_sources: Json | null;}
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name_en: string
          name_he: string
          name_ja?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name_en?: string
          name_he?: string
          name_ja?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      terms: {
        Row: {
          belt_id: string | null
          category: string | null
          created_at: string | null
          description_md: string | null
          id: string
          image_url: string | null
          romaji: string | null
          style_id: string | null
          term_en: string
          term_he: string
          term_ja: string | null
          updated_at: string | null
        
          image_url: string | null;}
        Insert: {
          belt_id?: string | null
          category?: string | null
          created_at?: string | null
          description_md?: string | null
          id?: string
          image_url?: string | null
          romaji?: string | null
          style_id?: string | null
          term_en: string
          term_he: string
          term_ja?: string | null
          updated_at?: string | null
        }
        Update: {
          belt_id?: string | null
          category?: string | null
          created_at?: string | null
          description_md?: string | null
          id?: string
          image_url?: string | null
          romaji?: string | null
          style_id?: string | null
          term_en?: string
          term_he?: string
          term_ja?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "terms_belt_id_fkey"
            columns: ["belt_id"]
            isOneToOne: false
            referencedRelation: "belts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_results: {
        Row: {
          id: string
          passed: boolean
          quiz_id: string
          score: number
          taken_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          passed?: boolean
          quiz_id: string
          score: number
          taken_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      lesson_category:
        | "kihon"
        | "kata"
        | "kumite"
        | "dojo_rules"
        | "terms"
        | "belt_exam"
      lesson_status: "draft" | "published"
      question_type: "multiple_choice" | "true_false" | "ordering"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      lesson_category: [
        "kihon",
        "kata",
        "kumite",
        "dojo_rules",
        "terms",
        "belt_exam",
      ],
      lesson_status: ["draft", "published"],
      question_type: ["multiple_choice", "true_false", "ordering"],
    },
  },
} as const
