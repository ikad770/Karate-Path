-- Create enums
CREATE TYPE public.lesson_status AS ENUM ('draft', 'published');
CREATE TYPE public.lesson_category AS ENUM ('kihon', 'kata', 'kumite', 'dojo_rules', 'terms', 'belt_exam');
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'true_false', 'ordering');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create styles table
CREATE TABLE public.styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_he TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ja TEXT,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create belts table
CREATE TABLE public.belts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_id UUID REFERENCES public.styles(id) ON DELETE CASCADE NOT NULL,
  name_he TEXT NOT NULL,
  name_en TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#FFFFFF',
  display_order INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_id UUID REFERENCES public.styles(id) ON DELETE CASCADE NOT NULL,
  belt_id UUID REFERENCES public.belts(id) ON DELETE CASCADE NOT NULL,
  category lesson_category NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  objectives TEXT[],
  explanation TEXT,
  steps TEXT[],
  common_mistakes TEXT[],
  practice_tips TEXT[],
  safety_warnings TEXT[],
  content_md TEXT,
  cover_image_url TEXT,
  sources_json JSONB DEFAULT '[]'::jsonb,
  status lesson_status DEFAULT 'draft',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create terms table (trilingual dictionary)
CREATE TABLE public.terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_id UUID REFERENCES public.styles(id) ON DELETE SET NULL,
  belt_id UUID REFERENCES public.belts(id) ON DELETE SET NULL,
  term_he TEXT NOT NULL,
  term_en TEXT NOT NULL,
  term_ja TEXT,
  romaji TEXT,
  description_md TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_id UUID REFERENCES public.styles(id) ON DELETE CASCADE,
  belt_id UUID REFERENCES public.belts(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  pass_score INTEGER DEFAULT 70,
  is_belt_exam BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  type question_type NOT NULL DEFAULT 'multiple_choice',
  prompt TEXT NOT NULL,
  options_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  answer_json JSONB NOT NULL,
  explanation TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_style_id UUID REFERENCES public.styles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create user_quiz_results table
CREATE TABLE public.user_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  taken_at TIMESTAMPTZ DEFAULT now()
);

-- Create japanese_culture table for culture learning path
CREATE TABLE public.japanese_culture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_he TEXT NOT NULL,
  title_en TEXT NOT NULL,
  category TEXT NOT NULL,
  content_md TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.belts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.japanese_culture ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read policies for content tables
CREATE POLICY "Styles are viewable by everyone" ON public.styles FOR SELECT USING (true);
CREATE POLICY "Belts are viewable by everyone" ON public.belts FOR SELECT USING (true);
CREATE POLICY "Published lessons are viewable by everyone" ON public.lessons FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Terms are viewable by everyone" ON public.terms FOR SELECT USING (true);
CREATE POLICY "Quizzes are viewable by everyone" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Japanese culture content is viewable by everyone" ON public.japanese_culture FOR SELECT USING (true);

-- Admin write policies
CREATE POLICY "Admins can manage styles" ON public.styles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage belts" ON public.belts FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage lessons" ON public.lessons FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage terms" ON public.terms FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage quizzes" ON public.quizzes FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage questions" ON public.questions FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage culture content" ON public.japanese_culture FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profile policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies (only admins can manage)
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- User progress policies
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- User quiz results policies
CREATE POLICY "Users can view own quiz results" ON public.user_quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON public.user_quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_styles_updated_at BEFORE UPDATE ON public.styles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_belts_updated_at BEFORE UPDATE ON public.belts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_terms_updated_at BEFORE UPDATE ON public.terms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_culture_updated_at BEFORE UPDATE ON public.japanese_culture FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_belts_style_id ON public.belts(style_id);
CREATE INDEX idx_lessons_style_id ON public.lessons(style_id);
CREATE INDEX idx_lessons_belt_id ON public.lessons(belt_id);
CREATE INDEX idx_lessons_status ON public.lessons(status);
CREATE INDEX idx_terms_style_id ON public.terms(style_id);
CREATE INDEX idx_terms_belt_id ON public.terms(belt_id);
CREATE INDEX idx_quizzes_style_id ON public.quizzes(style_id);
CREATE INDEX idx_quizzes_belt_id ON public.quizzes(belt_id);
CREATE INDEX idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_quiz_results_user_id ON public.user_quiz_results(user_id);