import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-accent/30">
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                            <AlertTriangle size={48} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black font-display uppercase tracking-tight">404 - Page Introuvable</h1>
                    <p className="text-muted-foreground font-medium max-w-md mx-auto">
                        La page que vous recherchez semble ne pas exister ou a été déplacée.
                    </p>
                    <Link to="/">
                        <Button size="lg" className="bg-[#D4A017] hover:bg-[#B8860B] text-white">
                            Retour à l'accueil
                        </Button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default NotFound;
