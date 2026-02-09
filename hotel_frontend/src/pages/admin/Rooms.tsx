import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search, Users, Maximize, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import api from '@/lib/axios';

const AdminRooms = () => {
  const { toast } = useToast();
  const [list, setList] = useState<any[]>([]), [q, setQ] = useState(''), [open, setOpen] = useState(false), [curr, setCurr] = useState<any>(null), [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<any[]>([]);
  const [imageSlots, setImageSlots] = useState<{ file: File | null, url: string, type: 'image' | 'video' }[]>([
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
    if (!curr.numero || !curr.type_chambre_id) return toast({ title: 'Champs requis', variant: 'destructive' });

    const formData = new FormData();
    formData.append('numero', curr.numero);
    formData.append('etage', curr.etage.toString());
    formData.append('type_chambre_id', curr.type_chambre_id.toString());
    formData.append('statut', curr.statut);

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
        // Pour Laravel, PUT avec FormData nécessite souvent _method: 'PUT'
        formData.append('_method', 'PUT');
        await api.post(`/admin/chambres/${curr.id}`, formData);
      } else {
        await api.post('/admin/chambres', formData);
      }
      setOpen(false);
      setImageSlots([
        { file: null, url: '', type: 'image' },
        { file: null, url: '', type: 'image' },
        { file: null, url: '', type: 'image' },
        { file: null, url: '', type: 'image' }
      ]);
      fetchRooms();
      toast({ title: 'Enregistré !' });
    } catch (e: any) {
      console.error('Error saving chambre:', e);
      console.error('Response:', e.response);
      let msg = "Erreur lors de l'enregistrement";
      if (e.response?.data?.errors) {
        msg = Object.values(e.response.data.errors).flat().join(', ');
      } else if (e.response?.data?.error) {
        msg = e.response.data.error;
      } else if (e.response?.data?.message) {
        msg = e.response.data.message;
      } else if (e.response?.status === 401) {
        msg = "Non autorisé - veuillez vous reconnecter";
      } else if (e.response?.status === 403) {
        msg = "Accès refusé - vous n'avez pas les droits admin";
      } else if (e.response?.status === 500) {
        msg = "Erreur serveur - vérifiez les logs Laravel";
      } else if (e.message) {
        msg = e.message;
      }
      toast({ title: 'Erreur', description: `${msg} (Status: ${e.response?.status || 'N/A'})`, variant: 'destructive' });
    }
  };

  const deleteRoom = async (id: number) => {
    try { await api.delete(`/admin/chambres/${id}`); fetchRooms(); toast({ title: 'Supprimé' }); }
    catch (e: any) {
      const msg = e.response?.data?.error || "Erreur lors de la suppression";
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div><h1 className="text-3xl font-bold font-display">Gestion des Chambres</h1><p className="text-sm opacity-50">{list.length} chambres dans l'inventaire</p></div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={() => {
              setCurr({ numero: '', etage: 1, type_chambre_id: types.length > 0 ? types[0].id : null, statut: 'disponible' });
              setImageSlots([
                { file: null, url: '', type: 'image' },
                { file: null, url: '', type: 'image' },
                { file: null, url: '', type: 'image' },
                { file: null, url: '', type: 'image' }
              ]);
            }} className="bg-[#D4A017]"><Plus className="mr-2" size={16} /> Ajouter une chambre</Button></DialogTrigger>
            <DialogContent className="max-w-2xl border-none shadow-2xl overflow-y-auto max-h-[90vh]">
              <DialogHeader><DialogTitle className="font-display text-2xl">{curr?.id ? 'Modifier la chambre' : 'Nouvelle chambre'}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Numéro de chambre</Label><Input placeholder="Ex: 101" value={curr?.numero} onChange={e => setCurr({ ...curr, numero: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Étage</Label><Input type="number" value={curr?.etage} onChange={e => setCurr({ ...curr, etage: parseInt(e.target.value) })} /></div>
                  <div className="space-y-2"><Label>Type de chambre</Label><Select value={curr?.type_chambre_id?.toString()} onValueChange={v => setCurr({ ...curr, type_chambre_id: parseInt(v) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{types.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.nom}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Photos & Vidéos de la chambre (Max 4)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {imageSlots.map((slot, i) => {
                        const isVideo = (file: File | null, url: string) => {
                          if (file) return file.type.startsWith('video/');
                          if (url) {
                            const ext = url.split('.').pop()?.split('?')[0].toLowerCase();
                            return ['mp4', 'mov', 'avi', 'wmv', 'webm', 'ogv'].includes(ext || '');
                          }
                          return false;
                        };
                        const mediaIsVideo = isVideo(slot.file, slot.url);

                        return (
                          <div key={i} className="flex flex-col gap-2 p-2 border rounded-lg bg-accent/20">
                            <div className="relative aspect-video rounded bg-black/5 overflow-hidden flex items-center justify-center">
                              {slot.file || slot.url ? (
                                <>
                                  {mediaIsVideo ? (
                                    <video src={slot.file ? URL.createObjectURL(slot.file) : slot.url} className="w-full h-full object-cover" muted />
                                  ) : (
                                    <img src={slot.file ? URL.createObjectURL(slot.file) : slot.url} className="w-full h-full object-cover" />
                                  )}
                                  <button onClick={() => {
                                    const newSlots = [...imageSlots];
                                    newSlots[i] = { file: null, url: '', type: 'image' };
                                    setImageSlots(newSlots);
                                  }} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full z-10"><Trash2 size={12} /></button>
                                  {mediaIsVideo && <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20"><div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center"><div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-black border-b-[4px] border-b-transparent ml-0.5"></div></div></div>}
                                </>
                              ) : <span className="text-[10px] opacity-30">Média {i + 1}</span>}
                            </div>
                            <div className="flex gap-1">
                              <div className="relative flex-1">
                                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] p-0"><Plus size={10} /> Fichier</Button>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,video/*" onChange={e => {
                                  if (e.target.files?.[0]) {
                                    const newSlots = [...imageSlots];
                                    newSlots[i] = { ...newSlots[i], file: e.target.files[0], url: '' };
                                    setImageSlots(newSlots);
                                  }
                                }} />
                              </div>
                              <Input placeholder="URL..." value={slot.url} onChange={e => {
                                const newSlots = [...imageSlots];
                                newSlots[i] = { ...newSlots[i], file: null, url: e.target.value };
                                setImageSlots(newSlots);
                              }} className="h-7 text-[10px] flex-[2]" />
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                              <Select
                                value={slot.type}
                                onValueChange={(v: any) => {
                                  const newSlots = [...imageSlots];
                                  newSlots[i].type = v;
                                  setImageSlots(newSlots);
                                }}
                              >
                                <SelectTrigger className="h-7 text-[9px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="image">📷 Image</SelectItem>
                                  <SelectItem value="video">🎥 Vidéo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-accent/30 rounded-lg space-y-2 border border-accent">
                    <p className="text-xs font-bold uppercase opacity-50">Détails du type sélectionné</p>
                    {types.find(t => t.id === curr?.type_chambre_id) ? (
                      <div className="text-sm">
                        <p><strong>Prix:</strong> {types.find(t => t.id === curr.type_chambre_id).prix_base} MAD</p>
                        <p><strong>Capacité:</strong> {types.find(t => t.id === curr.type_chambre_id).capacite} Pers.</p>
                      </div>
                    ) : <p className="text-xs italic">Aucun type sélectionné</p>}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl"><Label>Disponible</Label><Switch checked={curr?.statut === 'disponible'} onCheckedChange={v => setCurr({ ...curr, statut: v ? 'disponible' : 'maintenance' })} /></div>
                </div>
                <div className="md:col-span-2">
                  <Button className="w-full bg-[#D4A017] hover:bg-[#B8860B] h-12 text-lg shadow-lg" onClick={save}>
                    {curr?.id ? 'Enregistrer les modifications' : 'Ajouter la chambre'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md shadow-sm"><Search className="absolute left-3 top-3 h-4 w-4 opacity-30" /><Input placeholder="Filtrer par numéro ou type..." value={q} onChange={e => setQ(e.target.value)} className="pl-10 h-10 border-none bg-card" /></div>

        {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div> : (
          <div className="grid gap-6 md:grid-cols-3">
            {filtered.map(r => (
              <Card key={r.id} className="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm group hover:scale-[1.02] transition-transform">
                <div className="relative aspect-video">
                  {r.images?.[0]?.type_media === 'video' ? (
                    <video
                      src={r.images[0].chemin_image}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      autoPlay
                      loop
                    />
                  ) : (
                    <img src={r.images?.[0]?.chemin_image || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"} className="h-full w-full object-cover" alt="" />
                  )}
                  <Badge className={`absolute top-3 right-3 shadow-md border-none ${r.statut === 'disponible' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{r.statut === 'disponible' ? 'Disponible' : 'Hors-service'}</Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div><p className="text-xs uppercase tracking-tighter opacity-50 font-bold">{r.type_chambre?.nom}</p><h3 className="font-display text-xl font-bold">Chambre {r.numero}</h3></div>
                    <div className="text-right text-primary font-bold text-lg">{r.type_chambre?.prix_base} MAD</div>
                  </div>
                  <div className="flex gap-4 text-xs opacity-60 mb-6 font-medium"><span><Users size={14} className="inline mr-1" />{r.type_chambre?.capacite} Pers.</span><span><Maximize size={14} className="inline mr-1" />30m²</span></div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 shadow-sm h-10" onClick={() => {
                      setCurr(r);
                      const newSlots = [
                        { file: null, url: '', type: 'image' as const },
                        { file: null, url: '', type: 'image' as const },
                        { file: null, url: '', type: 'image' as const },
                        { file: null, url: '', type: 'image' as const }
                      ];
                      r.images?.forEach((img: any, i: number) => {
                        if (i < 4) {
                          newSlots[i].url = img.chemin_image;
                          newSlots[i].type = img.type_media || 'image';
                        }
                      });
                      setImageSlots(newSlots);
                      setOpen(true);
                    }}><Pencil size={14} className="mr-2" /> Modifier</Button>
                    <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="h-10 px-3"><Trash2 size={16} /></Button></AlertDialogTrigger>
                      <AlertDialogContent className="border-none shadow-2xl"><AlertDialogHeader><AlertDialogTitle className="font-display text-xl">Supprimer la chambre ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible et supprimera la chambre de l'inventaire.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Fermer</AlertDialogCancel><AlertDialogAction className="bg-destructive" onClick={() => deleteRoom(r.id)}>Confirmer la suppression</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
