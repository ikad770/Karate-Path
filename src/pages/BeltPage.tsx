import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, BookOpen, Swords, Target, Shield, FileText, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

interface Term {
  id: string;
  term_he: string;
  term_en: string;
  term_ja: string | null;
  romaji: string | null;
  description_md: string | null;
  image_url: string | null;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
}

const categoryIcons: Record<string, any> = {
  kihon: Target,
  kata: Swords,
  kumite: Shield,
  dojo_rules: BookOpen,
  terms: FileText,
  belt_exam: Award,
};

const categoryNames: Record<string, string> = {
  kihon: "קיהון",
  kata: "קאטה",
  kumite: "קומיטה",
  dojo_rules: "כללי דוג'ו",
  terms: "מונחים",
  belt_exam: "מבחן חגורה",
};

const BeltPage = () => {
  const { styleId, beltId } = useParams();
  const [belt, setBelt] = useState<any>(null);
  const [style, setStyle] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [beltRes, styleRes, lessonsRes, termsRes] = await Promise.all([
        supabase.from("belts").select("*").eq("id", beltId).single(),
        supabase.from("styles").select("*").eq("id", styleId).single(),
        supabase.from("lessons").select("*").eq("belt_id", beltId).order("display_order"),
        supabase.from("terms").select("*").eq("style_id", styleId).eq("belt_id", beltId).order("term_he"),
      ]);
      if (beltRes.data) setBelt(beltRes.data);
      if (styleRes.data) setStyle(styleRes.data);
      if (lessonsRes.data) setLessons(lessonsRes.data);
      setLoading(false);
    };
    fetchData();
  }, [styleId, beltId]);

  const categories = useMemo(() => {
    const base = [...new Set(lessons.map(l => l.category))];
    if (terms.length) base.push("terms");
    return base;
  }, [lessons, terms]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link to="/" className="hover:text-foreground">ראשי</Link>
          <ArrowRight className="h-4 w-4 flip-rtl" />
          <Link to={`/style/${styleId}`} className="hover:text-foreground">{style?.name_he}</Link>
          <ArrowRight className="h-4 w-4 flip-rtl" />
          <span className="text-foreground">{belt?.name_he}</span>
        </div>
      </div>

      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            {belt?.image_url ? (
  <div className="w-16 h-16 rounded-2xl border bg-muted/20 overflow-hidden flex items-center justify-center">
    <img src={belt.image_url} alt={belt.name_he} className="w-full h-full object-contain p-3" loading="lazy" />
  </div>
) : (
  <div 
    className="w-16 h-16 rounded-full border-4"
    style={{ borderColor: belt?.color_hex, backgroundColor: belt?.color_hex + '20' }}
  />
)}
            <div>
              <h1 className="text-3xl font-bold">{belt?.name_he}</h1>
              <p className="text-muted-foreground">{style?.name_he} • {belt?.rank_label ?? ""} • {belt?.name_en}{belt?.name_ja ? ` • ${belt.name_ja}` : ""}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {lessons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>אין עדיין שיעורים זמינים לחגורה זו</p>
            </div>
          ) : (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-transparent p-0">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat] || BookOpen;
                  return (
                    <TabsTrigger 
                      key={cat} 
                      value={cat}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-4 w-4 ml-2" />
                      {categoryNames[cat] || cat}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {categories.map(cat => (
                <TabsContent key={cat} value={cat}>
  {cat === "terms" ? (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {terms.length === 0 ? (
        <Card className="sm:col-span-2 lg:col-span-3">
          <CardContent className="py-8 text-center text-muted-foreground">
            אין מונחים חדשים לדרגה הזו עדיין.
          </CardContent>
        </Card>
      ) : (
        terms.map((term) => (
          <Card key={term.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                {term.image_url && (
                  <div className="w-12 h-12 rounded-2xl border bg-muted/20 overflow-hidden flex items-center justify-center">
                    <img src={term.image_url} alt={term.term_he} className="w-full h-full object-contain p-2" loading="lazy" />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-base">{term.term_he}</CardTitle>
                  <div className="text-sm text-muted-foreground">{term.term_en}{term.romaji ? ` • ${term.romaji}` : ""}</div>
                  {term.term_ja && <div className="text-sm text-muted-foreground">{term.term_ja}</div>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              {term.description_md && <p className="leading-6">{term.description_md}</p>}
              <Link
                to={`/dictionary?q=${encodeURIComponent(term.term_en)}`}
                className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
              >
                חפש במילון
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  ) : (
    <div className="grid gap-4">
      {lessons.filter(l => l.category === cat).map((lesson, i) => (
        <Link key={lesson.id} to={`/lesson/${lesson.slug}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.summary && <p className="text-muted-foreground text-sm">{lesson.summary}</p>}
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                {lesson.estimated_minutes && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lesson.estimated_minutes} דק׳
                  </span>
                )}
                {lesson.status === "draft" && (
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    טיוטה
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )}
</TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
};

export default BeltPage;
