import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Stream Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The page you're looking for doesn't exist or the stream has ended.
        </p>
        <Link to="/">
          <Button className="gradient-primary text-primary-foreground font-semibold hover:opacity-90">
            <Zap className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
