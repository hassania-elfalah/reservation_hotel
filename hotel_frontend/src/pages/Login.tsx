import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

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
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

    const onSubmit = async (v: any) => {
        setLoading(true);
        try {
            const { data } = await api.post('/login', v);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success(`Bienvenue ${data.user.name}`);
            navigate(data.user.role === 'admin' ? '/admin' : '/');
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Erreur de connexion');
        } finally { setLoading(false); }
    };

    return (
        <div className="flex min-h-screen">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden lg:flex w-3/5 bg-cover bg-center relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070)' }}>
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-12 text-white">
                    <img src="/logo.png" className="h-32 w-fit bg-white/10 p-4 rounded-3xl" alt="Logo" />
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold mb-4">Votre séjour d'exception commence ici.</h2>
                        <p className="opacity-80">Connectez-vous pour un service personnalisé.</p>
                    </div>
                    <p className="text-sm opacity-50">© 2026 Hôtel Excellence.</p>
                </div>
            </motion.div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <img src="/logo.png" className="h-24 lg:hidden mx-auto" alt="" />
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">Connexion</h1>
                        <p className="text-muted-foreground mt-2">Bienvenue ! Entrez vos coordonnées.</p>
                    </div>

                    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <LoginField control={form.control} name="email" label="Email" icon={Mail} placeholder="votre@email.com" />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center"><FormLabel>Mot de passe</FormLabel><Link to="/forgot" className="text-sm text-primary hover:underline">Oublié ?</Link></div>
                            <LoginField control={form.control} name="password" icon={Lock} type="password" placeholder="••••••" />
                        </div>
                        <Button className="w-full h-11 bg-[#D4A017] hover:bg-[#B8860B]" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>}
                        </Button>
                    </form></Form>

                    <p className="text-center text-sm">Pas de compte ? <Link to="/register" className="text-primary font-bold hover:underline">S'inscrire</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
