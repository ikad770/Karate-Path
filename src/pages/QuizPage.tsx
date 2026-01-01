import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ChevronLeft, RefreshCw } from "lucide-react";

type Quiz = {
  id: string;
  title: string;
  description: string | null;
  pass_score: number | null;
  is_belt_exam: boolean | null;
  belt_id: string | null;
};

type Question = {
  id: string;
  quiz_id: string;
  prompt: string;
  options: string[];
  correct_option_index: number;
  explanation: string | null;
  display_order: number;
};

export default function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    (async () => {
      const [quizRes, qRes] = await Promise.all([
        supabase.from("quizzes").select("*").eq("id", quizId).maybeSingle(),
        supabase.from("questions").select("*").eq("quiz_id", quizId).order("display_order"),
      ]);

      if (quizRes.data) setQuiz(quizRes.data as any);
      if (qRes.data) setQuestions(qRes.data as any);
    })();
  }, [quizId]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    const total = questions.length || 1;
    const correct = questions.filter((q) => answers[q.id] === q.correct_option_index).length;
    return Math.round((correct / total) * 100);
  }, [submitted, questions, answers]);

  const passed = useMemo(() => {
    const pass = quiz?.pass_score ?? 70;
    return submitted && score >= pass;
  }, [submitted, score, quiz]);

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  if (!quizId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <Alert>
            <AlertDescription>לא נמצא מזהה מבחן.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{quiz?.title ?? "מבחן"}</h1>
            {quiz?.description && <p className="text-muted-foreground mt-1">{quiz.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/"><ChevronLeft className="h-4 w-4 ml-2" /> חזרה</Link>
            </Button>
            <Button variant="secondary" onClick={reset}>
              <RefreshCw className="h-4 w-4 ml-2" />
              איפוס
            </Button>
          </div>
        </div>

        {submitted && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                תוצאה: {score}%
                {passed ? (
                  <Badge className="bg-green-600/20 text-green-200 border-green-700/30">עבר</Badge>
                ) : (
                  <Badge className="bg-red-600/20 text-red-200 border-red-700/30">לא עבר</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {passed ? "מעולה. אפשר להתקדם לבחינה מעשית/אימון מסכם." : "מומלץ לחזור לשיעורים ולנסות שוב."}
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const chosen = answers[q.id];
            const isCorrect = submitted && chosen === q.correct_option_index;
            const isWrong = submitted && chosen !== undefined && chosen !== q.correct_option_index;

            return (
              <Card key={q.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-start justify-between gap-3">
                    <span>{idx + 1}. {q.prompt}</span>
                    {submitted && (
                      isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-400" /> :
                      isWrong ? <XCircle className="h-5 w-5 text-red-400" /> : null
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <RadioGroup
                    value={chosen !== undefined ? String(chosen) : ""}
                    onValueChange={(v) => {
                      if (submitted) return;
                      setAnswers((prev) => ({ ...prev, [q.id]: Number(v) }));
                    }}
                    className="space-y-2"
                  >
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-start gap-3 rounded-xl border p-3 hover:bg-muted/30 cursor-pointer">
                        <RadioGroupItem value={String(oi)} />
                        <span className="text-sm leading-6">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>

                  {submitted && q.explanation && (
                    <div className="rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground">
                      {q.explanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-end">
          {!submitted ? (
            <Button
              onClick={() => setSubmitted(true)}
              disabled={questions.length === 0}
            >
              סיום ובדיקה
            </Button>
          ) : (
            <Button variant="outline" onClick={reset}>
              נסה שוב
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
