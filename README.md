# Famille — partage

Petit site privé pour partager films, livres, jeux et vidéos en famille, et en
discuter en commentaires. Pensé pour être asynchrone et accessible à des proches
des deux côtés de l'Atlantique.

## Fonctionnalités

- Mot de passe familial unique (à transmettre une fois aux membres)
- Identification par prénom (cookie 1 an, modifiable via "Quitter")
- Publications typées : 🎬 Film, 📺 Série, 📚 Livre, 🎮 Jeu, 📽️ Vidéo
- **Auto-complétion** des films/séries (TMDB) et livres (Google Books)
  → titre, année, et affiche/couverture récupérés automatiquement
- **Upload de photos** (jusqu'à 6 par publication, 8 Mo chacune)
- Commentaires sous chaque publication
- Flux chronologique, comptes de commentaires + photos

## Préparer le backend Supabase

1. Crée un projet sur https://supabase.com (free tier suffit largement).
2. Dans **SQL Editor**, colle et exécute le contenu de `supabase/schema.sql`.
   Cela crée les tables `posts`, `comments` et le bucket Storage `photos`.
3. Récupère dans **Project Settings → API** :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ La clé `service_role` doit rester côté serveur uniquement. Elle n'est jamais
> envoyée au navigateur dans cette app.

## Préparer TMDB (films/séries)

1. Crée un compte sur https://www.themoviedb.org puis une clé API
   (Settings → API → "API Read Access Token" ou "API Key v3").
2. Mets-la dans `TMDB_API_KEY`.

Google Books fonctionne sans clé pour notre usage.

## Démarrage local

```bash
cp .env.example .env.local
# édite .env.local avec tes valeurs

npm install
npm run dev
```

Site dispo sur http://localhost:3000.

## Variables d'environnement

| Variable                       | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `FAMILY_PASSWORD`              | Mot de passe partagé pour entrer.               |
| `NEXT_PUBLIC_SUPABASE_URL`     | URL de ton projet Supabase.                     |
| `SUPABASE_SERVICE_ROLE_KEY`    | Clé service_role Supabase (server-only).        |
| `TMDB_API_KEY`                 | Clé API TMDB pour film/série.                   |
| `GOOGLE_BOOKS_API_KEY`         | Optionnel.                                      |

## Déploiement (Vercel + Supabase)

1. Push ce repo sur GitHub.
2. Importe le repo sur Vercel.
3. Ajoute les variables ci-dessus dans les **Environment Variables** Vercel.
4. Deploy. C'est tout — Supabase fait office de DB et Storage, le frontend
   tourne en serverless.

## Structure

```
app/
  layout.tsx                          # Header + auth-aware
  page.tsx                            # Flux des publications
  login/page.tsx                      # Mot de passe + prénom
  new/page.tsx                        # Page nouvelle publication
  new/NewPostForm.tsx                 # Form client (autocomplete + photos)
  p/[id]/page.tsx                     # Détail + commentaires + photos
  api/login/route.ts
  api/logout/route.ts
  api/posts/route.ts                  # Création posts + upload photos
  api/posts/[id]/comments/route.ts
  api/search/route.ts                 # TMDB + Google Books
lib/
  db.ts                               # Types + métadonnées
  supabase.ts                         # Client serveur (service_role)
  session.ts                          # Cookies auth + prénom
  format.ts                           # timeAgo
supabase/
  schema.sql                          # Tables + bucket à exécuter une fois
```

## Idées pour la suite

- IGDB pour l'autocomplétion des jeux (nécessite un compte Twitch)
- YouTube oEmbed pour aperçu des vidéos
- Réactions emoji rapides sur publications/commentaires
- Page agrégée par œuvre (regroupement multi-membres)
- Notifications email pour nouveaux commentaires
- Spoilers cliquables
