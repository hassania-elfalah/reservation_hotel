import { Room } from "./data";

export const mapApiRoom = (r: any): Room => {
    const nomType = r.type_chambre?.nom || '';
    let type: 'single' | 'double' | 'suite' | 'deluxe' = 'double';

    if (nomType.toLowerCase().includes('simpl')) type = 'single';
    else if (nomType.toLowerCase().includes('doubl')) type = 'double';
    else if (nomType.toLowerCase().includes('suite') || nomType.toLowerCase().includes('lux')) type = 'suite';
    else if (nomType.toLowerCase().includes('deluxe') || nomType.toLowerCase().includes('roy')) type = 'deluxe';

    return {
        id: r.id.toString(),
        name: r.type_chambre?.nom ? `${r.type_chambre.nom} #${r.numero}` : `Chambre ${r.numero}`,
        type: type,
        price: r.prix || r.type_chambre?.prix_base || 0,
        capacity: r.type_chambre?.capacite || 2,
        size: r.type_chambre?.superficie || 30,
        amenities: r.type_chambre?.commodites ? r.type_chambre.commodites.split(',') : ['WiFi', 'TV', 'Climatisation'],
        images: r.images?.length > 0
            ? r.images.map((img: any) => ({
                chemin_image: img.chemin_image,
                type_media: img.type_media || 'image'
            }))
            : [{ chemin_image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', type_media: 'image' }],
        description: r.type_chambre?.description || '',
        available: r.statut === 'disponible',
        atmosphere: r.atmosphere
    };
};
