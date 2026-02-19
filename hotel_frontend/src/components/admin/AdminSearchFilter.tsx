import { Search, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AdminSearchFilterProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    searchPlaceholder?: string;
    count?: number;
    countLabel?: string;
    filterValue?: string;
    onFilterChange?: (val: string) => void;
    filterOptions?: { label: string; value: string }[];
    filterPlaceholder?: string;
    className?: string;
}

export const AdminSearchFilter = ({
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Rechercher...",
    count,
    countLabel = "Résultats",
    filterValue,
    onFilterChange,
    filterOptions,
    filterPlaceholder = "Filtrer",
    className
}: AdminSearchFilterProps) => {
    return (
        <Card className={cn("p-2 flex flex-col sm:flex-row gap-2 shadow-xl border-none bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-[2rem] overflow-hidden mb-10", className)}>
            <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#D4A017] opacity-50" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={e => onSearchChange(e.target.value)}
                    className="pl-12 h-11 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium"
                />
            </div>

            {filterOptions && onFilterChange && (
                <>
                    <div className="w-[1px] bg-border/50 hidden sm:block my-2"></div>
                    <Select value={filterValue} onValueChange={onFilterChange}>
                        <SelectTrigger className="w-full sm:w-56 h-11 border-none bg-transparent shadow-none focus:ring-0 uppercase text-[10px] font-black tracking-widest opacity-60">
                            <SelectValue placeholder={filterPlaceholder} />
                        </SelectTrigger>
                        <SelectContent className="border-none shadow-2xl rounded-2xl font-bold uppercase text-[10px] tracking-widest">
                            {filterOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </>
            )}

            {count !== undefined && (
                <div className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#D4A017] flex items-center gap-2 border-l border-border/50">
                    <Hash size={12} /> {count} {countLabel}
                </div>
            )}
        </Card>
    );
};
