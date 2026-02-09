import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppearance } from '@/context/AppearanceContext';
import { useSettings } from '@/context/SettingsContext';
import { Hotel, Bell, Shield, Palette, Share2, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface SocialNetwork {
  id: string;
  name: string;
  url: string;
}

const AdminSettings = () => {
  const { isDarkMode, toggleDarkMode } = useAppearance();
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hotel_name: '',
    hotel_address: '',
    hotel_phone: '',
    hotel_email: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data) {
        const { social_networks, ...otherSettings } = response.data;
        setSettings(prev => ({ ...prev, ...otherSettings }));

        // Parse social networks from settings
        if (social_networks) {
          try {
            setSocialNetworks(JSON.parse(social_networks));
          } catch (e) {
            // Migrate old format to new format
            const networks: SocialNetwork[] = [];
            if (response.data.social_facebook) {
              networks.push({ id: '1', name: 'Facebook', url: response.data.social_facebook });
            }
            if (response.data.social_instagram) {
              networks.push({ id: '2', name: 'Instagram', url: response.data.social_instagram });
            }
            if (response.data.social_twitter) {
              networks.push({ id: '3', name: 'Twitter / X', url: response.data.social_twitter });
            }
            setSocialNetworks(networks);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Impossible de charger les paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addSocialNetwork = () => {
    const newNetwork: SocialNetwork = {
      id: Date.now().toString(),
      name: '',
      url: ''
    };
    setSocialNetworks(prev => [...prev, newNetwork]);
  };

  const removeSocialNetwork = (id: string) => {
    setSocialNetworks(prev => prev.filter(network => network.id !== id));
  };

  const updateSocialNetwork = (id: string, field: 'name' | 'url', value: string) => {
    setSocialNetworks(prev => prev.map(network =>
      network.id === id ? { ...network, [field]: value } : network
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToSave = {
        ...settings,
        social_networks: JSON.stringify(socialNetworks)
      };
      await api.post('/admin/settings', { settings: settingsToSave });
      await refreshSettings();
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation) {
      toast.error('Veuillez remplir tous les champs du mot de passe');
      return;
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.put('/password', passwordData);
      toast.success('Mot de passe mis à jour avec succès');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.response?.data?.errors?.current_password) {
        toast.error(error.response.data.errors.current_password[0]);
      } else {
        toast.error("Erreur lors de la modification du mot de passe");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Configuration de l'établissement.</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#D4A017] hover:bg-[#B8860B] shadow-lg"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? 'Enregistrement...' : 'Enregistrer tout'}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Section Hôtel */}
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Hotel size={20} className="text-primary" /> Informations de l'Hôtel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nom de l'établissement</Label>
                <Input
                  value={settings.hotel_name}
                  onChange={(e) => handleChange('hotel_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Adresse postale</Label>
                <Input
                  value={settings.hotel_address}
                  onChange={(e) => handleChange('hotel_address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={settings.hotel_phone}
                    onChange={(e) => handleChange('hotel_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email de contact</Label>
                  <Input
                    value={settings.hotel_email}
                    onChange={(e) => handleChange('hotel_email', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Réseaux Sociaux */}
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex gap-2 items-center">
                <Share2 size={20} className="text-primary" /> Réseaux Sociaux
              </CardTitle>
              <Button
                onClick={addSocialNetwork}
                size="sm"
                variant="outline"
                className="border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white"
              >
                <Plus size={16} className="mr-1" /> Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialNetworks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Share2 className="mx-auto h-12 w-12 mb-2 opacity-20" />
                  <p className="text-sm">Aucun réseau social configuré</p>
                  <p className="text-xs mt-1">Cliquez sur "Ajouter" pour commencer</p>
                </div>
              ) : (
                socialNetworks.map((network) => (
                  <div key={network.id} className="flex gap-2 items-end border-b pb-4 last:border-0">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Nom du réseau</Label>
                      <Input
                        placeholder="ex: Facebook, LinkedIn, TikTok..."
                        value={network.name}
                        onChange={(e) => updateSocialNetwork(network.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Lien complet</Label>
                      <Input
                        placeholder="https://..."
                        value={network.url}
                        onChange={(e) => updateSocialNetwork(network.id, 'url', e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => removeSocialNetwork(network.id)}
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Section Apparence */}
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Palette size={20} className="text-primary" /> Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Mode sombre</p>
                  <p className="text-xs opacity-50">Changer le thème de l'interface admin</p>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Section Sécurité */}
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Shield size={20} className="text-primary" /> Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mot de passe actuel</Label>
                <Input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Nouveau mot de passe</Label>
                <Input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmer le nouveau mot de passe</Label>
                <Input
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
                />
              </div>
              <Button
                variant="outline"
                className="mt-2 w-full border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isChangingPassword ? 'Modification...' : 'Changer le mot de passe'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
