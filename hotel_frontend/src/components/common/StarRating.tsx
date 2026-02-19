import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    max?: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
    className?: string;
}

export const StarRating = ({
    rating,
    max = 5,
    onRatingChange,
    readonly = true,
    size = 20,
    className
}: StarRatingProps) => {
    return (
        <div className={cn("flex items-center gap-1", className)}>
            {Array.from({ length: max }).map((_, i) => {
                const starValue = i + 1;
                const isActive = starValue <= rating;

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={readonly}
                        onClick={() => onRatingChange?.(starValue)}
                        className={cn(
                            "transition-all duration-200",
                            readonly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95",
                            isActive ? "text-yellow-400" : "text-muted-foreground/30"
                        )}
                    >
                        <Star
                            size={size}
                            className={cn(
                                "transition-all",
                                isActive ? "fill-current" : "fill-none"
                            )}
                            strokeWidth={isActive ? 1 : 2}
                        />
                    </button>
                );
            })}
        </div>
    );
};
