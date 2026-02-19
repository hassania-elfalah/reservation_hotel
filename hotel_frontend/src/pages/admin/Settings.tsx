import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppearance } from '@/context/AppearanceContext';
import { useSettings } from '@/context/SettingsContext';
import { Hotel, Shield, Palette, Share2, Loader2, Save, Plus, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { getErrorMessage } from '@/lib/api-error';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { motion } from 'framer-motion';

interface SocialNetwork {
  id: string;
  name: string;
  url: string;
}

const AdminSettings = () => {
  const { isDarkMode, toggleDarkMode } = useAppearance();
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({ hotel_name: '', hotel_address: '', hotel_phone: '', hotel_email: '', hotel_map_link: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data) {
        const { social_networks, logo_url, ...other } = res.data;
        setSettings(prev => ({ ...prev, ...other }));
        if (logo_url) setLogoPreview(logo_url);
        if (social_networks) {
          try { setSocialNetworks(JSON.parse(social_networks)); }
          catch {
            const nets: SocialNetwork[] = [];
            if (res.data.social_facebook) nets.push({ id: 'f', name: 'Facebook', url: res.data.social_facebook });
            if (res.data.social_instagram) nets.push({ id: 'i', name: 'Instagram', url: res.data.social_instagram });
            setSocialNetworks(nets);
          }
        }
      }
    } catch (e) { toast.error(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('settings[hotel_name]', settings.hotel_name);
      formData.append('settings[hotel_address]', settings.hotel_address);
      formData.append('settings[hotel_phone]', settings.hotel_phone);
      formData.append('settings[hotel_email]', settings.hotel_email);
      formData.append('settings[hotel_map_link]', settings.hotel_map_link);
      formData.append('settings[social_networks]', JSON.stringify(socialNetworks));

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      await api.post('/admin/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await refreshSettings();
      toast.success('Paramètres enregistrés avec succès');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) return toast.error('Mots de passe différents');
    setIsChangingPassword(true);
    try {
      await api.put('/password', passwordData);
      toast.success('Mot de passe mis à jour');
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (e) { toast.error(getErrorMessage(e)); }
    finally { setIsChangingPassword(false); }
  };

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-[60vh] text-[#D4A017] opacity-40 flex-col gap-4"><Loader2 className="animate-spin" size={48} /><p className="font-black uppercase tracking-widest text-xs">Configuration...</p></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <AdminPageHeader
          title="Paramètres"
          subtitle="Configuration globale de l'établissement."
          actions={
            <Button onClick={handleSave} disabled={saving} className="bg-[#D4A017] hover:bg-[#B8860B] text-white h-14 px-8 rounded-2xl shadow-xl shadow-yellow-600/20 font-black uppercase tracking-widest text-[11px]">
              {saving ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : <Save className="mr-3 h-4 w-4" />}
              {saving ? 'Sauvegarde...' : 'Enregistrer tout'}
            </Button>
          }
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 bg-accent/30 border-b border-border/10"><CardTitle className="flex gap-3 items-center text-xl font-display uppercase tracking-tight"><Hotel size={20} className="text-[#D4A017]" /> Informations Générales</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-6">
                {['hotel_name', 'hotel_address', 'hotel_phone', 'hotel_email'].map(k => (
                  <div key={k} className="space-y-2">
                    <Label htmlFor={k} className="text-[10px] font-black uppercase tracking-widest opacity-40">{k.replace('hotel_', '').replace('_', ' ')}</Label>
                    <Input id={k} value={(settings as any)[k]} onChange={e => setSettings({ ...settings, [k]: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl font-medium" />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label htmlFor="hotel_map_link" className="text-[10px] font-black uppercase tracking-widest opacity-40">Lien Google Maps (Optionnel)</Label>
                  <Input id="hotel_map_link" placeholder="https://goo.gl/maps/..." value={settings.hotel_map_link} onChange={e => setSettings({ ...settings, hotel_map_link: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl font-medium" />
                  <p className="text-[9px] opacity-40 uppercase font-bold">Si vide, l'adresse texte sera utilisée pour la recherche.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] overflow-hidden h-full">
              <CardHeader className="p-8 bg-accent/30 border-b border-border/10 flex flex-row items-center justify-between">
                <CardTitle className="flex gap-3 items-center text-xl font-display uppercase tracking-tight"><Share2 size={20} className="text-[#D4A017]" /> Réseaux Sociaux</CardTitle>
                <Button onClick={() => setSocialNetworks([...socialNetworks, { id: Date.now().toString(), name: '', url: '' }])} size="sm" variant="outline" className="h-10 px-4 rounded-xl border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white font-black uppercase tracking-widest text-[9px]"><Plus size={14} className="mr-2" /> Ajouter</Button>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {socialNetworks.length > 0 ? socialNetworks.map(n => (
                  <div key={n.id} className="flex gap-4 items-end bg-accent/10 p-4 rounded-2xl border border-border/5">
                    <div className="flex-1 space-y-2"><Label htmlFor={`social-name-${n.id}`} className="text-[9px] font-black uppercase tracking-widest opacity-40">Nom</Label><Input id={`social-name-${n.id}`} placeholder="ex: Instagram" value={n.name} onChange={e => setSocialNetworks(socialNetworks.map(x => x.id === n.id ? { ...x, name: e.target.value } : x))} className="h-10 text-sm bg-white dark:bg-slate-800 border-none rounded-lg" /></div>
                    <div className="flex-1 space-y-2"><Label htmlFor={`social-url-${n.id}`} className="text-[9px] font-black uppercase tracking-widest opacity-40">Lien URL</Label><Input id={`social-url-${n.id}`} placeholder="https://..." value={n.url} onChange={e => setSocialNetworks(socialNetworks.map(x => x.id === n.id ? { ...x, url: e.target.value } : x))} className="h-10 text-sm bg-white dark:bg-slate-800 border-none rounded-lg" /></div>
                    <Button onClick={() => setSocialNetworks(socialNetworks.filter(x => x.id !== n.id))} size="icon" variant="ghost" className="text-red-400 hover:text-red-500 hover:bg-red-50 h-10 w-10 transition-colors"><Trash2 size={18} /></Button>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-20 gap-4">
                    <Share2 size={48} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Aucun réseau configuré</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 bg-accent/30 border-b border-border/10"><CardTitle className="flex gap-3 items-center text-xl font-display uppercase tracking-tight"><Palette size={20} className="text-[#D4A017]" /> Logo & Identité</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-accent/20 border-2 border-dashed border-[#D4A017]/30 flex items-center justify-center transition-all group-hover:border-[#D4A017]">
                      {logoPreview ? (
                        <img
                          src={logoPreview.startsWith('data:') ? logoPreview : (logoPreview.startsWith('/') && !logoPreview.startsWith('/storage') ? logoPreview : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${logoPreview}`)}
                          alt="Logo"
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <Hotel className="w-12 h-12 text-[#D4A017] opacity-20" />
                      )}
                    </div>
                    <Label htmlFor="logo-upload" className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Plus className="text-white w-8 h-8" />
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLogoFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setLogoPreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Logo Officiel</p>
                    <p className="text-[9px] opacity-40 uppercase font-bold mt-1">Format recommandé: PNG 512x512</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-accent/20 p-6 rounded-[1.5rem] border border-border/5">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode" className="font-bold text-sm uppercase tracking-tight cursor-pointer">Mode Sombre Universel</Label>
                    <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest">Activer l'interface nuit</p>
                  </div>
                  <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} className="data-[state=checked]:bg-[#D4A017]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 bg-accent/30 border-b border-border/10"><CardTitle className="flex gap-3 items-center text-xl font-display uppercase tracking-tight"><Shield size={20} className="text-[#D4A017]" /> Sécurité du Compte</CardTitle></CardHeader>
              <CardContent className="p-8 space-y-6">
                {['current_password', 'new_password', 'new_password_confirmation'].map(k => (
                  <div key={k} className="space-y-2">
                    <Label htmlFor={k} className="text-[10px] font-black uppercase tracking-widest opacity-40">{k.replace(/_/g, ' ')}</Label>
                    <Input id={k} type="password" value={(passwordData as any)[k]} onChange={e => setPasswordData({ ...passwordData, [k]: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl" />
                  </div>
                ))}
                <Button variant="outline" className="w-full h-14 rounded-2xl border-[#D4A017]/20 text-[#D4A017] hover:bg-[#D4A017] hover:text-white font-black uppercase tracking-widest text-[11px] mt-4 shadow-sm transition-all duration-500" onClick={handlePassword} disabled={isChangingPassword}>
                  {isChangingPassword ? <Loader2 className="animate-spin mr-3" /> : <Sparkles className="mr-3" size={18} />}
                  {isChangingPassword ? 'Traitement...' : 'Sauvegarder les nouveaux accès'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
