import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Users, Sword, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

interface Style {
  id: string;
  name_he: string;
  name_en: string;
  name_ja: string | null;
  description: string | null;
  image_url: string | null;
}

const Index = () => {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStyles = async () => {
      const { data } = await supabase
        .from("styles")
        .select("*")
        .order("display_order");
      if (data) setStyles(data);
      setLoading(false);
    };
    fetchStyles();
  }, []);

  return (
    <div className="min-h-screen bg-background pattern-seigaiha">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient-primary">空手道</span>
              <br />
              <span className="text-foreground">דרך הקראטה</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              למד קראטה בצורה מקצועית ומובנית. בחר את הסגנון שלך והתחל את המסע לחגורה שחורה.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="#styles">
                <Button size="lg" className="glow-primary">
                  <GraduationCap className="ml-2 h-5 w-5" />
                  התחל ללמוד
                </Button>
              </Link>
              <Link to="/dictionary">
                <Button size="lg" variant="outline">
                  <BookOpen className="ml-2 h-5 w-5" />
                  מילון מונחים
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sword, title: "6 סגנונות קראטה", desc: "שוטוקאן, קיוקושין, גוג'ו-ריו ועוד" },
              { icon: GraduationCap, title: "מסלול לחגורה שחורה", desc: "תוכנית לימודים מקיפה לכל דרגה" },
              { icon: Users, title: "מילון תלת-לשוני", desc: "עברית, אנגלית ויפנית" },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-lg bg-card border border-border card-hover animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles Grid */}
      <section id="styles" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">בחר סגנון קראטה</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            כל סגנון מציע גישה ייחודית לאומנות הלחימה. בחר את הסגנון שמדבר אליך.
          </p>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {styles.map((style, i) => (
                <Link key={style.id} to={`/style/${style.id}`}>
                  <div 
                    className="group relative h-64 rounded-lg overflow-hidden border border-border card-hover bg-gradient-card animate-scale-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="font-japanese text-2xl text-accent mb-1">{style.name_ja}</div>
                      <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{style.name_he}</h3>
                      <p className="text-sm text-muted-foreground">{style.name_en}</p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{style.description}</p>
                    </div>
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                      <Sword className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dictionary">
              <Button variant="outline" size="lg">מילון מונחים</Button>
            </Link>
            <Link to="/culture">
              <Button variant="outline" size="lg">תרבות יפנית</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 דרך הקראטה - כל הזכויות שמורות</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
