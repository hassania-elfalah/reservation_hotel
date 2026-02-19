import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "6 caractères min")
});

const LoginField = ({ control, name, label, icon: Icon, type = "text", placeholder }: any) => (
    <FormField control={control} name={name} render={({ field }) => (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl><div className="relative">
                <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type={type} placeholder={placeholder} {...field} className="pl-10 h-11" />
            </div></FormControl>
            <FormMessage />
        </FormItem>
    )} />
);

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

    const onSubmit = async (v: any) => {
        setLoading(true);
        try {
            const user = await login(v) as any;
            const redirectPath = user?.role === 'admin' ? '/admin' : ((location.state as any)?.from?.pathname || '/');
            navigate(redirectPath, { replace: true });
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Erreur de connexion');
        } finally { setLoading(false); }
    };

    return (
        <AuthLayout
            title="Connexion"
            subtitle="Bienvenue ! Entrez vos coordonnées."
            image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
            sideTitle="Votre séjour d'exception commence ici."
            sideSubtitle="Connectez-vous pour un service personnalisé."
        >
            <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <LoginField control={form.control} name="email" label="Email" icon={Mail} placeholder="votre@email.com" />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem className="space-y-2">
                        <div className="flex justify-between items-center">
                            <FormLabel>Mot de passe</FormLabel>
                            <Link to="/forgot" className="text-sm text-primary hover:underline">Oublié ?</Link>
                        </div>
                        <FormControl>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="••••••" {...field} className="pl-10 h-11" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button className="w-full h-11 bg-[#D4A017] hover:bg-[#B8860B]" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
            </form></Form>

            <p className="text-center text-sm">Pas de compte ? <Link to="/register" className="text-primary font-bold hover:underline">S'inscrire</Link></p>
        </AuthLayout>
    );
};

export default Login;
