import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search, Users, Maximize, Loader2, Image as ImageIcon, Sparkles, Hash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import api from '@/lib/axios';
import { getErrorMessage } from '@/lib/api-error';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MediaRenderer } from '@/components/common/MediaRenderer';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSearchFilter } from '@/components/admin/AdminSearchFilter';

const AdminRooms = () => {
  const { toast } = useToast();
  const [list, setList] = useState<any[]>([]), [q, setQ] = useState(''), [open, setOpen] = useState(false), [curr, setCurr] = useState<any>(null), [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageSlots, setImageSlots] = useState<{ file: File | null, url: string, type: 'image' | 'video' | 'panorama', previewUrl?: string }[]>([
    { file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }
  ]);

  const fetchRooms = () => {
    api.get('/admin/chambres').then(res => { setList(res.data.data || res.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
    api.get('/types-chambre').then(res => setTypes(res.data));
  }, []);

  const filtered = list.filter(r => r.numero?.toString().includes(q) || r.type_chambre?.nom?.toLowerCase().includes(q.toLowerCase()));

  const save = async () => {
    if (!curr.numero || !curr.type_chambre_id) return toast({ title: 'Erreur', description: 'Numéro et type requis', variant: 'destructive' });

    setSaving(true);
    const formData = new FormData();
    formData.append('numero', curr.numero);
    formData.append('etage', curr.etage.toString());
    formData.append('type_chambre_id', curr.type_chambre_id.toString());
    formData.append('statut', curr.statut);
    if (curr.atmosphere) formData.append('atmosphere', curr.atmosphere);
    if (curr.prix) formData.append('prix', curr.prix.toString());

    imageSlots.forEach((slot, index) => {
      if (slot.file) {
        formData.append('images[]', slot.file);
        formData.append(`media_types[${index}]`, slot.type);
      }
      else if (slot.url) {
        formData.append('image_urls[]', slot.url);
        formData.append(`media_types[${index}]`, slot.type);
      }
    });

    try {
      if (curr.id) {
        formData.append('_method', 'PUT');
        await api.post(`/admin/chambres/${curr.id}`, formData);
      } else {
        await api.post('/admin/chambres', formData);
      }
      setOpen(false);
      setImageSlots([{ file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }]);
      fetchRooms();
      toast({ title: 'Succès', description: 'Chambre enregistrée avec succès.' });
    } catch (e: any) {
      toast({ title: 'Erreur', description: getErrorMessage(e), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (id: number) => {
    try { await api.delete(`/admin/chambres/${id}`); fetchRooms(); toast({ title: 'Supprimée' }); }
    catch (e: any) { toast({ title: 'Erreur', description: getErrorMessage(e), variant: 'destructive' }); }
  };

  // Helper to handle file selection with preview cleanup
  const handleFileChange = (i: number, file: File) => {
    const ns = [...imageSlots];
    // Clean up old object URL if exists
    if (ns[i].previewUrl) URL.revokeObjectURL(ns[i].previewUrl!);

    ns[i] = {
      ...ns[i],
      file: file,
      url: '',
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    };
    setImageSlots(ns);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <AdminPageHeader
          title="Chambres"
          subtitle="Gestion de l'inventaire et des disponibilités."
          actions={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setCurr({ numero: '', etage: 1, type_chambre_id: types.length > 0 ? types[0].id : null, prix: '', statut: 'disponible' });
                  setImageSlots([{ file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }, { file: null, url: '', type: 'image' }]);
                }} className="bg-[#D4A017] hover:bg-[#B8860B] text-white h-14 px-8 rounded-2xl shadow-xl shadow-yellow-600/20 font-black uppercase tracking-widest text-[11px]">
                  <Plus className="mr-3" size={18} /> Nouvelle Chambre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl border-none shadow-2xl overflow-y-auto max-h-[95vh] rounded-[2.5rem] p-0 dark:bg-slate-900 scrollbar-hide">
                <DialogHeader className="p-8 bg-accent/30 border-b border-border/10">
                  <DialogTitle className="font-display text-2xl uppercase tracking-tighter flex items-center gap-3">
                    <Sparkles className="text-[#D4A017]" /> {curr?.id ? 'Modifier l\'unité' : 'Ajouter une unité'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 bg-card">
                  <div className="space-y-6">
                    <div className="space-y-2"><Label htmlFor="numero" className="text-[10px] font-black uppercase tracking-widest opacity-40">Numéro de Chambre</Label><Input id="numero" placeholder="Ex: 101" value={curr?.numero} onChange={e => setCurr({ ...curr, numero: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl" /></div>
                    <div className="space-y-2"><Label htmlFor="etage" className="text-[10px] font-black uppercase tracking-widest opacity-40">Étage</Label><Input id="etage" type="number" value={curr?.etage} onChange={e => setCurr({ ...curr, etage: parseInt(e.target.value) })} className="h-12 bg-accent/30 border-none rounded-xl" /></div>
                    <div className="space-y-2">
                      <Label htmlFor="categorie" className="text-[10px] font-black uppercase tracking-widest opacity-40">Catégorie</Label>
                      <Select value={curr?.type_chambre_id?.toString()} onValueChange={v => setCurr({ ...curr, type_chambre_id: parseInt(v) })}>
                        <SelectTrigger id="categorie" className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="border-none shadow-2xl rounded-xl font-bold uppercase text-[10px] tracking-widest">
                          {types.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.nom}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prix" className="text-[10px] font-black uppercase tracking-widest opacity-40">Prix par nuit (MAD)</Label>
                      <Input id="prix" type="number" placeholder="Laisser vide pour utiliser le prix par défaut" value={curr?.prix || ''} onChange={e => setCurr({ ...curr, prix: e.target.value })} className="h-12 bg-accent/30 border-none rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="atmosphere" className="text-[10px] font-black uppercase tracking-widest opacity-40">Atmosphère / Mood</Label>
                      <Select value={curr?.atmosphere} onValueChange={v => setCurr({ ...curr, atmosphere: v })}>
                        <SelectTrigger id="atmosphere" className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Choisir une ambiance" /></SelectTrigger>
                        <SelectContent className="border-none shadow-2xl rounded-xl font-bold uppercase text-[10px] tracking-widest">
                          <SelectItem value="calm">😌 Relax & Calm</SelectItem>
                          <SelectItem value="romantic">❤️ Romantic Stay</SelectItem>
                          <SelectItem value="work">💼 Work & Focus</SelectItem>
                          <SelectItem value="family">👨‍👩‍👧 Family Time</SelectItem>
                          <SelectItem value="luxury">👑 Luxury Experience</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-6 bg-[#D4A017]/5 border border-[#D4A017]/10 rounded-[1.5rem] flex items-center justify-between"><div className="space-y-0.5"><Label htmlFor="visibility" className="font-black uppercase text-[11px] tracking-widest leading-none">Visibilité</Label><p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter leading-none">Disponible à la réservation</p></div><Switch id="visibility" checked={curr?.statut === 'disponible'} onCheckedChange={v => setCurr({ ...curr, statut: v ? 'disponible' : 'maintenance' })} className="data-[state=checked]:bg-emerald-500" /></div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4"><Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Galerie Médias</Label><span className="text-[9px] font-black uppercase text-[#D4A017]">Max 4 items</span></div>
                    <div className="grid grid-cols-2 gap-3">
                      {imageSlots.map((slot, i) => (
                        <div key={i} className="flex flex-col gap-2 p-3 border border-border/10 rounded-2xl bg-accent/10 group/slot transition-all">
                          <div className="relative aspect-video rounded-xl bg-black/10 overflow-hidden flex items-center justify-center">
                            {slot.file || slot.url ? (
                              <>
                                <div className="absolute inset-0 z-0 opacity-80"><MediaRenderer src={slot.previewUrl || slot.url} type={slot.type as any} thumbnail={true} /></div>
                                <button onClick={() => {
                                  if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
                                  const ns = [...imageSlots]; ns[i] = { file: null, url: '', type: 'image' }; setImageSlots(ns);
                                }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg z-10 hover:scale-110 transition-transform"><Trash2 size={12} /></button>
                              </>
                            ) : <ImageIcon className="opacity-10" size={24} />}
                          </div>
                          <div className="flex gap-1">
                            <label className="relative flex-1 cursor-pointer group/btn">
                              <div className="w-full h-8 flex items-center justify-center text-[9px] font-black uppercase tracking-widest bg-white/50 border border-border/10 rounded-lg hover:bg-white transition-colors">File</div>
                              <input type="file" className="hidden" accept="image/*,video/*" onChange={e => {
                                if (e.target.files?.[0]) handleFileChange(i, e.target.files[0]);
                              }} />
                            </label>
                            <Input placeholder="URL..." value={slot.url} onChange={e => {
                              const ns = [...imageSlots]; ns[i] = { ...ns[i], file: null, url: e.target.value, previewUrl: undefined }; setImageSlots(ns);
                            }} className="h-8 text-[9px] flex-[1.5] border-none bg-white dark:bg-slate-800 transition-all focus:ring-1 ring-[#D4A017]/20 rounded-lg" />
                          </div>
                          <Select value={slot.type} onValueChange={(v: any) => {
                            const ns = [...imageSlots]; ns[i].type = v; setImageSlots(ns);
                          }}>
                            <SelectTrigger className="h-8 text-[9px] font-black uppercase tracking-[0.2em] border-none bg-white/50 rounded-lg"><SelectValue /></SelectTrigger>
                            <SelectContent className="border-none shadow-xl rounded-xl text-[9px] font-bold uppercase tracking-widest">
                              <SelectItem value="image">📷 Image</SelectItem>
                              <SelectItem value="video">🎥 Vidéo</SelectItem>
                              <SelectItem value="panorama">🌐 Panorama 360°</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button size="lg" disabled={saving} className="md:col-span-2 w-full bg-[#D4A017] hover:bg-[#B8860B] h-14 text-sm font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-yellow-600/20" onClick={save}>
                    {saving ? <Loader2 className="animate-spin mr-2" /> : null}
                    {saving ? 'Enregistrement...' : 'Valider les modifications'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        <AdminSearchFilter
          searchQuery={q}
          onSearchChange={setQ}
          searchPlaceholder="Filtre par numéro ou type..."
          count={filtered.length}
          countLabel="Unités"
        />

        {loading ? <div className="p-32 flex flex-col items-center justify-center gap-4 text-[#D4A017] opacity-40"><Loader2 className="animate-spin" size={48} /><p className="font-black uppercase tracking-[0.2em] text-xs">Inventaire en cours...</p></div> : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filtered.map((r, idx) => (
              <motion.div key={r.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                <Card className="overflow-hidden border-none shadow-2xl bg-card rounded-[2.5rem] group hover:scale-[1.03] transition-all duration-500 relative">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <MediaRenderer src={r.images?.[0]?.chemin_image} type={r.images?.[0]?.type_media} className="transition-transform duration-[2s] group-hover:scale-110" thumbnail={true} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    <StatusBadge status={r.statut} className="absolute top-6 right-6 shadow-xl uppercase font-black tracking-widest text-[9px] px-4 py-2 border-none backdrop-blur-md" />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase text-[#D4A017] font-black tracking-[0.2em]">{r.type_chambre?.nom}</p>
                        <h3 className="font-display text-2xl font-black uppercase tracking-tighter">Chambre #{r.numero}</h3>
                      </div>
                      <div className="text-xl font-black tracking-tighter text-emerald-500">{formatCurrency(r.prix || r.type_chambre?.prix_base)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-border/5 py-4">
                      <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-primary"><Users size={14} /></div><span className="text-[10px] font-black uppercase opacity-40">{r.type_chambre?.capacite} Pers.</span></div>
                      <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-primary"><Maximize size={14} /></div><span className="text-[10px] font-black uppercase opacity-40">30 m²</span></div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button variant="outline" size="lg" className="flex-1 h-14 rounded-2xl border-[#D4A017]/20 text-[#D4A017] hover:bg-[#D4A017] hover:text-white font-black uppercase tracking-widest text-[10px] shadow-sm transition-all duration-500" onClick={() => {
                        setCurr(r);
                        const ns = imageSlots.map(() => ({ file: null, url: '', type: 'image' as const }));
                        r.images?.forEach((img: any, i: number) => { if (i < 4) { ns[i].url = img.chemin_image; ns[i].type = img.type_media || 'image'; } });
                        setImageSlots(ns); setOpen(true);
                      }}><Pencil size={18} className="mr-3" /> Éditer</Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={24} /></Button></AlertDialogTrigger>
                        <AlertDialogContent className="border-none shadow-2xl rounded-[2.5rem] p-10 bg-white dark:bg-slate-900"><AlertDialogHeader><AlertDialogTitle className="font-display text-2xl uppercase tracking-tighter">Supprimer cette unité ?</AlertDialogTitle><AlertDialogDescription className="text-sm font-medium opacity-60 italic py-2">Cette action supprimera définitivement la chambre #{r.numero} de votre inventaire.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter className="pt-6 gap-3"><AlertDialogCancel className="h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] dark:bg-slate-800 dark:border-none">Abandonner</AlertDialogCancel><AlertDialogAction className="bg-red-500 hover:bg-red-600 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] px-8" onClick={() => deleteRoom(r.id)}>Confirmer la Suppression</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
