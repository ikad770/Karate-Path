import { Link } from "react-router-dom";
import { BookOpen, Home, Sword, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Sword className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">דרך הקראטה</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 ml-2" />
                ראשי
              </Button>
            </Link>
            <Link to="/dictionary">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 ml-2" />
                מילון
              </Button>
            </Link>
            <Link to="/culture">
              <Button variant="ghost" size="sm">
                תרבות
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 ml-2" />
                כניסה
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
