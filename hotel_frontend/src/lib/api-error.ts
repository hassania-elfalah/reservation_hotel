export const getErrorMessage = (e: any): string => {
    let msg = "Erreur lors de l'enregistrement";
    if (e.response?.data?.errors) {
        msg = Object.values(e.response.data.errors).flat().join(', ');
    } else if (e.response?.data?.error) {
        msg = e.response.data.error;
    } else if (e.response?.data?.message) {
        msg = e.response.data.message;
    } else if (e.response?.status === 401) {
        msg = "Non autorisé - veuillez vous reconnecter";
    } else if (e.response?.status === 403) {
        msg = "Accès refusé - vous n'avez pas les droits admin";
    } else if (e.response?.status === 500) {
        msg = "Erreur serveur - vérifiez les logs Laravel";
    } else if (e.message) {
        msg = e.message;
    }
    return msg;
};
