import { Link } from 'react-router-dom';
import { Room, roomTypes } from '@/lib/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Maximize, Wifi, Tv, Wind, Eye, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { MediaRenderer } from '@/components/common/MediaRenderer';
import { formatCurrency } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
  onBook?: (room: Room) => void;
}

const RoomCard = ({ room, onBook }: RoomCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(room.id));
  }, [room.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== room.id);
      toast.info(`${room.name} retiré des favoris`);
    } else {
      newFavorites = [...favorites, room.id];
      toast.success(`${room.name} ajouté aux favoris`);
    }

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);

    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <MediaRenderer
          src={typeof room.images[0] === 'object' ? (room.images[0] as any).chemin_image : room.images[0]}
          type={typeof room.images[0] === 'object' ? (room.images[0] as any).type_media : undefined}
          className="transition-transform duration-500 group-hover:scale-110"
          thumbnail={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <button
          onClick={toggleFavorite}
          className={cn(
            "absolute right-4 top-4 z-10 p-2 rounded-full transition-all duration-300",
            isFavorite
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/20 text-white backdrop-blur-md hover:bg-white/40"
          )}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>

        {!room.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Non Disponible
            </Badge>
          </div>
        )}

        <div className="absolute left-4 top-4 flex gap-2">
          <Badge className="bg-primary text-primary-foreground border-none">
            {roomTypes[room.type]}
          </Badge>
          {room.atmosphere && (
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 uppercase text-[9px] tracking-widest font-black">
              ✨ {room.atmosphere}
            </Badge>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-xl font-bold text-white">{room.name}</h3>
          <p className="text-white/80 text-sm mt-1">
            {formatCurrency(room.price)} / nuit
          </p>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.capacity} pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{room.size} m²</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {room.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
            >
              {amenity === 'WiFi' && <Wifi className="h-3 w-3" />}
              {amenity.includes('TV') && <Tv className="h-3 w-3" />}
              {amenity === 'Climatisation' && <Wind className="h-3 w-3" />}
              {amenity}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              +{room.amenities.length - 4}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t p-5">
        <div className="flex w-full gap-3">
          <Link to={`/rooms/${room.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Détails
            </Button>
          </Link>
          <Button
            className="flex-1 bg-[#D4A017] hover:bg-[#B8860B]"
            disabled={!room.available}
            onClick={() => onBook?.(room)}
          >
            Réserver
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
