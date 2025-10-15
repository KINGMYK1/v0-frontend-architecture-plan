# MSSP Health Check - Changelog

Toutes les modifications notables du projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [Non publié]

### Ajouté - 2025-01-14

#### Phase 1: Configuration Initiale
- Création de la structure du projet Next.js avec TypeScript
- Installation des dépendances principales:
  - React Router DOM pour le routing
  - TanStack Query (React Query) pour la gestion des données serveur
  - Zustand pour la gestion d'état UI
  - Recharts pour les graphiques
  - React Hook Form + Zod pour les formulaires
  - Axios pour les requêtes HTTP
  - react-hot-toast pour les notifications

#### Documentation
- Création du fichier TODO.md avec toutes les tâches identifiées
- Création du fichier CHANGELOG.md pour le suivi des modifications
- Création du fichier INTEGRATION_JWT.md avec guide d'intégration backend

#### Types et Constantes
- Définition des types TypeScript de base dans `lib/types.ts`:
  - User, Client, Audit, Alert, AuditControl
  - Types pour les statuts (AuditStatus, AlertSeverity, AlertStatus)
  - Types pour les rôles utilisateurs (UserRole)
- Création des constantes dans `lib/constants.ts`:
  - Credentials de test pour l'authentification mock
  - Configuration API
  - Catégories de contrôles
  - Couleurs de statuts
  - Items de navigation

#### Design System
- Mise à jour du thème dans `app/globals.css`:
  - Thème dark moderne inspiré de Vercel Dashboard
  - Palette de couleurs blue/cyan (pas de violet/indigo)
  - Couleurs de statuts: success (vert), warning (orange), critical (rouge)
  - Variables CSS pour les graphiques (chart-1 à chart-5)
  - Configuration sidebar avec couleurs dédiées

#### Phase 2: Authentification et Layout
- Création du store Zustand pour l'authentification (`lib/stores/auth-store.ts`)
- Implémentation des hooks d'authentification:
  - `useAuth`: Hook principal pour gérer l'authentification
  - `useRequireAuth`: Hook pour protéger les routes
- Développement de la page de connexion (`app/login/page.tsx`):
  - Formulaire avec validation React Hook Form + Zod
  - Design moderne avec thème dark
  - Credentials de test affichés
- Création du système de layout:
  - `MainLayout`: Layout principal avec sidebar et header
  - `Sidebar`: Navigation avec icônes, collapse/expand, filtrage par rôle
  - `Header`: Barre de recherche, notifications, menu utilisateur
- Store UI pour gérer l'état de la sidebar (`lib/stores/ui-store.ts`)

#### Phase 3: Dashboard Global
- Création des composants de dashboard:
  - `StatCard`: Cartes KPI réutilisables
  - `StatusChart`: Graphique donut pour répartition des statuts
  - `AlertsChart`: Graphique en barres pour top alertes
  - `ClientsTable`: Tableau des clients avec actions
  - `RecentAlerts`: Liste des alertes récentes
- Page dashboard complète (`app/dashboard/page.tsx`):
  - 4 cartes KPI (Total, OK, Warning, Critical)
  - 2 graphiques (répartition statuts, top alertes)
  - Tableau des clients récents
  - Liste des 10 dernières alertes
- Données mock réalistes dans `lib/mock-data.ts`

#### Phase 4: Gestion des Clients
- Création des composants clients:
  - `ClientFilters`: Filtres par recherche et statut
  - `ClientsList`: Tableau complet avec toutes les colonnes
  - `ClientModal`: Modal d'ajout/édition avec validation
- Page liste des clients (`app/clients/page.tsx`):
  - Statistiques en haut de page
  - Filtres avancés (recherche, statut)
  - Tableau avec actions (voir, auditer, éditer, supprimer)
  - Modal d'ajout/édition de client
- Intégration de react-hot-toast pour les notifications
- Données mock étendues (10 clients)

#### Phase 5: Détail Client
- Création des composants de détail:
  - `ClientHeader`: En-tête avec informations client et actions
  - `OverviewTab`: Vue d'ensemble avec résumé exécutif et métriques
  - `ControlsTab`: Affichage des contrôles par catégorie
  - `HistoryTab`: Graphiques d'évolution et historique des audits
- Page détail client (`app/clients/[id]/page.tsx`):
  - 6 onglets: Vue d'ensemble, Inventaire, Conformité, Détection, Santé KSC, Historique
  - 20 contrôles répartis dans les 4 catégories
  - Graphique d'évolution sur 30 jours
  - Historique des 5 derniers audits

#### Phase 6: Gestion des Alertes
- Création des composants d'alertes:
  - `AlertFilters`: Filtres par recherche, sévérité et statut
  - `AlertCard`: Carte d'alerte avec actions (acquitter, résoudre)
- Page liste des alertes (`app/alerts/page.tsx`):
  - Statistiques (total, actives, critiques, acquittées)
  - Filtres avancés multi-critères
  - Liste des alertes avec design moderne
  - Actions: Acquitter, Résoudre, Voir détails
  - Gestion d'état pour les actions sur les alertes
- Données mock étendues (10 alertes)

---

## [0.1.0] - 2025-01-14

### Initialisation du Projet
- Création du projet MSSP Health Check
- Configuration de base Next.js 15 avec App Router
- Configuration TypeScript et ESLint
- Mise en place de l'architecture frontend complète
