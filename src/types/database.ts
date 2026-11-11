export type BlogCategory = "evento" | "circular";
export type DocumentType = "manual_convivencia" | "resolucion_estudios";
export type StatisticKey =
  | "docentes"
  | "estudiantes"
  | "graduados"
  | "anios_experiencia";
export type ProfileRole = "admin" | "editor";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  published_at: string;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AcademicLevel = {
  id: string;
  slug: string;
  name: string;
  pdf_url: string | null;
  updated_at: string;
};

export type InstitutionalDocument = {
  id: string;
  type: DocumentType;
  title: string;
  pdf_url: string | null;
  updated_at: string;
};

export type Facility = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Statistic = {
  id: string;
  key: StatisticKey;
  label: string;
  value: number;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: ProfileRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: ProfileRole;
          created_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPost;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: BlogCategory;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          pdf_url?: string | null;
          published_at?: string;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: BlogCategory;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          pdf_url?: string | null;
          published_at?: string;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      academic_levels: {
        Row: AcademicLevel;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          pdf_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          pdf_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      institutional_documents: {
        Row: InstitutionalDocument;
        Insert: {
          id?: string;
          type: DocumentType;
          title: string;
          pdf_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: DocumentType;
          title?: string;
          pdf_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      facilities: {
        Row: Facility;
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      statistics: {
        Row: Statistic;
        Insert: {
          id?: string;
          key: StatisticKey;
          label: string;
          value: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: StatisticKey;
          label?: string;
          value?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      blog_category: BlogCategory;
      document_type: DocumentType;
      profile_role: ProfileRole;
    };
    CompositeTypes: Record<string, never>;
  };
};
