import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, ArrowRight, Loader2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

const schema = z.object({
    fullName: z.string().min(2, "Nom trop court"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(10, "Téléphone invalide"),
    password: z.string().min(6, "6 chars min"),
    confirmPassword: z.string()
}).refine(d => d.password === d.confirmPassword, { message: "Mismatach", path: ["confirmPassword"] });

const RegField = ({ control, name, label, icon: Icon, type = "text", placeholder }: any) => (
    <FormField control={control} name={name} render={({ field }) => (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl><div className="relative">
                <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type={type} placeholder={placeholder} {...field} className="pl-10" />
            </div></FormControl>
            <FormMessage />
        </FormItem>
    )} />
);

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const form = useForm({ resolver: zodResolver(schema), defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' } });

    const onSubmit = async (v: any) => {
        setLoading(true);
        try {
            await api.post('/register', { nom: v.fullName, email: v.email, password: v.password, password_confirmation: v.confirmPassword, telephone: v.phone });
            toast.success('Compte créé !');
            navigate('/login');
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Erreur');
        } finally { setLoading(false); }
    };

    return (
        <div className="flex min-h-screen">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080)' }}>
                <div className="absolute inset-0 bg-black/60 p-12 text-white flex flex-col justify-between">
                    <img src="/logo.png" className="h-32 w-fit bg-white/10 p-4 rounded-3xl" alt="" />
                    <div><h2 className="text-4xl font-bold mb-4">Rejoignez l'élite du voyage.</h2><p className="opacity-80">Débloquez des avantages exclusifs dès maintenant.</p></div>
                    <p className="text-sm opacity-50">© 2026 Hôtel Excellence.</p>
                </div>
            </motion.div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">Créer un compte</h1>
                        <p className="text-muted-foreground mt-2">Commencez votre expérience avec nous.</p>
                    </div>

                    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <RegField control={form.control} name="fullName" label="Nom complet" icon={User} placeholder="Jean Dupont" />
                        <RegField control={form.control} name="email" label="Email" icon={Mail} placeholder="votre@email.com" />
                        <RegField control={form.control} name="phone" label="Téléphone" icon={Phone} placeholder="+212 ..." />
                        <div className="grid grid-cols-2 gap-4">
                            <RegField control={form.control} name="password" label="Pass" icon={Lock} type="password" placeholder="••••••" />
                            <RegField control={form.control} name="confirmPassword" label="Confirm" icon={Lock} type="password" placeholder="••••••" />
                        </div>
                        <Button className="w-full h-11 bg-[#D4A017] hover:bg-[#B8860B] mt-4" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <>S'inscrire <ArrowRight className="ml-2 h-4 w-4" /></>}
                        </Button>
                    </form></Form>

                    <p className="text-center text-sm">Déjà un compte ? <Link to="/login" className="text-primary font-bold hover:underline">Se connecter</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
