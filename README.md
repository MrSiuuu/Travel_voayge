# TimeTravel Agency

Application web de voyage dans le temps : landing, trois destinations (Crétacé, Florence 1504, Paris 1889), agent conversationnel (API Perplexity via proxy), quiz de recommandation, authentification et profils Supabase, réservations et dashboard utilisateur.

**Application en production :** [https://travel.kouyateissa.com/](https://travel.kouyateissa.com/)  
**Dépôt :** [https://github.com/MrSiuuu/Travel_voayge](https://github.com/MrSiuuu/Travel_voayge)

L’application est déployée en production (HTTPS, domaine dédié). Toutes les fonctionnalités sont opérationnelles : inscription et connexion, chat avec l’assistant IA, quiz, réservations, dashboard, mode clair/sombre.

---

## Stack technique

- **Frontend :** Vue 3, Vite, Vue Router, Pinia, Tailwind CSS
- **Backend :** Node.js (Express), proxy pour l’API Perplexity (clé API côté serveur uniquement)
- **Auth et données :** Supabase (Auth, tables `profiles` et `reservations`)

---

## Prérequis

- Node.js 18+
- Projet Supabase créé
- Clé API Perplexity (optionnel ; sans clé, le chat affiche un message de repli)

---

## Installation

```bash
npm install
```

---

## Variables d’environnement

À la racine du projet, fichier `.env` :

- `VITE_SUPABASE_URL` — URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` — Clé anonyme Supabase (frontend)
- `PERPLEXITY_API_KEY` — Clé API Perplexity (backend uniquement)

---

## Base de données Supabase

1. Ouvrir le [Dashboard Supabase](https://supabase.com/dashboard), projet concerné, **SQL Editor**.
2. Exécuter le script `supabase-schema.sql` (création des tables `profiles` et `reservations`, RLS, trigger à l’inscription).

---

## Lancement en développement

Exécuter les commandes à la **racine du projet**, pas dans le dossier `server/`.

**Terminal 1 — backend :**

```bash
npm run server
```

**Terminal 2 — frontend :**

```bash
npm run dev
```

Ou en une commande : `npm run dev:all`.

- Frontend : http://localhost:5173
- Le proxy Vite redirige `/api` vers le serveur (port 3001).

---

## Build production

```bash
npm run build
npm run preview
```

---

## Déploiement tout-en-un

Un seul processus Node sert le front (fichiers statiques depuis `dist/`) et l’API (`/api/chat`).

- **Build :** `npm install && npm run build`
- **Démarrage :** `npm run start` (ou `node server/index.js`)
- **Port :** le serveur utilise `process.env.PORT` (ex. 3000 ou 80 selon la plateforme).

Sur Coolify : ne pas activer « Is it a static site? ». Renseigner les commandes de build et de start ci-dessus, et les variables d’environnement. Détails dans `COOLIFY.md`.

---

## Fonctionnalités

- **Landing :** hero, présentation de l’agence, mise en avant des trois destinations, liens vers destinations et quiz.
- **Destinations :** liste et pages détail (Crétacé, Florence 1504, Paris 1889) avec description, points forts, consignes de sécurité, visuels.
- **Chat :** widget fixe ; envoi des messages au backend qui appelle l’API Perplexity ; contexte utilisateur (nom, email) envoyé si connecté ; limite de 3 échanges pour les visiteurs non connectés ; fallback si l’API est indisponible.
- **Quiz :** questions de préférence puis recommandation d’une destination avec lien vers la fiche.
- **Authentification :** inscription et connexion Supabase ; redirection vers le dashboard après connexion ; pas de confirmation email (désactivée côté Supabase).
- **Dashboard :** espace réservé aux utilisateurs connectés ; liste des réservations avec reçus ; bouton « Nouvelle réservation » ; possibilité de retirer une réservation.
- **Réservations :** formulaire (destination, date souhaitée optionnelle) ; enregistrement en base ; affichage en reçu dans le dashboard.
- **Interface :** mode clair / mode sombre (persistant), header avec logo et navigation, footer avec contact, responsive.

---

## Usage de l’IA

- **Modèle :** API Perplexity (modèle Sonar) via le backend.
- **Sécurité :** la clé API n’est jamais exposée au front ; tous les appels passent par le serveur.
- **Contexte :** les trois destinations, règles de sécurité et ton de l’agence sont fournis au modèle ; le profil utilisateur (nom, email) est envoyé pour des réponses personnalisées ; instructions pour orienter vers la réservation (lien dashboard, bouton « Nouvelle réservation »).
- **Limites :** nombre de messages et longueur de réponse limités côté backend.
- **Fallback :** si l’API est indisponible ou non configurée, le chat affiche un message invitant à consulter les destinations ou à faire le quiz.

---

## Images

Les visuels des destinations se trouvent dans `public/destinations/` (cretace.png, florence-1504.png, paris-1889.png). Les chemins sont définis dans `src/data/destinations.js`.

---

## Licence

Projet pédagogique / rendu.
