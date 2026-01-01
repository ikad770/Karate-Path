import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Target, AlertTriangle, Lightbulb, CheckCircle, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import SimpleMarkdown from "@/components/SimpleMarkdown";

const LessonPage = () => {
  const { slug } = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [style, setStyle] = useState<any>(null);
  const [belt, setBelt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const lessonRes = await supabase.from("lessons").select("*").eq("slug", slug).single();
      if (lessonRes.data) {
        setLesson(lessonRes.data);
        const [styleRes, beltRes] = await Promise.all([
          supabase.from("styles").select("*").eq("id", lessonRes.data.style_id).single(),
          supabase.from("belts").select("*").eq("id", lessonRes.data.belt_id).single(),
        ]);
        if (styleRes.data) setStyle(styleRes.data);
        if (beltRes.data) setBelt(beltRes.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">טוען...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">שיעור לא נמצא</div>
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
          <Link to={`/style/${style?.id}`} className="hover:text-foreground">{style?.name_he}</Link>
          <ArrowRight className="h-4 w-4 flip-rtl" />
          <Link to={`/style/${style?.id}/belt/${belt?.id}`} className="hover:text-foreground">{belt?.name_he}</Link>
          <ArrowRight className="h-4 w-4 flip-rtl" />
          <span className="text-foreground">{lesson.title}</span>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">{lesson.title}</h1>

{lesson.cover_image_url && (
  <div className="mb-6 overflow-hidden rounded-2xl border bg-muted/20">
    <img
      src={lesson.cover_image_url}
      alt={lesson.title}
      className="w-full max-h-[360px] object-cover"
      loading="lazy"
    />
  </div>
)}

{lesson.content_md && (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>התוכן</CardTitle>
    </CardHeader>
    <CardContent>
      <SimpleMarkdown md={lesson.content_md} />
    </CardContent>
  </Card>
)}

        {/* Objectives */}
        {lesson.objectives?.length > 0 && (
          <Card className="mb-6 bg-primary/10 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                מטרות השיעור
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lesson.objectives.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    {obj}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Explanation */}
        {lesson.explanation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>הסבר</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{lesson.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* Steps */}
        {lesson.steps?.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>שלבי ביצוע</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {lesson.steps.map((step: string, i: number) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Common Mistakes */}
        {lesson.common_mistakes?.length > 0 && (
          <Card className="mb-6 bg-destructive/10 border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                טעויות נפוצות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lesson.common_mistakes.map((mistake: string, i: number) => (
                  <li key={i}>• {mistake}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Practice Tips */}
        {lesson.practice_tips?.length > 0 && (
          <Card className="mb-6 bg-accent/10 border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Lightbulb className="h-5 w-5" />
                טיפים לתרגול
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lesson.practice_tips.map((tip: string, i: number) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Safety Warnings */}
        {lesson.safety_warnings?.length > 0 && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription>
              <strong className="text-destructive">אזהרות בטיחות:</strong>
              <ul className="mt-2">
                {lesson.safety_warnings.map((warning: string, i: number) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Sources */}
{Array.isArray(lesson.sources_json) && lesson.sources_json.length > 0 && (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>מקורות</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {lesson.sources_json.map((s: any, idx: number) => (
        <div key={idx} className="rounded-xl border p-3">
          <div className="font-medium">{s.title ?? "מקור"}</div>
          {s.publisher && <div className="text-sm text-muted-foreground">{s.publisher}</div>}
          {s.url && (
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline underline-offset-4 hover:opacity-90"
            >
              פתח מקור
            </a>
          )}
          {s.notes && <div className="mt-2 text-sm text-muted-foreground">{s.notes}</div>}
        </div>
      ))}
    </CardContent>
  </Card>
)}

{lesson.status === "draft" && (
  <Alert className="mb-6 border-muted">
    <BookOpen className="h-5 w-5" />
    <AlertDescription>
      שיעור זה עדיין בשלב טיוטה. מומלץ להוסיף מקורות לפני פרסום.
    </AlertDescription>
  </Alert>
)}

{lesson.status === "published" && (!Array.isArray(lesson.sources_json) || lesson.sources_json.length === 0) && (
  <Alert className="border-muted">
    <BookOpen className="h-5 w-5" />
    <AlertDescription>לא הוגדרו מקורות לשיעור הזה.</AlertDescription>
  </Alert>
)}
</article>
    </div>
  );
};

export default LessonPage;
