import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2, Send, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservationId: number;
    roomName: string;
    onSuccess?: () => void;
}

export const ReviewModal = ({ isOpen, onClose, reservationId, roomName, onSuccess }: ReviewModalProps) => {
    const { toast } = useToast();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 5) {
            toast({ title: 'Limite atteinte', description: 'Vous pouvez uploader maximum 5 images.', variant: 'destructive' });
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.length < 5) {
            toast({ title: 'Commentaire trop court', description: 'Veuillez écrire au moins 5 caractères.', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('reservation_id', reservationId.toString());
        formData.append('note', rating.toString());
        formData.append('commentaire', comment);
        images.forEach((image) => {
            formData.append('images[]', image);
        });

        try {
            await api.post('/reviews', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast({ title: 'Merci !', description: 'Votre avis a été soumis avec succès.' });
            onSuccess?.();
            onClose();
            // Reset form
            setRating(5);
            setComment('');
            setImages([]);
            setPreviews([]);
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.response?.data?.message || 'Une erreur est survenue lors de la soumission.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/10"
                    >
                        <div className="p-8 pb-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Votre Expérience</h2>
                                <p className="text-sm text-muted-foreground font-medium">{roomName}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
                            {/* Rating */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Votre Note</label>
                                <StarRating
                                    rating={rating}
                                    readonly={false}
                                    onRatingChange={setRating}
                                    size={40}
                                    className="justify-center py-4 bg-accent/20 rounded-2xl border border-primary/5"
                                />
                            </div>

                            {/* Comment */}
                            <div className="space-y-4">
                                <label htmlFor="comment" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Votre Avis</label>
                                <Textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Partagez votre expérience avec nous..."
                                    className="min-h-[120px] rounded-2xl bg-accent/20 border-none focus-visible:ring-1 focus-visible:ring-[#D4A017]/30 text-base font-medium p-6"
                                />
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Photos du séjour ({images.length}/5)</label>
                                    {images.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-[10px] font-black uppercase tracking-widest text-[#D4A017] hover:opacity-70 transition-opacity flex items-center gap-2"
                                        >
                                            <Upload size={14} /> Ajouter
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                />

                                {previews.length > 0 ? (
                                    <div className="grid grid-cols-5 gap-3">
                                        {previews.map((preview, i) => (
                                            <div key={preview} className="relative aspect-square rounded-xl overflow-hidden border border-border/10">
                                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {images.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-square rounded-xl border-2 border-dashed border-border/10 flex items-center justify-center text-muted-foreground hover:border-[#D4A017]/40 hover:text-[#D4A017] transition-all"
                                            >
                                                <ImageIcon size={20} />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-32 rounded-2xl border-2 border-dashed border-border/10 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-[#D4A017]/40 hover:text-[#D4A017] hover:bg-[#D4A017]/5 transition-all"
                                    >
                                        <Upload size={24} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Uploader des photos</span>
                                    </button>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-16 rounded-2xl bg-[#D4A017] hover:bg-[#B8860B] shadow-xl shadow-yellow-600/20 font-black uppercase tracking-widest text-base group"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (
                                    <>Envoyer Mon Avis <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
