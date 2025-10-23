# MSSP Health Check - Roadmap Développeur Complet

## Vue d'Ensemble du Projet

**Nom**: MSSP Health Check
**Version**: 1.0
**Date**: 13 Octobre 2025
**Objectif**: Automatiser 100% des contrôles de santé de sécurité via une plateforme web centralisée pour MSSP gérant la sécurité de multiples clients via Kaspersky Security Center.

### Context Business
MSSP gérant la sécurité de multiples clients via Kaspersky Security Center. Actuellement, contrôles manuels quotidiens prenant 2-4h/jour avec risques d'erreurs.

### Gains Attendus
- **Productivité**: 80% de temps économisé (6-10h/jour)
- **Qualité**: Surveillance exhaustive et systématique
- **Réactivité**: Détection immédiate des problèmes critiques (<5 min)

---

## Architecture Technique

### Stack Technologique

#### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2+ (Java 17+)
- **Sécurité**: Spring Security (JWT & RBAC)
- **Base de données**: PostgreSQL 15+ (principal) + Redis 7+ (cache & sessions)
- **ORM**: Spring Data JPA avec Hibernate
- **Planification**: Spring Scheduler / Quartz (audits quotidiens automatiques)
- **HTTP Client**: RestTemplate / WebClient (API Kaspersky)
- **Résilience**: Resilience4j (retry logic & circuit breaker)
- **Email**: Spring Mail
- **Mapping**: MapStruct (entités ↔ DTOs)
- **Utilitaires**: Lombok

#### Frontend (Next.js + React)
- **Framework**: React 18 + TypeScript + Next.js 15 (App Router)
- **Build Tool**: Vite / Next.js
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (client state) + React Query (server state)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast/Sonner

#### DevOps
- **Conteneurisation**: Docker + Docker Compose
- **Reverse Proxy**: Nginx (HTTPS/TLS 1.3)
- **Build**: Maven (backend)
- **CI/CD**: GitLab CI / GitHub Actions

### Architecture Globale

```
[Users] → [Nginx HTTPS] → [Frontend React/Next.js]
            ↓
    [Spring Boot Backend] (Port 8080)
            ↓
    [PostgreSQL] + [Redis]
            ↓
    [@Scheduled Tasks] ← Spring Scheduler (Audits quotidiens)
            ↓
    [Kaspersky Security Centers (N clients)]
            ↓
    [SMTP + Slack/Teams] (Notifications)
```

### Modèle de Données Clé

#### Tables Principales

**users**
- id (UUID, PK)
- email (unique, not null)
- password_hash (bcrypt, cost 12)
- role (ENUM: ADMIN, TECHNICIEN_SOC, MANAGER)
- created_at, updated_at

**clients**
- id (UUID, PK)
- name (varchar, not null)
- ksc_url (varchar, not null)
- ksc_credentials_encrypted (text, AES-256)
- audit_schedule (cron expression)
- is_active (boolean, default true)
- created_at, updated_at

**thresholds**
- id (UUID, PK)
- client_id (UUID, FK nullable - null = global)
- control_id (varchar)
- warning_threshold (numeric)
- critical_threshold (numeric)
- is_custom (boolean)

**audits**
- id (UUID, PK)
- client_id (UUID, FK)
- started_at, completed_at
- global_status (ENUM: OK, WARNING, CRITICAL)
- results_json (JSONB) -- 20 contrôles avec détails
- metrics (JSONB) -- métriques agrégées

**alerts**
- id (UUID, PK)
- audit_id (UUID, FK)
- client_id (UUID, FK)
- control_id (varchar)
- severity (ENUM: WARNING, CRITICAL)
- status (ENUM: ACTIVE, ACKNOWLEDGED, RESOLVED, EXPIRED)
- title (varchar)
- message (text)
- details_json (JSONB)
- count (int, default 1) -- déduplication
- created_at
- acknowledged_at, acknowledged_by
- resolved_at

**logs**
- id (UUID, PK)
- timestamp
- user_id (UUID, FK nullable)
- level (ENUM: INFO, WARNING, ERROR)
- category (varchar)
- action (varchar)
- details_json (JSONB)
- ip_address

#### Relations
- Client → Audits (1:N)
- Audit → Alerts (1:N)
- Client → Thresholds (1:1 optionnel pour personnalisation)

---

## Fonctionnalités Essentielles

### 1. Gestion Multi-Clients

