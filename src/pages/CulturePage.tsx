import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Edit3, Users, Shirt, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

interface CultureItem {
  id: string;
  title_he: string;
  title_en: string;
  category: string;
  content_md: string | null;
}

const categoryIcons: Record<string, any> = {
  writing: Edit3,
  etiquette: Users,
  equipment: Shirt,
  history: History,
};

const categoryNames: Record<string, string> = {
  writing: "כתיבה יפנית",
  etiquette: "נימוסים",
  equipment: "ציוד",
  history: "היסטוריה",
};

const CulturePage = () => {
  const [items, setItems] = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from("japanese_culture").select("*").order("display_order");
      if (data) setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div className="min-h-screen bg-background pattern-seigaiha">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">תרבות יפנית</h1>
          <p className="text-muted-foreground mb-8">למד על המסורת והתרבות היפנית הקשורה לקראטה</p>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map(cat => (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-4">
                    {(() => { const Icon = categoryIcons[cat] || BookOpen; return <Icon className="h-6 w-6 text-primary" />; })()}
                    <h2 className="text-2xl font-bold">{categoryNames[cat] || cat}</h2>
                  </div>
                  <div className="space-y-4">
                    {items.filter(i => i.category === cat).map((item, i) => (
                      <Card key={item.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                        <CardHeader>
                          <CardTitle>{item.title_he}</CardTitle>
                          <p className="text-sm text-muted-foreground">{item.title_en}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="prose-karate">
  <SimpleMarkdown md={item.content_md} />
</div>
</CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulturePage;
