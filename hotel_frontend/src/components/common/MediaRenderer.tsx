import { cn } from "@/lib/utils";
import { PanoramicViewer } from "./PanoramicViewer";

interface MediaRendererProps {
    src: string;
    type?: 'image' | 'video' | 'panorama';
    className?: string;
    alt?: string;
    autoPlay?: boolean;
    showFullscreen?: boolean;
    thumbnail?: boolean;
}

export const MediaRenderer = ({
    src,
    type,
    className,
    alt = "",
    autoPlay = true,
    showFullscreen = false,
    thumbnail = false
}: MediaRendererProps) => {
    const isVideo = type === 'video' || (src && !type && (
        src.endsWith('.mp4') ||
        src.endsWith('.webm') ||
        src.endsWith('.ogg') ||
        src.includes('youtube.com') ||
        src.includes('vimeo.com')
    ));

    const isPanorama = type === 'panorama';

    const commonClass = cn("w-full h-full object-cover", className);

    if (isPanorama && !thumbnail) {
        return <PanoramicViewer src={src} className={className} />;
    }

    if (isVideo) {
        return (
            <video
                src={src}
                className={commonClass}
                muted
                playsInline
                autoPlay={autoPlay}
                loop
                controls={showFullscreen}
            />
        );
    }

    return (
        <img
            src={src || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"}
            className={commonClass}
            alt={alt}
        />
    );
};