**Opérations CRUD**:
- Créer/Modifier/Supprimer des clients
- Nom, URL KSC, credentials API chiffrés (AES-256)
- Test de connexion à l'ajout (validation credentials)
- Configuration planning d'audit par client (cron)
- Activation/désactivation

**Endpoints API**:
```
POST   /api/v1/clients                     - Créer client
GET    /api/v1/clients                     - Liste clients
GET    /api/v1/clients/{id}                - Détail client
PUT    /api/v1/clients/{id}                - Modifier client
DELETE /api/v1/clients/{id}                - Supprimer client
POST   /api/v1/clients/{id}/test-connection - Test connexion KSC
POST   /api/v1/clients/{id}/audits/run     - Lancer audit manuel
```

### 2. Audits Automatisés - 20 Contrôles

#### Catégorie 1: Inventaire & Visibilité (5 contrôles)

**C1.1 - Machines non connectées**
- Seuil Warning: >7 jours
- Seuil Critical: >30 jours
- Endpoint KSC: `HostGroup.FindHosts` avec filtre lastSeen

**C1.2 - Conformité versions agents**
- Vérifier que 95%+ des agents sont à jour
- Endpoint KSC: `Host.GetHostInfo` pour chaque machine

**C1.3 - Statut module EDR**
- Vérifier que EDR est actif sur toutes les machines critiques
- Endpoint KSC: `Host.GetHostInfo` (modules)

**C1.4 - État agents d'administration**
- Vérifier que agents d'administration sont opérationnels

**C1.5 - Statistiques globales d'inventaire**
- Nombre total de machines, OS, répartition

#### Catégorie 2: Conformité & Hardening (5 contrôles)

**C2.1 - Politiques de sécurité actives**
- Toutes les politiques obligatoires sont actives
- Endpoint KSC: `Policies.*`

**C2.2 - Tâches de scan**
- Taux de succès >95%
- Endpoint KSC: `Tasks.*`

**C2.3 - Tâches de mise à jour**
- Taux de succès >95%
- Endpoint KSC: `Tasks.*`

**C2.4 - Fraîcheur bases antivirus serveur**
- Seuil Warning: >24h
- Seuil Critical: >48h
- Endpoint KSC: `Update.GetLastUpdateInfo`

**C2.5 - Fraîcheur bases machines**
- 95% des machines: bases <7j
- Endpoint KSC: `Update.GetLastUpdateInfo` par machine

#### Catégorie 3: Détection & Réponse (6 contrôles)

**C3.1 - Menaces actives non résolues**
- Seuil Critical: ≥1 menace active
- Endpoint KSC: `Events.*` (type: threat, status: active)

**C3.2 - Machines infectées**
- Nombre de machines avec infections actives
- Endpoint KSC: `Events.*`

**C3.3 - Protection temps réel désactivée**
- Machines avec protection désactivée
- Endpoint KSC: `Host.GetHostInfo` (protection status)

**C3.4 - Erreurs critiques système**
- Erreurs système nécessitant attention
- Endpoint KSC: `Events.*` (level: critical)

**C3.5 - Objets en quarantaine**
- Nombre d'objets en quarantaine (info)
- Endpoint KSC: `Events.*` (quarantine)

**C3.6 - Vulnérabilités critiques non corrigées**
- CVE critiques non patchées
- Endpoint KSC: `Vulnerabilities.*`

#### Catégorie 4: Santé Serveur KSC (4 contrôles)

**C4.1 - État du service KSC**
- Uptime, statut service
- Endpoint KSC: `Server.GetStatistics`

**C4.2 - Performance serveur**
- CPU >90% = Warning, >95% = Critical
- RAM >95% = Critical
- Disque <20Go = Critical
- Endpoint KSC: `Server.GetStatistics`

**C4.3 - Validité licence**
- <60j = Warning
- <30j = Critical
- Endpoint KSC: `Server.GetLicenseInfo`

**C4.4 - Expiration certificats + dernière sauvegarde**
- Certificats <30j = Warning
- Dernière sauvegarde >7j = Warning
- Endpoint KSC: `Server.*`

### 3. Système d'Alerting

#### Génération Automatique
- Après chaque audit, analyser les 20 contrôles
- Comparer avec seuils (globaux ou personnalisés par client)
- Générer alertes selon sévérité

