import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  LogOut,
  MoveRight,
  Sparkles,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thanks for subscribing!",
        description: "We'll keep you updated with the latest news.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen">
      {/* User Menu */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span>{user?.email}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent" />
        <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-up">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/5 text-primary mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome to our platform
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Create something
            <span className="text-primary/80"> beautiful</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Experience the perfect blend of form and function. Built with precision and care
            for those who appreciate the finer details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <button className="inline-flex items-center px-6 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              Learn More
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Carefully crafted with attention to every detail
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 hover-card"
              >
                <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for the latest updates and insights.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 md:mb-0">
            © 2024 Your Company. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: "Beautiful Design",
    description: "Carefully crafted interfaces that blend form and function seamlessly.",
    icon: <Sparkles className="w-6 h-6 text-primary" />,
  },
  {
    title: "Thoughtful Features",
    description: "Every feature is designed with purpose and attention to detail.",
    icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
  },
  {
    title: "Smooth Experience",
    description: "Enjoy a seamless experience with fluid animations and transitions.",
    icon: <MoveRight className="w-6 h-6 text-primary" />,
  },
];

export default Index;
