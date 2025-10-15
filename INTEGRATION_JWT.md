# Guide d'Intégration JWT avec Spring Boot

Ce document explique comment intégrer l'authentification JWT avec le backend Spring Boot une fois celui-ci développé.

---

## Architecture d'Authentification

### Vue d'Ensemble

\`\`\`
[Frontend React] ←→ [Spring Boot Backend] ←→ [PostgreSQL]
     ↓                      ↓
  Zustand Store      Spring Security
  (Auth State)       (JWT Validation)
\`\`\`

---

## 1. Configuration Backend (Spring Boot)

### Dépendances Maven

\`\`\`xml
<dependencies>
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
\`\`\`

### Configuration application.yml

\`\`\`yaml
jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-here-change-in-production}
  expiration: 3600000 # 1 heure en millisecondes
  refresh-expiration: 604800000 # 7 jours en millisecondes

spring:
  security:
    user:
      name: admin
      password: ${ADMIN_PASSWORD:admin123}
\`\`\`

### Endpoints d'Authentification

Le backend doit exposer ces endpoints:

\`\`\`java
// POST /api/v1/auth/login
{
  "email": "admin@mssp.com",
  "password": "admin123"
}

// Réponse:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "admin@mssp.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}

// POST /api/v1/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// POST /api/v1/auth/logout
// Headers: Authorization: Bearer <token>
\`\`\`

---

## 2. Configuration Frontend (React)

### Service d'Authentification

Remplacer le fichier `lib/services/auth-service.ts` mock par:

\`\`\`typescript
import axios from 'axios';
import { API_CONFIG } from '../constants';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'TECHNICIEN_SOC' | 'MANAGER';
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/auth/login`,
      credentials
    );
    return response.data;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post(
      `${API_CONFIG.baseURL}/auth/refresh`,
      { refreshToken }
    );
    return response.data;
  },

  async logout(accessToken: string): Promise<void> {
    await axios.post(
      `${API_CONFIG.baseURL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
};
\`\`\`

### Configuration Axios avec Intercepteurs

Créer `lib/api/axios-config.ts`:

\`\`\`typescript
import axios from 'axios';
import { API_CONFIG } from '../constants';
import { useAuthStore } from '../stores/auth-store';
import { authService } from '../services/auth-service';

// Instance Axios configurée
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête: Ajouter le token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse: Gérer le refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Tenter de rafraîchir le token
        const response = await authService.refresh(refreshToken);
        
        // Mettre à jour le store
        useAuthStore.getState().setTokens(
          response.accessToken,
          response.refreshToken
        );

        // Réessayer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
\`\`\`

### Mise à Jour du Store Zustand

Modifier `lib/stores/auth-store.ts`:

\`\`\`typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authService } from '../services/auth-service';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { accessToken } = get();
        if (accessToken) {
          try {
            await authService.logout(accessToken);
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
\`\`\`

---

## 3. Sécurité

### Stockage des Tokens

- **Access Token**: Stocké dans Zustand avec persistence (localStorage)
- **Refresh Token**: Stocké dans Zustand avec persistence (localStorage)
- **Alternative sécurisée**: Utiliser des cookies HttpOnly pour le refresh token (nécessite configuration backend)

### Protection CSRF

Le backend doit:
- Accepter les tokens JWT dans les headers (pas de cookies pour l'access token)
- Implémenter une protection CSRF pour les cookies si utilisés

### HTTPS Obligatoire

En production, toutes les communications doivent être en HTTPS/TLS 1.3.

---

## 4. Gestion des Erreurs

### Codes d'Erreur à Gérer

- **401 Unauthorized**: Token expiré ou invalide → Tenter refresh
- **403 Forbidden**: Permissions insuffisantes → Afficher message
- **500 Internal Server Error**: Erreur serveur → Afficher message générique

### Exemple de Gestion

\`\`\`typescript
try {
  await apiClient.get('/clients');
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      toast.error('Vous n\'avez pas les permissions nécessaires');
    } else if (error.response?.status === 500) {
      toast.error('Erreur serveur. Veuillez réessayer plus tard.');
    }
  }
}
\`\`\`

---

## 5. Tests

### Tests à Effectuer

1. **Login réussi**: Vérifier que les tokens sont stockés
2. **Login échoué**: Vérifier le message d'erreur
3. **Token expiré**: Vérifier que le refresh fonctionne
4. **Refresh échoué**: Vérifier la déconnexion automatique
5. **Logout**: Vérifier que les tokens sont supprimés
6. **Requêtes protégées**: Vérifier que le token est envoyé

---

## 6. Variables d'Environnement

### Frontend (.env.local)

\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
\`\`\`

### Backend (application.yml ou .env)

\`\`\`bash
JWT_SECRET=your-super-secret-256-bit-key-change-in-production
ADMIN_PASSWORD=secure-admin-password
\`\`\`

---

## 7. Checklist d'Intégration

- [ ] Backend: Implémenter les endpoints d'authentification
- [ ] Backend: Configurer Spring Security avec JWT
- [ ] Backend: Tester les endpoints avec Postman
- [ ] Frontend: Remplacer le service mock par le service réel
- [ ] Frontend: Configurer Axios avec intercepteurs
- [ ] Frontend: Mettre à jour le store Zustand
- [ ] Frontend: Tester le flow complet (login, refresh, logout)
- [ ] Sécurité: Vérifier HTTPS en production
- [ ] Sécurité: Configurer les CORS correctement
- [ ] Tests: Écrire les tests d'intégration

---

## Ressources

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