#### Déduplication Intelligente
```java
// Pseudo-code
Alert existingAlert = findActiveAlert(clientId, controlId)
if (existingAlert != null) {
    existingAlert.count++
    existingAlert.updatedAt = now()
} else {
    createNewAlert(...)
}
```

#### Cycle de Vie des Alertes
1. **ACTIVE**: Alerte nouvellement créée
2. **ACKNOWLEDGED**: Acquittée par technicien (action en cours)
3. **RESOLVED**: Problème résolu (auto ou manuel)
4. **EXPIRED**: >30j sans signalement, archivée

#### Notifications Email

**Email immédiat pour alertes CRITIQUES**:
- Envoi instantané lors de détection
- Template HTML professionnel
- Liste: clientName, control, détails, actions recommandées

**Résumé quotidien pour WARNINGS**:
- Envoi à 08h00 chaque jour
- Récapitulatif des warnings actifs
- Groupé par client

**Configuration SMTP** (admin):
```
smtp.host
smtp.port
smtp.username
smtp.password (encrypted)
smtp.from
smtp.ssl_enabled
```

### 4. Dashboards & Visualisation

#### Dashboard Global

**KPI Cards** (4 cartes colorées):
- Total clients
- Clients OK (% vert)
- Clients WARNING (% orange)
- Clients CRITICAL (% rouge)

**Graphiques**:
- Donut: Répartition statuts (OK/Warning/Critical)
- Barres: Top 5 alertes par type
- Ligne: Évolution sur 7 jours

**Tableau clients récents**:
- 10 derniers clients audités
- Tri/filtres par statut, nom
- Actions: Voir détails, Lancer audit

**10 dernières alertes** (toutes catégories):
- Cartes avec bordure colorée selon sévérité
- Client, contrôle, message, timestamp
- Actions: Acquitter, Résoudre

#### Dashboard Client (Détail)

**7 Onglets**:
1. **Vue d'ensemble**: Résumé exécutif (points positifs/négatifs/actions), métriques clés
2. **Inventaire**: 5 contrôles C1.x avec cartes détaillées
3. **Conformité**: 5 contrôles C2.x
4. **Détection**: 6 contrôles C3.x
5. **Santé KSC**: 4 contrôles C4.x
6. **Historique**: 30 derniers audits, graphiques d'évolution
7. **Configuration**: Seuils personnalisés (optionnel)

**Cartes de contrôle**:
- Statut badge (OK/Warning/Critical)
- Valeur actuelle
- Message explicatif
- Détails (tableau si applicable)

### 5. Rapports

#### Rapport HTML (consultable interface)
- Page de garde (logo, client, date)
- Résumé exécutif (3 colonnes: positifs/attention/actions)
- Métriques clés (4 cartes colorées)
- Détails par catégorie (4 sections)
- Liste alertes actives
- Annexes (inventaire complet)

#### Rapport PDF (téléchargeable)
- Même structure que HTML
- Génération avec bibliothèque Java (iText, Flying Saucer)
- Bouton "Télécharger PDF"
- Envoi par email en pièce jointe

**Endpoints**:
```
GET  /api/v1/reports/{audit_id}           - HTML
GET  /api/v1/reports/{audit_id}/pdf       - PDF download
POST /api/v1/reports/{audit_id}/email     - Envoyer par email
```

### 6. Gestion Utilisateurs & Permissions

#### 3 Rôles RBAC

**ADMIN**:
- CRUD clients, users, configuration globale
- Accès à toutes les fonctionnalités
- Page Administration

**TECHNICIEN_SOC**:
- Lecture clients, audits, alertes
- Lancer audits manuels
- Acquitter/Résoudre alertes
- PAS d'accès: CRUD users, config globale

**MANAGER**:
- Lecture seule: clients, audits, alertes
- Export rapports PDF
- PAS d'accès: audits manuels, acquittement, configuration

#### Endpoints Utilisateurs
```
GET    /api/v1/users              - Liste utilisateurs (admin only)
POST   /api/v1/users              - Créer utilisateur (admin only)
GET    /api/v1/users/{id}         - Détail utilisateur
PUT    /api/v1/users/{id}         - Modifier utilisateur (admin or self)
DELETE /api/v1/users/{id}         - Supprimer utilisateur (admin only)
```

---

## Intégration Kaspersky API

### Authentification
```
POST https://{ksc_url}/api/v1.0/auth/login
Body: {"username": "...", "password": "..."}
Response: {"access_token": "...", "expires_in": 3600}
```

