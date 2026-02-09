import { motion } from 'framer-motion';
import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

interface GalleryDoorProps {
    images: string[];
}

const GalleryDoor = ({ images }: GalleryDoorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl shadow-lg border-4 border-white dark:border-slate-800 group"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img
                            src={image}
                            alt={`Gallery ${index}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="text-white w-8 h-8" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>

                    <motion.img
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        src={selectedImage}
                        className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain border-4 border-white/10"
                        alt="Expanded view"
                    />
                </motion.div>
            )}
        </div>
    );
};

export default GalleryDoor;
