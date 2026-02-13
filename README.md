# TimeTravel Agency

Webapp de voyage dans le temps : landing, trois destinations (Crétacé, Florence 1504, Paris 1889), agent conversationnel (API Perplexity via proxy), quiz de recommandation, auth et profils Supabase.

## Stack

- **Frontend** : Vue 3, Vite, Vue Router, Pinia, Tailwind CSS
- **Backend** : Node (Express) — proxy pour l’API Perplexity (clé jamais exposée au front)
- **Auth & données** : Supabase (Auth + table `profiles`)

## Prérequis

- Node.js 18+
- Compte Supabase et projet créé
- Clé API Perplexity (optionnel ; sans clé, le chat affiche un message de repli)

## Installation

```bash
npm install
```

## Variables d’environnement

À la racine, fichier `.env` (déjà renseigné si vous avez vos clés) :

- `VITE_SUPABASE_URL` — URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` — Clé anonyme Supabase (frontend)
- `PERPLEXITY_API_KEY` — Clé API Perplexity (backend uniquement)

## Base de données Supabase

1. Ouvrir le [Dashboard Supabase](https://supabase.com/dashboard) > votre projet > **SQL Editor**.
2. Exécuter le script `supabase-schema.sql` (création de `profiles`, `reservations`, RLS et trigger pour nouveau user).

## Lancement

Toujours exécuter les commandes **à la racine du projet** (`TimeTravelAgency_KOUYATE`), pas dans le dossier `server/`.

**Terminal 1 — backend (proxy Perplexity) :**

```bash
cd c:\Users\ISSA\Desktop\TimeTravelAgency_KOUYATE
npm run server
```

**Terminal 2 — frontend :**

```bash
cd c:\Users\ISSA\Desktop\TimeTravelAgency_KOUYATE
npm run dev
```

Ou les deux en une commande (un seul terminal) :

```bash
cd c:\Users\ISSA\Desktop\TimeTravelAgency_KOUYATE
npm run dev:all
```

- Frontend : http://localhost:5173  
- Le proxy est utilisé via le proxy Vite (`/api` → `http://localhost:3001`).

## Build production

```bash
npm run build
npm run preview
```

## Déploiement tout-en-un (Coolify, etc.)

Un seul service Node sert à la fois le front (fichiers statiques) et l’API `/api/chat`. Aucun Docker requis.

1. **Build** : génère le dossier `dist/` (front).
2. **Démarrage** : le serveur sert `dist/` et les routes API. Si `dist/` n’existe pas (dev), seul l’API est exposée.

**Sur Coolify (sans Docker) :**

- **Type** : application Node (ou script).
- **Racine du projet** : dossier qui contient `package.json`, `server/`, `src/`.
- **Commandes :**
  - **Build** : `npm install && npm run build`
  - **Démarrage** : `npm run start` (ou `node server/index.js`)
- **Variables d’environnement** : les mêmes que en local (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `PERPLEXITY_API_KEY`). Les `VITE_*` sont injectées au moment du build.
- **Port** : celui fourni par Coolify (souvent `PORT` dans l’env). Le serveur utilise `process.env.PORT || 3001`.

Une seule URL pour le site et l’API : le front appelle `/api/chat` sur la même origine.

## Fonctionnalités

- **Landing** : hero (image), présentation de l’agence, mise en avant des 3 destinations, CTA vers destinations et quiz.
- **Destinations** : liste + pages détail (description, points forts, consignes de sécurité, visuels).
- **Chat** : widget fixe ; envoi des messages au proxy qui appelle Perplexity avec le contexte (destinations + règles) ; prise en compte du profil utilisateur si connecté ; mode démo si l’API est indisponible.
- **Quiz** : quelques questions → recommandation d’une destination → lien vers la fiche.
- **Auth** : inscription / connexion Supabase ; après connexion, redirection vers le dashboard.
- **Dashboard** : espace utilisateur (accès après connexion) avec liste des réservations, reçus et bouton « Nouvelle réservation ».
- **Réservations** : formulaire (destination + date souhaitée) ; chaque réservation s’affiche comme un reçu dans le dashboard.
- **Chat** : l’assistant reçoit le contexte utilisateur (nom, email, préférences) pour personnaliser les réponses.

## Usage de l’IA

- **Modèle** : Perplexity (API) via le backend.
- **Sécurité** : clé API uniquement côté serveur ; pas d’exposition au front.
- **Contexte** : les 3 destinations, règles de sécurité et ton de l’agence sont passés au modèle ; le profil utilisateur (nom, préférences) est optionnellement envoyé pour des réponses personnalisées.
- **Limites** : nombre de messages et longueur de réponse limités côté backend pour maîtriser les coûts.
- **Fallback** : si l’API est indisponible ou non configurée, le chat affiche un message invitant à consulter les destinations ou à faire le quiz.

## Images

Les visuels des destinations sont dans `public/destinations/` (cretace.png, florence-1504.png, paris-1889.png). Vous pouvez les remplacer par vos propres assets en conservant les noms ou en mettant à jour les chemins dans `src/data/destinations.js`.

## Licence

Projet pédagogique / rendu.