**Gestion Token**:
- Stocker en mémoire (Redis cache)
- Renouveler automatiquement avant expiration
- Retry login si 401

### Endpoints KSC Principaux

| Endpoint | Usage |
|----------|-------|
| `HostGroup.FindHosts` | Liste machines + filtres |
| `Host.GetHostInfo` | Détails machine (agent, EDR, protection) |
| `Policies.*` | Politiques de sécurité |
| `Tasks.*` | Tâches scan/update |
| `Events.*` | Événements (menaces, erreurs) |
| `Server.GetStatistics` | CPU, RAM, uptime |
| `Vulnerabilities.*` | CVE critiques |
| `Update.GetLastUpdateInfo` | Bases AV |

### Gestion Erreurs API

**Retry Logic** (Resilience4j):
- 3 tentatives max
- Backoff exponentiel: 1min, 5min, 15min
- Circuit breaker: Arrêt si KSC down (>50% échecs sur 10 requêtes)

**Timeout**:
- 30s par requête
- 5min max pour audit complet

**Cache Redis**:
- 5 min sur résultats pour éviter surcharge KSC
- Clé: `ksc:{client_id}:{endpoint}:{params_hash}`

---

## Sécurité

### 1. Authentification & Autorisation

**JWT (JSON Web Tokens)**:
- Access token: 1h (short-lived)
- Refresh token: 7j (long-lived)
- Stockage: httpOnly cookies (frontend)
- Header: `Authorization: Bearer {token}`

**RBAC (Role-Based Access Control)**:
- 3 rôles: ADMIN, TECHNICIEN_SOC, MANAGER
- Vérification côté backend (Spring Security)
- Annotations: `@PreAuthorize("hasRole('ADMIN')")`

**Passwords**:
- Hashing: bcrypt (cost 12)
- Exigences:
  - Min 8 caractères
  - 1 majuscule, 1 minuscule, 1 chiffre
  - Optionnel: 1 caractère spécial

### 2. Chiffrement

**En transit**:
- HTTPS/TLS 1.3 obligatoire
- Nginx reverse proxy avec certificat SSL

**Au repos**:
- Credentials KSC: AES-256 (Fernet ou javax.crypto)
- Clé de chiffrement: Variable d'environnement séparée de la DB
- Rotation clés: Tous les 6 mois

### 3. Protection

**Rate Limiting**:
- Login: 5 tentatives / 15 min par IP
- API: 100 requêtes / min par user
- Implementation: Spring Security + Redis

**CSRF**:
- Protection via JWT en headers (pas cookies)
- Custom CSRF token pour forms sensibles

**SQL Injection**:
- ORM avec paramètres bindés (JPA)
- JAMAIS de concaténation SQL

**XSS**:
- React échappe automatiquement
- CSP headers: `Content-Security-Policy: default-src 'self'`

### 4. Audit Trail

**Logs Complets** (table `logs`):
- Authentification (login, logout, failed attempts)
- CRUD clients, users
- Lancement audits
- Acquittement/Résolution alertes
- Modifications configuration

