import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
    // Reservations
    'en_attente': { label: 'En attente', color: 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' },
    'confirmee': { label: 'Confirmée', color: 'bg-green-100/80 text-green-800 dark:bg-green-500/20 dark:text-green-400' },
    'annulee': { label: 'Annulée', color: 'bg-red-100/80 text-red-800 dark:bg-red-500/20 dark:text-red-400' },
    'terminee': { label: 'Terminée', color: 'bg-blue-100/80 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400' },

    // Rooms
    'disponible': { label: 'Disponible', color: 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' },
    'maintenance': { label: 'Maintenance', color: 'bg-orange-100/80 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400' },
    'occupe': { label: 'Occupée', color: 'bg-red-100/80 text-red-800 dark:bg-red-500/20 dark:text-red-400' },

    // Contacts
    'nouveau': { label: 'Nouveau', color: 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' },
    'lu': { label: 'Lu', color: 'bg-orange-500/10 text-orange-500 border border-orange-500/20' },
    'traite': { label: 'Traité', color: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
        <Badge className={cn("border-none", config.color, className)}>
            {config.label}
        </Badge>
    );
};
