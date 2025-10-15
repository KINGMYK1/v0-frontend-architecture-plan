# MSSP Health Check - Roadmap de Développement

## Vue d'Ensemble du Projet

**Nom**: MSSP Health Check  
**Version**: 1.0  
**Date de Création**: 13 Octobre 2025  
**Objectif**: Automatiser 100% des contrôles de santé de sécurité via une plateforme web centralisée pour MSSP gérant la sécurité de multiples clients via Kaspersky Security Center.

### Gains Attendus
- **Productivité**: 80% de temps économisé (6-10h/jour)
- **Qualité**: Surveillance exhaustive et systématique
- **Réactivité**: Détection immédiate des problèmes critiques (<5 min)

---

## Architecture Technique

### Stack Technologique

#### Backend
- **Framework**: Spring Boot 3.2+ (Java 17+)
- **Sécurité**: Spring Security (JWT & RBAC)
- **Base de données**: PostgreSQL 15+ (principal) + Redis 7+ (cache & sessions)
- **ORM**: Spring Data JPA avec Hibernate
- **Planification**: Spring Scheduler / Quartz
- **HTTP Client**: RestTemplate / WebClient (API Kaspersky)
- **Résilience**: Resilience4j (retry logic & circuit breaker)
- **Email**: Spring Mail
- **Mapping**: MapStruct (entités ↔ DTOs)
- **Utilitaires**: Lombok

#### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand (client state) + React Query (server state)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Routing**: Next.js App Router

#### DevOps
- **Conteneurisation**: Docker + Docker Compose
- **Reverse Proxy**: Nginx (HTTPS/TLS 1.3)
- **Build**: Maven (backend)
- **CI/CD**: GitLab CI / GitHub Actions

### Architecture Globale

