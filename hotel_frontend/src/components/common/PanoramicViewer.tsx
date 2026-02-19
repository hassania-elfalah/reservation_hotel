import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import axios from 'axios';

interface PanoramicViewerProps {
    src: string;
    className?: string;
}

declare global {
    interface Window {
        pannellum: any;
    }
}

export const PanoramicViewer = ({ src, className }: PanoramicViewerProps) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const viewerInstance = useRef<any>(null);
    const [loading, setLoading] = useState(true);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!src) return;

        // Rewrite storage URL to use the media proxy route which has CORS enabled f development
        const targetUrl = src.includes('/storage/') ? src.replace('/storage/', '/api/media/') : src;

        // Fetch the image as a blob to bypass CORS static file issues
        const fetchImage = async () => {
            try {
                setLoading(true);
                console.log("Fetching panorama from:", targetUrl);
                // Use axios directly instead of the 'api' instance to avoid baseURL prefixing
                const response = await axios.get(targetUrl, {
                    responseType: 'blob',
                });
                const url = URL.createObjectURL(response.data);
                console.log("Panorama blob created:", url);
                setBlobUrl(url);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching panorama blob:", error);
                setLoading(false);
                setBlobUrl(src); // Fallback
            }
        };

        fetchImage();

        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [src]);

    useEffect(() => {
        const initViewer = () => {
            if (!window.pannellum || !blobUrl || !viewerRef.current) return;

            // Destroy existing instance if any
            if (viewerInstance.current) {
                try {
                    viewerInstance.current.destroy();
                } catch (e) {
                    console.error("Error destroying pannellum viewer", e);
                }
            }

            viewerInstance.current = window.pannellum.viewer(viewerRef.current, {
                type: 'equirectangular',
                panorama: blobUrl,
                autoLoad: true,
                autoRotate: -2,
                compass: false,
                showZoomCtrl: true,
                showFullscreenCtrl: true,
                mouseZoom: true,
                hfov: 110,
            });
        };

        // If pannellum isn't loaded yet, wait for it
        if (!window.pannellum) {
            const interval = setInterval(() => {
                if (window.pannellum) {
                    initViewer();
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        } else {
            initViewer();
        }

        return () => {
            if (viewerInstance.current) {
                try {
                    viewerInstance.current.destroy();
                } catch (e) {
                    console.error("Error destroying pannellum viewer in cleanup", e);
                }
            }
        };
    }, [blobUrl]);

    if (!src) return null;

    // Filter out image-only classes like object-cover/contain which break divs
    const containerClasses = className?.replace(/object-cover|object-contain/g, '');

    return (
        <div className={cn("relative overflow-hidden bg-black flex items-center justify-center min-h-[400px] md:min-h-[500px] w-full", containerClasses)} style={{ width: '100%', height: '100%' }}>
            {(loading || !window.pannellum) && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white/50 bg-slate-900 border border-white/10 italic text-sm gap-3">
                    <div className="w-6 h-6 border-2 border-[#D4A017] border-t-transparent animate-spin rounded-full"></div>
                    Chargement de l'espace 360°...
                </div>
            )}
            <div
                ref={viewerRef}
                className="w-full h-full absolute inset-0"
            />
        </div>
    );
};
