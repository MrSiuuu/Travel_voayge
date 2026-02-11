# Plan – Session 2 TimeTravel Agency

Je dois réaliser une webapp interactive moderne pour TimeTravel Agency en réutilisant les assets produits pendant la session 1.
L’objectif est de proposer une application propre, crédible et utilisable, avec de l’IA et une vraie interactivité.

## 1 La landing page principale

Je veux créer une page d’accueil de type produit avec :

* un hero visuel fort (image ou vidéo)
* une présentation rapide de l’agence
* une mise en avant des destinations disponibles
* une interface moderne, responsive
* des animations légères pour rendre la navigation vivante

Cette page doit immédiatement donner envie de voyager.

---

## 2 Les destinations

Je dois proposer au moins trois destinations temporelles.

Pour chacune, je veux afficher :

* le nom et l’époque
* une description courte
* des informations détaillées
* des points forts ou moments à vivre
* des conseils de sécurité
* des visuels issus de la session 1

Chaque destination doit ressembler à une vraie offre commerciale.

---

## 3 L’agent conversationnel

Je veux intégrer dans l’application un chat qui joue le rôle d’un agent de voyage temporel.

Cet agent doit pouvoir :

* répondre aux questions sur les destinations
* aider l’utilisateur à choisir
* fournir des recommandations
* enrichir l’expérience utilisateur

Le chat doit être directement accessible dans l’interface et donner l’impression d’un service réel.

### Implementation IA que je vais utiliser

Pour le chatbot interne, je vais utiliser l’API de Perplexity comme moteur LLM.

Je dois respecter ces regles pour que ce soit propre et securise :

* je ne mets jamais la cle API dans le front, je passe par un backend (proxy)
* je limite la longueur des reponses et le nombre de messages envoyes pour eviter les couts
* je donne a l agent un contexte clair (mes 3 destinations + regles de securite + ton de l agence)
* je prevois un fallback simple (mode demo) si l API est indisponible

---

## 4 La fonctionnalité d’automatisation ou personnalisation

Je dois ajouter au moins une fonctionnalite intelligente qui adapte le contenu a l utilisateur.

Par exemple, je peux mettre en place :

* un quiz qui recommande une destination
* une suggestion personnalisee selon les reponses
* une generation de texte adaptee au profil du voyageur

Le but est que l’application ne soit pas seulement statique, mais qu’elle prenne des decisions ou produise du contenu automatiquement.

---

## 5 L’expérience utilisateur

Je veux que mon application soit :

* fluide
* agreable a parcourir
* claire dans ses informations
* utilisable sur mobile et desktop

Les images et videos doivent etre bien integrees et les animations doivent rester discretes.

---

## 6 Le rendu final

Je dois fournir :

* une application deployee avec une URL publique
* le code source
* un README qui explique le projet, les fonctionnalites, la stack technique et l usage de l IA

---

## Résumé personnel

Je dois produire une webapp professionnelle de voyage dans le temps avec :

* une landing page moderne
* trois destinations detaillees
* un chatbot fonctionnel (Perplexity API via backend proxy)
* une fonctionnalite de personnalisation
* un deploiement accessible en ligne

---

## Technologies et fonctionnalites techniques que je vais ajouter

* Vue.js (framework principal)
* Connexion utilisateur
* Creation de compte
* Supabase (auth + base de donnees pour stocker profils et historiques)
* Prise en compte du profil utilisateur par l IA
* Propositions et recommandations en fonction du profil
* API Perplexity (LLM pour le chatbot et les recommandations)
