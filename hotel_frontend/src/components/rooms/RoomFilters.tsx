import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar, Users, Search, X } from 'lucide-react';
import { roomTypes } from '@/lib/data';

interface RoomFiltersProps {
  onFilter: (filters: FilterState) => void;
}

export interface FilterState {
  checkIn: string;
  checkOut: string;
  guests: number;
  type: string;
  priceRange: [number, number];
}

const RoomFilters = ({ onFilter }: RoomFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    checkIn: '',
    checkOut: '',
    guests: 1,
    type: 'all',
    priceRange: [0, 10000],
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      checkIn: '',
      checkOut: '',
      guests: 1,
      type: 'all',
      priceRange: [0, 10000],
    };
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-lg">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {/* Check-in */}
        <div className="space-y-2">
          <Label htmlFor="checkIn" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            Arrivée
          </Label>
          <Input
            id="checkIn"
            type="date"
            value={filters.checkIn}
            onChange={(e) => handleFilterChange('checkIn', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <Label htmlFor="checkOut" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            Départ
          </Label>
          <Input
            id="checkOut"
            type="date"
            value={filters.checkOut}
            onChange={(e) => handleFilterChange('checkOut', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label htmlFor="guests" className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4 text-primary" />
            Personnes
          </Label>
          <Select
            value={filters.guests.toString()}
            onValueChange={(value) => handleFilterChange('guests', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nombre" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'personne' : 'personnes'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Type de chambre</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {Object.entries(roomTypes).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Prix: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} MAD
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
            min={0}
            max={10000}
            step={100}
            className="mt-4"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={() => onFilter(filters)} className="flex-1 md:flex-none">
          <Search className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          <X className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default RoomFilters;
