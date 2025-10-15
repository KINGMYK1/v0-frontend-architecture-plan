# Guide de l'Agent IA - MSSP Health Check

## Introduction

Ce document est destiné aux agents IA (comme moi, v0) qui travailleront sur le projet MSSP Health Check. Il décrit la méthodologie de travail, les bonnes pratiques, et le processus à suivre pour garantir un développement cohérent et de qualité.

---

## Philosophie de Travail

### Principes Fondamentaux

1. **Comprendre avant d'agir**: Toujours lire et comprendre le contexte complet avant de faire des modifications
2. **Qualité > Rapidité**: Privilégier un code propre et maintenable plutôt que des solutions rapides
3. **Communication claire**: Expliquer les changements et les décisions prises
4. **Respect des conventions**: Suivre strictement les conventions établies dans le projet
5. **Sécurité first**: La sécurité n'est jamais négociable

---

## Méthodologie de Travail

### 1. Phase de Découverte

#### Avant toute modification, TOUJOURS:

1. **Lire les documents de référence**:
   - `ROADMAP.md` - Vision globale et architecture
   - `TODO.md` - Tâches en cours et à venir
   - `CHANGELOG.md` - Historique des modifications
   - `INTEGRATION_JWT.md` - Guide d'intégration backend

2. **Explorer le codebase**:
   \`\`\`
   Utiliser SearchRepo avec: "Give me an overview of the codebase"
   \`\`\`
   - Comprendre la structure des dossiers
   - Identifier les patterns existants
   - Repérer les composants réutilisables

3. **Lire les fichiers concernés**:
   - Utiliser `ReadFile` pour lire TOUS les fichiers que vous allez modifier
   - Ne JAMAIS écrire dans un fichier sans l'avoir lu d'abord
   - Comprendre le code existant avant de le modifier

### 2. Phase de Planification

#### Utiliser `<Thinking>` pour:

1. **Analyser la demande**:
   - Qu'est-ce que l'utilisateur demande exactement?
   - Quels sont les fichiers concernés?
   - Y a-t-il des dépendances à considérer?

2. **Vérifier l'alignement**:
   - Est-ce conforme au cahier des charges?
   - Est-ce cohérent avec l'architecture existante?
   - Y a-t-il des patterns similaires dans le code?

3. **Planifier l'approche**:
   - Quels fichiers doivent être créés/modifiés?
   - Dans quel ordre?
   - Y a-t-il des composants réutilisables?

### 3. Phase d'Implémentation

#### Règles d'Or

1. **Utiliser les commentss**:
   \`\`\`tsx
   \`\`\`
   - Toujours utiliser exactement cette syntaxe
   - Ne PAS inventer de variantes comme "... existing header ..."

2. **Ajouter des Change Comments**:
   \`\`\`tsx
   \`\`\`
   - Expliquer les modifications non évidentes
   - Être concis mais clair

3. **Respecter les conventions**:
   - **Fichiers**: kebab-case (ex: `client-modal.tsx`)
   - **Composants**: PascalCase (ex: `ClientModal`)
   - **Fonctions/variables**: camelCase (ex: `handleSubmit`)
   - **Types**: PascalCase (ex: `ClientFormData`)

4. **Typage TypeScript strict**:
   - Pas de `any`
   - Toujours définir les interfaces pour les props
   - Utiliser les types du fichier `lib/types.ts`

### 4. Phase de Documentation

#### Après chaque modification:

1. **Écrire un postamble**:
   - 2-4 phrases maximum
   - Expliquer ce qui a été fait
   - Mentionner les points importants

2. **Mettre à jour les documents**:
   - `CHANGELOG.md` - Ajouter l'entrée de version
   - `TODO.md` - Cocher les tâches terminées, ajouter les nouvelles

---

## Gestion des Tâches

### Utilisation de TodoManager

#### Quand créer une todo list:
- Projets avec plusieurs systèmes distincts
- Fonctionnalités complexes nécessitant plusieurs étapes
- Intégrations avec plusieurs composants indépendants

#### Quand NE PAS créer de todo list:
- Builds cohérents simples (landing pages, formulaires)
- Tâches triviales ou en une seule étape
- Requêtes conversationnelles

#### Structure des tâches:
- **Niveau milestone**: "Build Homepage", "Setup Auth", "Add Database"
- **PAS de micro-étapes**: Ne pas décomposer en tâches trop petites
- **Une page = une tâche**: Ne pas diviser une page en plusieurs tâches
- **Maximum 10 tâches**: Rester focalisé et gérable

---

## Design Guidelines

### Système de Couleurs

**Palette Blue-Violet Gradient**:
- **Primary**: Blue-violet (#6366F1 to #8B5CF6)
- **Secondary**: Cyan-blue (#06B6D4)
- **Accent**: Purple (#A855F7)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Destructive**: Red (#EF4444)
- **Background**: Very dark (#0A0A0A)

**Règles**:
- Utiliser 3-5 couleurs maximum
- Éviter le violet pur sauf si demandé
- Utiliser des dégradés pour les éléments importants
- Toujours vérifier le contraste (accessibilité)

### Typographie

- **Maximum 2 font families**
- **Headings**: Geist Sans (font-sans)
- **Body**: Geist Sans (font-sans)
- **Code**: Geist Mono (font-mono)
- **Line height**: 1.4-1.6 pour le texte (leading-relaxed)

### Layout

1. **Flexbox first**: Pour la plupart des layouts
2. **Grid**: Seulement pour les layouts 2D complexes
3. **Responsive**: Mobile-first approach
4. **Spacing**: Utiliser l'échelle Tailwind (p-4, gap-6, etc.)

### Composants

- **Utiliser shadcn/ui**: Composants de base déjà disponibles
- **Pas de duplication**: Réutiliser les composants existants
- **Composition**: Créer des composants composés
- **Props typés**: Toujours définir les interfaces

---

## Gestion des Erreurs

### Frontend

1. **Validation des formulaires**:
   - Utiliser React Hook Form + Zod
   - Messages d'erreur clairs en français
   - Validation côté client ET serveur

2. **Gestion des états**:
   - Loading states pour les opérations async
   - Error states avec messages utilisateur
   - Success feedback (toasts, notifications)

3. **Notifications**:
   - Utiliser le système de toast
   - Messages clairs et actionnables
   - "À implémenter" pour les fonctionnalités non développées

### Backend (à venir)

1. **Exceptions personnalisées**:
   - Créer des exceptions métier
   - Gestion centralisée avec @ControllerAdvice

2. **Codes HTTP appropriés**:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error

3. **Logging**:
   - Utiliser SLF4J
   - Niveaux appropriés (DEBUG, INFO, WARN, ERROR)
   - Contexte suffisant pour le debugging

---

## Sécurité

### Checklist Sécurité Frontend

- [ ] Pas de données sensibles dans le localStorage
- [ ] Tokens JWT dans httpOnly cookies (quand backend prêt)
- [ ] Validation des inputs côté client
- [ ] Échappement automatique React (XSS)
- [ ] HTTPS obligatoire en production
- [ ] CSP headers configurés

### Checklist Sécurité Backend (à venir)

- [ ] Authentification JWT
- [ ] RBAC (Role-Based Access Control)
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] SQL injection prevention (ORM)
- [ ] Credentials chiffrés (AES-256)
- [ ] Audit trail complet

---

## Debugging

### Utilisation de console.log

\`\`\`tsx
console.log("[v0] Description du point de debug:", variable)
\`\`\`

**Règles**:
- Préfixer avec `[v0]` pour identifier facilement
- Être descriptif sur ce qui est debuggé
- Inclure les valeurs des variables pertinentes
- **SUPPRIMER** après résolution du problème

### Outils de Debug

1. **React DevTools**: Inspecter les composants et le state
2. **Network Tab**: Vérifier les requêtes API
3. **Console**: Logs et erreurs
4. **Sources**: Breakpoints et step-through

---

## Intégration Backend

### Préparation

Le frontend est actuellement en mode mock. Quand le backend sera prêt:

1. **Lire `INTEGRATION_JWT.md`**: Guide complet d'intégration
2. **Remplacer les mocks**: Utiliser les vraies API calls
3. **Configurer Axios**: Base URL, interceptors, error handling
4. **Gérer les tokens**: Refresh automatique, logout sur 401
5. **Tester**: Tous les endpoints avec données réelles

### Points d'Attention

- **CORS**: Configurer correctement côté backend
- **Environment variables**: Utiliser `NEXT_PUBLIC_API_URL`
- **Error handling**: Gérer tous les cas d'erreur
- **Loading states**: Feedback utilisateur pendant les requêtes
- **Retry logic**: Pour les requêtes qui peuvent échouer temporairement

---

## Tests

### Frontend (à implémenter)

1. **Tests unitaires**: Jest + React Testing Library
2. **Tests composants**: Render, interactions, props
3. **Tests d'intégration**: Flux utilisateur complets
4. **Tests E2E**: Playwright (scénarios critiques)

### Backend (à implémenter)

1. **Tests unitaires**: JUnit 5
2. **Tests d'intégration**: Spring Boot Test
3. **Tests API**: RestAssured
4. **Tests de charge**: JMeter / Gatling

---

## Workflow Git

### Branches

\`\`\`
main (production)
  ├── develop (développement)
  │   ├── feature/user-management
  │   ├── feature/audit-system
  │   └── feature/reporting
  ├── bugfix/login-issue
  └── hotfix/critical-security-fix
\`\`\`

### Commits

**Format**: `type(scope): message`

**Types**:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, pas de changement de code
- `refactor`: Refactoring
- `test`: Ajout/modification de tests
- `chore`: Tâches de maintenance

**Exemples**:
\`\`\`
feat(clients): add client creation form
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
refactor(dashboard): extract stat card component
\`\`\`

---

## Checklist Avant Commit

- [ ] Code fonctionne sans erreurs
- [ ] Pas de console.log de debug restants
- [ ] Types TypeScript corrects (pas de `any`)
- [ ] Composants réutilisables extraits si nécessaire
- [ ] Conventions de nommage respectées
- [ ] CHANGELOG.md mis à jour
- [ ] TODO.md mis à jour si nécessaire
- [ ] Documentation inline pour code complexe

---

## Communication avec l'Utilisateur

### Ton et Style

- **Professionnel mais accessible**
- **Clair et concis**
- **Pas d'emojis** (sauf si demandé)
- **Français correct**

### Structure des Réponses

1. **Thinking**: Raisonnement interne (pas visible par l'utilisateur)
2. **Explication**: Ce qui va être fait
3. **Implémentation**: Code avec commentaires
4. **Postamble**: Résumé des changements (2-4 phrases)

### Gestion des Demandes Ambiguës

Si la demande n'est pas claire:
1. **Poser des questions de clarification**
2. **Proposer des options**
3. **Expliquer les implications**
4. **Attendre confirmation avant d'agir**

---

## Ressources Utiles

### Documentation Projet
- `ROADMAP.md` - Architecture et fonctionnalités
- `TODO.md` - Tâches et progression
- `CHANGELOG.md` - Historique des modifications
- `INTEGRATION_JWT.md` - Guide d'intégration backend

### Documentation Externe
- [React Docs](https://react.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Zod](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)
- [Recharts](https://recharts.org)

---

## Cas d'Usage Fréquents

### 1. Ajouter une Nouvelle Page

\`\`\`typescript
// 1. Créer le fichier de page
// app/nouvelle-page/page.tsx

// 2. Lire les composants existants similaires
// SearchRepo: "pages similaires"

// 3. Créer les composants nécessaires
// components/nouvelle-page/...

// 4. Ajouter au sidebar si nécessaire
// components/layout/sidebar.tsx

// 5. Mettre à jour TODO.md et CHANGELOG.md
\`\`\`

### 2. Modifier un Composant Existant

\`\`\`typescript
// 1. LIRE le fichier d'abord
// ReadFile: "components/..."

// 2. Comprendre le code existant

// 3. Faire les modifications avec commentss
// nouveau code

// 4. Tester visuellement

// 5. Documenter dans CHANGELOG.md
\`\`\`

### 3. Ajouter une Fonctionnalité Complexe

\`\`\`typescript
// 1. Créer une todo list si nécessaire
// TodoManager: set_tasks

// 2. Décomposer en étapes logiques

// 3. Implémenter étape par étape

// 4. Tester chaque étape

// 5. Marquer les tâches comme terminées
// TodoManager: move_to_task

// 6. Mettre à jour la documentation
\`\`\`

---

## Erreurs Courantes à Éviter

### ❌ Ne PAS Faire

1. **Écrire sans lire**: Toujours lire les fichiers avant de les modifier
2. **Ignorer les conventions**: Respecter le style du projet
3. **Dupliquer le code**: Réutiliser les composants existants
4. **Oublier les types**: TypeScript strict, pas de `any`
5. **Négliger l'accessibilité**: Toujours penser aux utilisateurs
6. **Commits sans documentation**: Toujours mettre à jour CHANGELOG.md
7. **Fonctionnalités non testées**: Vérifier que tout fonctionne
8. **Ignorer les erreurs**: Gérer tous les cas d'erreur

### ✅ Faire

1. **Lire et comprendre**: Contexte complet avant d'agir
2. **Suivre les patterns**: Cohérence avec l'existant
3. **Réutiliser**: DRY (Don't Repeat Yourself)
4. **Typer correctement**: Interfaces et types explicites
5. **Penser accessibilité**: ARIA, contraste, navigation clavier
6. **Documenter**: Code, commits, CHANGELOG
7. **Tester**: Vérifier visuellement et fonctionnellement
8. **Gérer les erreurs**: Loading, error, success states

---

## Conclusion

Ce guide est votre référence pour travailler sur MSSP Health Check. Suivez ces principes et méthodologies pour garantir un code de qualité, maintenable et sécurisé.

**Rappel**: En cas de doute, toujours:
1. Lire la documentation
2. Explorer le code existant
3. Poser des questions
4. Privilégier la qualité

---

**Bon développement!** 🚀

---

**Document maintenu par**: Équipe de développement MSSP Health Check  
**Dernière mise à jour**: 15 Janvier 2025  
**Version**: 1.0
