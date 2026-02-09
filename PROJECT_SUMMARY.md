# Résumé du Projet : Système de Réservation Hôtelière

Ce document récapitule l'ensemble des fonctionnalités, la structure et les technologies utilisées dans le projet actuel.

## 🛠 Stack Technologique

*   **Backend** : Laravel (PHP)
    *   API RESTful avec Authentification Sanctum.
    *   Base de données MySQL.
*   **Frontend** : React (TypeScript) avec Vite
    *   Styling : Tailwind CSS (avec probablement Shadcn/UI).
    *   Gestion d'état et routage React Router.

## 📂 Structure du Projet

### 1. Backend (`hotel_backend`)
L'API gère la logique métier et la persistance des données.

*   **Contrôleurs Principaux (`app/Http/Controllers/API`)** :
    *   `AuthController` : Gestion de l'authentification (Connexion, Inscription, Déconnexion).
    *   `ChambreController` : Gestion des chambres (CRUD, Images, Recherche).
    *   `ReservationController` : Gestion des réservations clients et admin.
    *   `ContactController` : Gestion des messages de contact.
    *   `SettingController` : Paramètres globaux de l'application.

*   **Modèles de Données (`app/Models`)** :
    *   `Utilisateur` : Utilisateurs et Administrateurs.
    *   `Chambre` : Les chambres d'hôtel.
    *   `TypeChambre` : Catégories de chambres (ex: Suite, Standard).
    *   `ImageChambre` : Galerie photos des chambres.
    *   `Reservation` : Les commandes de réservation.
    *   `Contact` : Messages envoyés via le formulaire.

### 2. Frontend (`hotel_frontend`)
L'interface utilisateur permet aux clients de réserver et aux admins de gérer l'hôtel.

*   **Pages Publiques (`src/pages`)** :
    *   **Accueil (`Index.tsx`)** : Page d'accueil vitrine.
    *   **Chambres (`Rooms.tsx`)** : Liste des chambres disponibles avec filtres.
    *   **Détails Chambre (`RoomDetails.tsx`)** : Vue détaillée d'une chambre, galerie photo.
    *   **Contact (`Contact.tsx`)** : Formulaire de contact.
    *   **Authentification** : `Login.tsx` (Connexion), `Register.tsx` (Inscription).

*   **Espace Client** :
    *   **Profil (`Profile.tsx`)** : Gestion des infos personnelles.
    *   **Mes Réservations (`Reservations.tsx`)** : Historique et statut des réservations.
    *   **Favoris (`Favorites.tsx`)** : Liste des chambres favorites.

*   **Espace Administration (`src/pages/admin`)** :
    *   **Dashboard (`Dashboard.tsx`)** : Vue d'ensemble.
    *   **Gestion Chambres (`Rooms.tsx`)** : Ajout/Modification/Suppression des chambres.
    *   **Réservations (`AdminReservations.tsx`)** : Suivi et validation des réservations.
    *   **Messages (`Contacts.tsx`)** : Lecture des messages reçus.
    *   **Paramètres (`Settings.tsx`)** : Configuration du site.

## ✨ Fonctionnalités Clés Implémentées

1.  **Système de Réservation** :
    *   Calendrier de disponibilité.
    *   Calcul automatique des prix.
    *   Statuts de réservation (En attente, Confirmée, Terminée, Annulée).

2.  **Gestion des Chambres** :
    *   Upload d'images multiples.
    *   Classification par types et prix.
    *   Description riche et équipements.

3.  **Expérience Utilisateur** :
    *   Design responsive et moderne.
    *   Animations vidéo sur les pages.
    *   Système de favoris pour sauvegarder des chambres.

4.  **Administration** :
    *   Interface dédiée pour la gestion complète de l'hôtel sans toucher au code.

---
*Fichier généré automatiquement le 05/02/2026 à la demande de l'utilisateur.*
