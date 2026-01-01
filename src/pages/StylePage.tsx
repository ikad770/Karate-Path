import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Style {
  id: string;
  name_he: string;
  name_en: string;
  name_ja: string | null;
  description: string | null;
  image_url: string | null;
  authority_name: string | null;
  authority_url: string | null;
  origin_region: string | null;
  founded_by: string | null;
  founded_year: number | null;
  lineage_md: string | null;
}

interface Belt {
  id: string;
  name_he: string;
  name_en: string;
  name_ja: string | null;
  rank_label: string | null;
  color_hex: string;
  image_url: string | null;
  display_order: number;
}

const StylePage = () => {
  const { styleId } = useParams();
  const [style, setStyle] = useState<Style | null>(null);
  const [belts, setBelts] = useState<Belt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [styleRes, beltsRes] = await Promise.all([
        supabase.from("styles").select("*").eq("id", styleId).single(),
        supabase.from("belts").select("*").eq("style_id", styleId).order("display_order"),
      ]);
      if (styleRes.data) setStyle(styleRes.data);
      if (beltsRes.data) setBelts(beltsRes.data);
      setLoading(false);
    };
    fetchData();
  }, [styleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">טוען...</div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">סגנון לא נמצא</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pattern-asanoha">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">ראשי</Link>
          <ArrowRight className="h-4 w-4 flip-rtl" />
          <span className="text-foreground">{style.name_he}</span>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="font-japanese text-3xl text-accent mb-2">{style.name_ja}</div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{style.name_he}</h1>
            <p className="text-xl text-muted-foreground mb-4">{style.name_en}</p>
            <p className="text-muted-foreground">{style.description}</p>{(style.authority_name || style.origin_region || style.founded_by || style.lineage_md) && (
  <div className="mt-6 grid gap-4 sm:grid-cols-2">
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">ארגון / סמכות</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        {style.authority_name && <div><span className="font-medium text-foreground">ארגון:</span> {style.authority_name}</div>}
        {style.authority_url && (
          <a href={style.authority_url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:opacity-90">
            אתר רשמי
          </a>
        )}
      </CardContent>
    </Card>

    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">רקע / מסורת</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        {style.origin_region && <div><span className="font-medium text-foreground">אזור מקור:</span> {style.origin_region}</div>}
        {(style.founded_by || style.founded_year) && (
          <div><span className="font-medium text-foreground">מייסד:</span> {style.founded_by ?? "—"}{style.founded_year ? ` (${style.founded_year})` : ""}</div>
        )}
        {style.lineage_md && <div><span className="font-medium text-foreground">שושלת:</span> {style.lineage_md}</div>}
      </CardContent>
    </Card>
  </div>
)}
          </div>
        </div>
      </section>

      {/* Belts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">בחר חגורה</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {belts.map((belt, i) => (
              <Link key={belt.id} to={`/style/${styleId}/belt/${belt.id}`}>
                <div 
                  className="group relative p-6 rounded-lg border border-border bg-card card-hover animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div 
                    className="absolute top-0 right-0 bottom-0 w-2 rounded-r-lg"
                    style={{ backgroundColor: belt.color_hex }}
                  />
                  <div className="flex items-center gap-4">
                    {belt.image_url ? (
  <div className="w-12 h-12 rounded-2xl border flex-shrink-0 bg-muted/20 overflow-hidden">
    <img
      src={belt.image_url}
      alt={belt.name_he}
      className="w-full h-full object-contain p-2"
      loading="lazy"
    />
  </div>
) : (
  <div 
    className="w-12 h-12 rounded-full border-4 flex-shrink-0"
    style={{
      borderColor: belt.color_hex,
      backgroundColor: belt.color_hex + '20'
    }}
  />
)}
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {belt.name_he}
                      </h3>
                      <p className="text-sm text-muted-foreground">{belt.name_en}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StylePage;