\`\`\`
[Users] → [Nginx HTTPS] → [Frontend React]
                        ↓
                [Spring Boot Backend]
                    (Port 8080)
                        ↓
            [PostgreSQL] + [Redis]
                        ↓
            [@Scheduled Tasks] ← Spring Scheduler
                        ↓
            [Kaspersky Security Centers (N clients)]
                        ↓
                [SMTP + Slack/Teams]
\`\`\`

### Modèle de Données

#### Tables Principales
1. **users** (email, role, password_hash)
2. **clients** (name, ksc_url, ksc_credentials_encrypted, audit_schedule)
3. **thresholds** (seuils globaux ou par client)
4. **audits** (results JSON, metrics, global_status)
5. **alerts** (severity, status, control_id, details JSON)
6. **logs** (level, category, action, details JSON)

#### Relations
- Client → Audits (1:N)
- Audit → Alerts (1:N)
- Client → Thresholds (1:1 optionnel pour personnalisation)

---

## Fonctionnalités Essentielles

### 1. Gestion Multi-Clients
- **CRUD complet**: Créer, lire, mettre à jour, supprimer des clients
- **Champs requis**:
  - Nom du client
  - URL KSC (Kaspersky Security Center)
  - Credentials API (chiffrés avec AES-256)
  - Email de contact
  - Planning d'audit (heure, fuseau horaire, fréquence)
- **Fonctionnalités**:
  - Test de connexion à l'ajout
  - Activation/désactivation
  - Configuration des seuils personnalisés par client

### 2. Audits Automatisés - 20 Contrôles

#### Catégorie 1: Inventaire & Visibilité (5 contrôles)
- **C1.1**: Machines non connectées (>7j: Warning, >30j: Critique)
- **C1.2**: Conformité versions agents
- **C1.3**: Statut module EDR
- **C1.4**: État agents d'administration
- **C1.5**: Statistiques globales d'inventaire

#### Catégorie 2: Conformité & Hardening (5 contrôles)
- **C2.1**: Politiques de sécurité actives
- **C2.2**: Tâches de scan (taux de succès >95%)
- **C2.3**: Tâches de mise à jour
- **C2.4**: Fraîcheur bases antivirus serveur (<24h)
- **C2.5**: Fraîcheur bases machines (<7j pour 95%)

#### Catégorie 3: Détection & Réponse (6 contrôles)
- **C3.1**: Menaces actives non résolues (≥1 = Critique)
- **C3.2**: Machines infectées
- **C3.3**: Protection temps réel désactivée
- **C3.4**: Erreurs critiques système
- **C3.5**: Objets en quarantaine
- **C3.6**: Vulnérabilités critiques non corrigées

#### Catégorie 4: Santé Serveur KSC (4 contrôles)
- **C4.1**: État du service KSC (uptime)
- **C4.2**: Performance (CPU >90%, RAM >95%, Disque <20Go)
- **C4.3**: Validité licence (<30j = Critique)
- **C4.4**: Expiration certificats + dernière sauvegarde

### 3. Système d'Alerting

#### Génération
- Automatique selon seuils configurables
- Déduplication intelligente (incrémentation si alerte existe)

#### Cycle de Vie
- **ACTIVE** → **ACKNOWLEDGED** → **RESOLVED** (auto)
- Expiration: ACTIVE >30j sans signalement → EXPIRED

#### Notifications
- **Email immédiat** pour alertes CRITIQUES
- **Résumé quotidien** pour WARNINGS
- Templates HTML professionnels

### 4. Dashboards & Visualisation

#### Dashboard Global
- **KPI**: Total clients, OK/Warning/Critique (%)
- **Graphiques**:
  - Donut (répartition statuts)
  - Barres (top alertes)
  - Ligne (évolution 7 jours)
- **Tableau clients** avec tri/filtres
- **10 dernières alertes** toutes catégories

#### Dashboard Client
- **Résumé exécutif** (points positifs/négatifs/actions)
- **7 onglets**:
  1. Vue d'ensemble
  2. Inventaire & Visibilité
  3. Conformité & Hardening
  4. Détection & Réponse
  5. Santé Serveur KSC
  6. Historique
  7. Configuration
- **Cartes détaillées** par contrôle avec données et tableaux
- **Historique** 30 derniers audits avec graphiques d'évolution

### 5. Rapports

#### Formats
- **HTML**: Consultable dans l'interface avec graphiques
- **PDF**: Généré à la demande ou en pièce jointe email

#### Contenu
- Page de garde
- Résumé exécutif
- Détails par catégorie
- Liste alertes
- Annexes

### 6. Gestion Utilisateurs & Permissions

#### 3 Rôles
1. **Admin**: Tout (CRUD clients, config, users)
2. **Technicien SOC**: Lecture + audit manuel + acquittement alertes
3. **Manager**: Lecture seule + export rapports

#### Fonctionnalités
- CRUD utilisateurs
- Gestion des rôles et permissions
- Historique des connexions
- Statistiques d'activité

---

## Intégration Kaspersky API

### Authentification
- **JWT** via `/api/v1.0/auth/login`
- Token valide 1h, renouvelé automatiquement

### Endpoints KSC Utilisés
- `HostGroup.FindHosts` - Liste machines + filtres
- `Host.GetHostInfo` - Détails machine
- `Policies.*` - Politiques de sécurité
- `Tasks.*` - Tâches scan/update
- `Events.*` - Événements (menaces, erreurs)
- `Server.GetStatistics` - CPU, RAM, uptime
- `Vulnerabilities.*` - CVE critiques
- `Update.GetLastUpdateInfo` - Bases AV

### Gestion Erreurs
- **Retry**: 3 tentatives avec backoff exponentiel (1min, 5min, 15min)
- **Timeout**: 30s par requête
- **Circuit breaker**: Arrêt si serveur KSC down
- **Cache**: 5 min sur résultats pour éviter surcharge

---

## Sécurité

### Authentification & Autorisation
- **JWT**: Access token (1h) + Refresh token (7j)
- **RBAC**: 3 rôles avec permissions différenciées
- **Passwords**: bcrypt (cost 12), min 8 caractères, 1 maj/min/chiffre

### Chiffrement
- **En transit**: HTTPS/TLS 1.3 obligatoire
- **Au repos**: Credentials KSC chiffrés (AES-256)
- **Clé**: Variable d'environnement séparée de la DB

### Protection
- **Rate limiting**: Login (5/15min), API (100/min)
- **CSRF**: Protection via JWT en headers
- **SQL Injection**: ORM avec paramètres bindés
- **XSS**: React échappe automatiquement + CSP headers

### Audit Trail
- Logs complets: Auth, CRUD clients, audits, alertes, modifications config
- Format: timestamp, user, IP, action, détails JSON

---

## Règles Métier Critiques

### Statut Global d'un Audit
- **CRITIQUE**: ≥1 contrôle critique
- **AVERTISSEMENT**: ≥1 warning ET 0 critique
- **OK**: Tous contrôles OK

### Alertes
- **Déduplication**: Alerte identique existante → incrémentation compteur
- **Auto-résolution**: Si contrôle OK au prochain audit
- **Expiration**: ACTIVE >30j sans signalement → EXPIRED

### Seuils
- **Globaux**: Par défaut pour tous
- **Personnalisés**: Surcharge possible par client
- **Exemples critiques**:
  - Machines déconnectées: 30 jours
  - Bases serveur obsolètes: 48h
  - CPU/RAM serveur: >90%/95%
  - Licence: <30 jours expiration

### Rétention Données
- **Audits**: 90 jours
- **Alertes résolues**: 90 jours
- **Logs**: 365 jours
- **Cache Redis**: 5 minutes

---

## API REST - Endpoints Principaux

### Authentification
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Renouveler token

### Clients
- `GET/POST /api/v1/clients` - Liste/Créer
- `GET/PUT/DELETE /api/v1/clients/{id}` - Détail/Modifier/Supprimer
- `POST /api/v1/clients/{id}/test-connection` - Test API KSC
- `POST /api/v1/clients/{id}/audits/run` - Audit manuel

### Audits
- `GET /api/v1/audits/{id}` - Résultats complets
- `GET /api/v1/audits/{id}/status` - Progression temps réel

### Alertes
- `GET /api/v1/alerts` - Liste avec filtres (client, severity, status, date)
- `PATCH /api/v1/alerts/{id}/acknowledge` - Acquitter

### Rapports
- `GET /api/v1/reports/{audit_id}` - HTML
- `GET /api/v1/reports/{audit_id}/pdf` - PDF
- `POST /api/v1/reports/{audit_id}/email` - Envoyer par email

### Configuration
- `GET/PUT /api/v1/config/thresholds` - Seuils globaux
- `GET/PUT /api/v1/config/thresholds/{client_id}` - Seuils client

### Utilisateurs
- `GET/POST /api/v1/users` - Liste/Créer
- `GET/PUT/DELETE /api/v1/users/{id}` - Détail/Modifier/Supprimer

---

## Principes SOLID

### Single Responsibility Principle (SRP)
- Chaque classe/composant a une seule responsabilité
- Séparation claire: Controllers, Services, Repositories, DTOs
- Composants React focalisés sur une seule fonctionnalité

### Open/Closed Principle (OCP)
- Ouvert à l'extension, fermé à la modification
- Utilisation d'interfaces et d'abstractions
- Stratégies pour différents types de contrôles

### Liskov Substitution Principle (LSP)
- Les sous-classes doivent être substituables à leurs classes parentes
- Respect des contrats d'interface

### Interface Segregation Principle (ISP)
- Interfaces spécifiques plutôt que générales
- Pas de dépendances inutiles

### Dependency Inversion Principle (DIP)
- Dépendre d'abstractions, pas de concrétions
- Injection de dépendances (Spring DI)

---

## Design Patterns

### Backend
1. **Repository Pattern**: Abstraction de la couche de données
2. **Service Layer Pattern**: Logique métier séparée
3. **DTO Pattern**: Transfert de données entre couches
4. **Factory Pattern**: Création d'objets complexes (contrôles d'audit)
5. **Strategy Pattern**: Différentes stratégies de contrôle
6. **Observer Pattern**: Notifications d'alertes
7. **Singleton Pattern**: Services partagés

### Frontend
1. **Component Pattern**: Composants réutilisables
2. **Container/Presentational Pattern**: Séparation logique/présentation
3. **Custom Hooks Pattern**: Logique réutilisable
4. **Provider Pattern**: Context API pour état global
5. **Compound Components Pattern**: Composants composés

---

## Conventions de Code

### Backend (Java/Spring Boot)
- **Naming**:
  - Classes: PascalCase
  - Méthodes/variables: camelCase
  - Constantes: UPPER_SNAKE_CASE
  - Packages: lowercase
- **Structure**:
  \`\`\`
  com.mssp.healthcheck
  ├── controller
  ├── service
  ├── repository
  ├── model
  ├── dto
  ├── config
  ├── security
  └── util
  \`\`\`
- **Annotations**: Utiliser les annotations Spring appropriées
- **Exceptions**: Gestion centralisée avec @ControllerAdvice
- **Logging**: SLF4J avec Logback

### Frontend (React/TypeScript)
- **Naming**:
  - Composants: PascalCase
  - Fichiers: kebab-case
  - Fonctions/variables: camelCase
  - Types/Interfaces: PascalCase
- **Structure**:
  \`\`\`
  src/
  ├── app/              # Pages Next.js
  ├── components/       # Composants réutilisables
  ├── lib/              # Utilitaires, types, stores
  ├── hooks/            # Custom hooks
  └── styles/           # Styles globaux
  \`\`\`
- **TypeScript**: Typage strict, pas de `any`
- **Props**: Interfaces pour tous les props
- **State**: Zustand pour client, React Query pour serveur

### Git
- **Branches**:
  - `main`: Production
  - `develop`: Développement
  - `feature/*`: Nouvelles fonctionnalités
  - `bugfix/*`: Corrections de bugs
  - `hotfix/*`: Corrections urgentes
- **Commits**: Messages clairs et descriptifs
  - Format: `type(scope): message`
  - Types: feat, fix, docs, style, refactor, test, chore

---

## Tâches de Développement

### Phase 1: MVP (Priorité Haute)
- [x] Setup projet frontend (React + TypeScript + Tailwind)
- [x] Authentification mock (JWT simulation)
- [x] Layout principal (Header + Sidebar)
- [x] Dashboard global avec KPIs
- [x] Page liste clients avec CRUD
- [x] Page détail client avec onglets
- [x] Page liste alertes avec filtres
- [x] Page profil utilisateur
- [x] Page gestion utilisateurs (admin)
- [x] Page configuration seuils client
- [x] Page rapport d'audit
- [ ] Setup projet backend (Spring Boot)
- [ ] Configuration base de données (PostgreSQL + Redis)
- [ ] Implémentation authentification JWT réelle
- [ ] API CRUD clients
- [ ] Intégration API Kaspersky
- [ ] Implémentation des 20 contrôles d'audit
- [ ] Système d'alerting
- [ ] Planification audits automatiques

### Phase 2: Fonctionnalités Avancées (Priorité Moyenne)
- [ ] Génération rapports PDF
- [ ] Envoi emails (alertes + rapports)
- [ ] Configuration seuils personnalisés
- [ ] Historique audits avec graphiques
- [ ] Export données (CSV, Excel)
- [ ] Logs d'audit complets
- [ ] Tests unitaires (backend)
- [ ] Tests composants (frontend)

### Phase 3: Optimisation & Sécurité (Priorité Moyenne)
- [ ] Optimisation performances (cache, queries)
- [ ] Rate limiting
- [ ] Chiffrement credentials KSC
- [ ] Audit de sécurité
- [ ] Tests d'intégration
- [ ] Tests end-to-end
- [ ] Documentation API (Swagger)
- [ ] Documentation utilisateur

### Phase 4: Production (Priorité Haute)
- [ ] Configuration Docker
- [ ] Configuration Nginx
- [ ] CI/CD pipeline
- [ ] Monitoring (logs, métriques)
- [ ] Backup automatique
- [ ] Plan de reprise d'activité
- [ ] Formation utilisateurs
- [ ] Déploiement production

---

## Critères de Succès

### MVP (Phase 1)
- 3+ clients configurés et audités
- 5 contrôles prioritaires 100% fonctionnels
- Alertes email envoyées correctement
- 0 bugs bloquants

### Complet (Phase 2)
- 20 contrôles implémentés et testés
- Audits quotidiens auto pour tous clients actifs
- Rapports PDF sans erreur
- Temps moyen audit <5 min
- Satisfaction users >8/10

### Long Terme
- Réduction temps surveillance: 80%
- Détection incidents critiques: <5 min
- Capacité: 100+ clients sans dégradation
- Uptime: >99.5%

---

## Risques & Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| API KSC instable | Élevé | Moyen | Retry logic robuste (3×), circuit breaker |
| Volume de données élevé | Moyen | Élevé | Optimisation queries dès début, cache Redis |
| Complexité métier | Moyen | Moyen | Validation régulière avec utilisateurs SOC |
| Scope creep | Élevé | Élevé | Focus strict sur MVP, board Kanban discipliné |
| Absence environnement test KSC | Critique | Faible | Obtenir accès dès semaine 1 |

---

## Ressources & Références

### Documentation Technique
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Kaspersky API Documentation](https://support.kaspersky.com/KSC/13/en-US/api.htm)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

### Outils de Développement
- **IDE Backend**: IntelliJ IDEA / Eclipse
- **IDE Frontend**: VS Code
- **API Testing**: Postman / Insomnia
- **Database**: pgAdmin / DBeaver
- **Version Control**: Git / GitHub / GitLab

---

**Document maintenu par**: Équipe de développement MSSP Health Check  
**Dernière mise à jour**: 15 Janvier 2025