**Format Log**:
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "userId": "uuid",
  "level": "INFO",
  "category": "CLIENT",
  "action": "CREATE",
  "details": {"clientName": "...", "kscUrl": "..."},
  "ipAddress": "192.168.1.10"
}
```

---

## Règles Métier Critiques

### 1. Statut Global d'un Audit

```
if (ANY contrôle == CRITICAL) {
    audit.globalStatus = CRITICAL
} else if (ANY contrôle == WARNING) {
    audit.globalStatus = WARNING
} else {
    audit.globalStatus = OK
}
```

### 2. Alertes

**Déduplication**:
```java
Alert existingAlert = alertRepository.findByClientIdAndControlIdAndStatusActive(clientId, controlId)
if (existingAlert != null) {
    existingAlert.count++
    existingAlert.updatedAt = now()
    alertRepository.save(existingAlert)
} else {
    Alert newAlert = new Alert(clientId, controlId, severity, ...)
    alertRepository.save(newAlert)
}
```

**Auto-résolution**:
- Si contrôle OK au prochain audit ET alerte ACTIVE/ACKNOWLEDGED
- Changer statut → RESOLVED, resolvedAt = now()

**Expiration**:
- Job quotidien: Alertes ACTIVE >30j sans mise à jour → EXPIRED

### 3. Seuils

**Ordre de priorité**:
1. Seuils personnalisés client (si configurés)
2. Seuils globaux (défaut)

**Exemples critiques**:
- Machines déconnectées: 30 jours
- Bases serveur obsolètes: 48h
- CPU serveur: >95%
- RAM serveur: >95%
- Disque serveur: <20 Go
- Licence: <30 jours expiration
- Menaces actives: ≥1

### 4. Rétention Données

**Politique de nettoyage automatique** (job quotidien):
- Audits: 90 jours
- Alertes résolues: 90 jours
- Logs: 365 jours
- Cache Redis: 5 minutes

**Configuration** (admin):
```java
@Scheduled(cron = "0 0 2 * * ?") // 02h00 chaque jour
public void cleanupOldData() {
    auditRepository.deleteByCreatedAtBefore(now().minus(90, DAYS))
    alertRepository.deleteByStatusResolvedAndResolvedAtBefore(now().minus(90, DAYS))
    logRepository.deleteByTimestampBefore(now().minus(365, DAYS))
}
```

---

## Principes SOLID & Design Patterns

### SOLID

**S - Single Responsibility**:
- 1 classe = 1 responsabilité
- Exemple: `ClientService` (CRUD clients), `AuditService` (audits), `AlertService` (alertes)

**O - Open/Closed**:
- Extensions via interfaces, pas modifications
- Exemple: `ControlChecker` interface → implémentations C1.1, C1.2, ...

**L - Liskov Substitution**:
- Sous-classes remplaçables par classe parente
- Exemple: Tous les `ControlChecker` implémentent la même interface

**I - Interface Segregation**:
- Interfaces spécifiques, pas génériques
- Exemple: `Auditable`, `Alertable`, `Reportable`

**D - Dependency Inversion**:
- Dépendre d'abstractions, pas de concrétions
- Injection de dépendances Spring Boot

### Design Patterns

**Repository Pattern** (Data Access):
```java
public interface ClientRepository extends JpaRepository<Client, UUID> {
    List<Client> findByIsActiveTrue()
    Optional<Client> findByKscUrl(String url)
}
```

**Service Layer Pattern** (Business Logic):
```java
@Service
public class AuditService {
    @Autowired private KasperskyApiClient kasperskyClient
    @Autowired private AlertService alertService

    public Audit runAudit(UUID clientId) { ... }
}
```

**Strategy Pattern** (Contrôles):
```java
public interface ControlChecker {
    ControlResult check(Client client, KasperskyApiClient api)
}

@Component("C1.1")
public class DisconnectedMachinesChecker implements ControlChecker { ... }
```

**Observer Pattern** (Alerting):
```java
@EventListener
public void onAuditCompleted(AuditCompletedEvent event) {
    // Générer alertes
}
```

**Builder Pattern** (DTOs):
```java
AuditReportDTO report = AuditReportDTO.builder()
    .clientName(client.getName())
    .auditDate(audit.getCompletedAt())
    .globalStatus(audit.getGlobalStatus())
    .build()
```

---

## Conventions de Code

### Backend (Java/Spring Boot)

**Nommage**:
- Classes: `PascalCase` (ex: `ClientService`)
- Méthodes: `camelCase` (ex: `runAudit()`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `MAX_RETRY_ATTEMPTS`)
- Packages: `lowercase.dot.notation` (ex: `com.mssp.healthcheck.service`)

**Structure Packages**:
```
com.mssp.healthcheck/
├── config/           # Configuration Spring
├── controller/       # REST Controllers
├── service/          # Business Logic
├── repository/       # Data Access
├── model/            # Entities JPA
├── dto/              # Data Transfer Objects
├── exception/        # Custom Exceptions
├── util/             # Utilitaires
└── security/         # JWT, Auth
```

**Annotations**:
```java
@RestController
@RequestMapping("/api/v1/clients")
@Slf4j // Lombok logging
public class ClientController {

    @Autowired
    private ClientService clientService

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN_SOC', 'MANAGER')")
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        log.info("Fetching all clients")
        // ...
    }
}
```

### Frontend (React/TypeScript)

**Nommage**:
- Composants: `PascalCase` (ex: `ClientModal.tsx`)
- Fonctions: `camelCase` (ex: `handleSubmit`)
- Hooks: `use` prefix (ex: `useAuth`)
- Types/Interfaces: `PascalCase` (ex: `Client`, `AlertStatus`)

**Structure Dossiers**:
```
app/                    # Next.js pages
components/
├── ui/                 # Composants shadcn/ui
├── layout/             # Header, Sidebar, MainLayout
├── dashboard/          # Composants dashboard
├── clients/            # Composants clients
├── alerts/             # Composants alertes
└── ...
lib/
├── types.ts            # Types TypeScript
├── constants.ts        # Constantes
├── utils.ts            # Utilitaires
├── hooks/              # Custom hooks
├── stores/             # Zustand stores
└── utils/              # Fonctions utilitaires
```

**Composant Type**:
```typescript
"use client"

