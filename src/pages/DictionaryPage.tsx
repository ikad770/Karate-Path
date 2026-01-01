import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  category: string | null;
}

const categoryColors: Record<string, string> = {
  general: "bg-primary",
  dojo: "bg-category-dojo text-accent-foreground",
  equipment: "bg-category-kihon",
  training: "bg-category-kata",
  etiquette: "bg-category-terms",
  techniques: "bg-category-kumite",
  stances: "bg-category-kihon",
  levels: "bg-muted",
};

const DictionaryPage = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = params.get("q");
    if (q) setSearch(q);
  }, [params]);

  useEffect(() => {
    const fetchTerms = async () => {
      const { data } = await supabase.from("terms").select("*").order("term_he");
      if (data) setTerms(data);
      setLoading(false);
    };
    fetchTerms();
  }, []);

  const filteredTerms = terms.filter(t => 
    t.term_he.includes(search) || 
    t.term_en.toLowerCase().includes(search.toLowerCase()) ||
    t.romaji?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">מילון מונחים</h1>
        <p className="text-muted-foreground mb-8">עברית • English • 日本語</p>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="חיפוש מונח..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Terms Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((term, i) => (
              <Card key={term.id} className="card-hover animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                <CardContent className="p-4">
                  <div className="flex gap-4 mb-2">
  {term.image_url && (
    <div className="w-16 h-16 shrink-0 rounded-2xl border bg-muted/20 overflow-hidden flex items-center justify-center">
      <img src={term.image_url} alt={term.term_he} className="w-full h-full object-contain p-2" loading="lazy" />
    </div>
  )}
  <div className="flex items-start justify-between flex-1">
                    <div>
                      <h3 className="text-xl font-bold">{term.term_he}</h3>
                      <p className="text-muted-foreground">{term.term_en}</p>
                    </div>
                    {term.category && (
                      <Badge className={categoryColors[term.category] || "bg-muted"}>
                        {term.category}
                      </Badge>
                    )}
                  </div>
                </div>
                  {term.term_ja && (
                    <div className="font-japanese text-2xl text-accent mb-1">{term.term_ja}</div>
                  )}
                  {term.romaji && (
                    <p className="text-sm text-muted-foreground italic mb-2">{term.romaji}</p>
                  )}
                  {term.description_md && (
                    <p className="text-sm text-muted-foreground">{term.description_md}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredTerms.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            לא נמצאו מונחים התואמים לחיפוש
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryPage;