import { useState } from "react"
import type { Client } from "@/lib/types"

interface ClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client
}

export function ClientModal({ open, onOpenChange, client }: ClientModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Component logic

  return (
    // JSX
  )
}
```

### Git Conventions

**Branches**:
- `main`: Production
- `develop`: Development
- `feature/nom-fonctionnalite`: Nouvelles fonctionnalités
- `fix/nom-bug`: Corrections de bugs
- `hotfix/nom-urgence`: Corrections urgentes en prod

**Commits** (Conventional Commits):
```
feat: Add client CRUD endpoints
fix: Resolve JWT token expiration issue
docs: Update API documentation
refactor: Reorganize audit service logic
test: Add unit tests for alert service
chore: Update dependencies
```

---

## Tâches de Développement par Phase

### Phase 1: Setup & Fondations (Semaine 1)
- [ ] Setup projet Spring Boot (structure, dépendances)
- [ ] Configuration PostgreSQL + Redis (Docker Compose)
- [ ] Modèle de données (entités JPA, migrations Flyway)
- [ ] Setup Next.js frontend (déjà fait)
- [ ] Configuration Nginx reverse proxy

### Phase 2: Authentification (Semaine 2)
- [ ] Implémentation JWT (access + refresh tokens)
- [ ] Spring Security configuration
- [ ] Endpoints auth (login, refresh, logout)
- [ ] Integration frontend avec API auth
- [ ] Tests authentification

### Phase 3: CRUD Clients (Semaine 3)
- [ ] ClientService + ClientRepository
- [ ] Endpoints CRUD clients
- [ ] Chiffrement credentials KSC (AES-256)
- [ ] Test connexion KSC
- [ ] Integration frontend

### Phase 4: Intégration Kaspersky API (Semaine 4)
- [ ] KasperskyApiClient (RestTemplate + Resilience4j)
- [ ] Authentification KSC (JWT)
- [ ] Implémentation endpoints principaux
- [ ] Gestion erreurs + retry + circuit breaker
- [ ] Cache Redis (5 min)
- [ ] Tests avec KSC réel

### Phase 5: Audits Automatisés (Semaines 5-6)
- [ ] AuditService + AuditRepository
- [ ] Implémentation 20 contrôles (ControlChecker strategy)
  - [ ] C1.1 à C1.5 (Inventaire)
  - [ ] C2.1 à C2.5 (Conformité)
  - [ ] C3.1 à C3.6 (Détection)
  - [ ] C4.1 à C4.4 (Santé KSC)
- [ ] Audit executor (orchestration des 20 contrôles)
- [ ] Calcul statut global audit
- [ ] Stockage résultats JSON
- [ ] Spring Scheduler (audits quotidiens automatiques)
- [ ] Endpoint audit manuel
- [ ] Tests unitaires + intégration

### Phase 6: Système d'Alerting (Semaine 7)
- [ ] AlertService + AlertRepository
- [ ] Génération automatique alertes (post-audit)
- [ ] Logique de déduplication
- [ ] Cycle de vie alertes (ACTIVE → ACKNOWLEDGED → RESOLVED)
- [ ] Auto-résolution
- [ ] Expiration (>30j)
- [ ] Endpoints alertes (liste, acquitter, résoudre)
- [ ] Integration frontend

### Phase 7: Notifications Email (Semaine 8)
- [ ] Configuration Spring Mail (SMTP)
- [ ] Templates HTML emails
- [ ] Email immédiat alertes CRITIQUES
- [ ] Résumé quotidien WARNINGS (scheduled)
- [ ] Tests envoi emails

### Phase 8: Rapports (Semaine 9)
- [ ] ReportService
- [ ] Génération rapport HTML
- [ ] Génération rapport PDF (iText)
- [ ] Endpoint téléchargement PDF
- [ ] Endpoint envoi email avec PDF
- [ ] Integration frontend

### Phase 9: Configuration & Seuils (Semaine 10)
- [ ] ThresholdService
- [ ] Seuils globaux (configuration admin)
- [ ] Seuils personnalisés par client
- [ ] Endpoints configuration
- [ ] Page admin frontend (configuration globale)
- [ ] Page seuils client frontend

### Phase 10: Gestion Utilisateurs (Semaine 11)
- [ ] UserService + UserRepository
- [ ] Endpoints CRUD users
- [ ] RBAC (vérification rôles)
- [ ] Page gestion utilisateurs frontend
- [ ] Tests permissions

### Phase 11: Dashboard & Visualisation (Semaine 12)
- [ ] DashboardService (agrégation KPIs)
- [ ] Endpoints dashboard global
- [ ] Endpoints dashboard client
- [ ] Integration frontend (déjà fait partiellement)
- [ ] Graphiques temps réel

### Phase 12: Sécurité & Performance (Semaine 13)
- [ ] Rate limiting (Spring Security + Redis)
- [ ] CSRF protection
- [ ] Audit trail complet (logs)
- [ ] Optimisation queries SQL (indexes)
- [ ] Cache stratégique (Redis)
- [ ] Tests performance (JMeter)

### Phase 13: Tests & Documentation (Semaine 14)
- [ ] Tests unitaires (JUnit 5, Mockito)
- [ ] Tests intégration (TestContainers)
- [ ] Tests E2E frontend (Cypress/Playwright)
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Documentation utilisateur
- [ ] Guide déploiement

### Phase 14: DevOps & Déploiement (Semaine 15)
- [ ] Dockerfile backend + frontend
- [ ] Docker Compose (dev environment)
- [ ] CI/CD pipeline (GitLab CI / GitHub Actions)
- [ ] Déploiement environnements (dev, staging, prod)
- [ ] Monitoring (Prometheus, Grafana)
- [ ] Logs centralisés (ELK Stack)

---

## Critères de Succès

### MVP (Phase 1-8)
- ✅ 3+ clients configurés et audités
- ✅ 5 contrôles prioritaires (C3.1, C1.1, C2.4, C4.2, C4.3) 100% fonctionnels
- ✅ Alertes email envoyées correctement
- ✅ 0 bugs bloquants
- ✅ Dashboard global fonctionnel
- ✅ Rapport HTML consultable

### Complet (Phase 1-13)
- ✅ 20 contrôles implémentés et testés
- ✅ Audits quotidiens auto pour tous clients actifs
- ✅ Rapports PDF sans erreur
- ✅ Temps moyen audit <5 min
- ✅ Satisfaction users >8/10
- ✅ Tests coverage >80%
- ✅ Documentation complète

### Long Terme (Post-MVP)
- 📈 Réduction temps surveillance: 80%
- 📈 Détection incidents critiques: <5 min
- 📈 Capacité: 100+ clients sans dégradation
- 📈 Uptime: >99.5%
- 📈 Intégrations additionnelles (Slack, Teams, ServiceNow)

---

## Risques & Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| API KSC instable | Élevé | Moyen | Retry logic robuste (3×), circuit breaker, alertes équipe |
| Volume de données élevé | Moyen | Élevé | Optimisation queries dès début, cache Redis, pagination |
| Complexité métier (20 contrôles) | Moyen | Moyen | Validation régulière avec users SOC, tests unitaires exhaustifs |
| Scope creep | Élevé | Élevé | Focus strict sur MVP, board Kanban discipliné, user stories |
| Absence environnement test KSC | Critique | Faible | Obtenir accès dès semaine 1, sinon mock API Kaspersky |
| Sécurité (credentials, auth) | Critique | Moyen | Audit sécurité régulier, chiffrement AES-256, JWT best practices |

---

## Ressources & Références

### Documentation Technique
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Kaspersky API Documentation](https://support.kaspersky.com/KSC/14.2/en-US/admin_api.htm)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Outils
- **IDE**: IntelliJ IDEA (backend), VS Code (frontend)
- **API Testing**: Postman, Insomnia
- **DB Management**: DBeaver, pgAdmin
- **Monitoring**: Prometheus + Grafana
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Contact & Support
- **Product Owner**: [Nom]
- **Lead Dev Backend**: [Nom]
- **Lead Dev Frontend**: [Nom]
- **DevOps**: [Nom]

---

**Date Dernière Mise à Jour**: 2025-01-15
**Version**: 2.0
