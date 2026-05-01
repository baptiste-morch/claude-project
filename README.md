# Famille — partage

Petit site privé pour partager films, livres, jeux et vidéos en famille, et en
discuter en commentaires. Pensé pour être asynchrone et accessible à des proches
des deux côtés de l'Atlantique.

## Fonctionnalités

- Mot de passe familial unique (à transmettre une fois aux membres)
- Identification par prénom (cookie 1 an, modifiable via "Quitter")
- Publications typées : 🎬 Film, 📺 Série, 📚 Livre, 🎮 Jeu, 📽️ Vidéo
- **Auto-complétion** :
  - 🎬 Films & 📺 Séries → TMDB (titre fr, année, affiche, synopsis)
  - 📚 Livres → Google Books (titre, auteur, année, couverture)
  - 🎮 Jeux → IGDB via Twitch OAuth (titre, année, jaquette, résumé)
  - 📽️ Vidéos → coller une URL YouTube ou Vimeo, oEmbed remplit titre + miniature
- **Upload de photos** (jusqu'à 6 par publication, 8 Mo chacune)
- Commentaires sous chaque publication
- Flux chronologique avec compteurs commentaires + photos

## Backend Supabase déjà provisionné

Le projet `supabase-purple-zebra` est déjà créé avec le schéma et le bucket
`photos` :

- **Project URL** : `https://ouedelavypygwvxxuudv.supabase.co`
- **Project ref** : `ouedelavypygwvxxuudv`
- **Region** : `us-east-1`
- Tables `posts`, `comments` créées (RLS activé)
- Bucket Storage `photos` (public) créé

### Récupérer la clé service_role (manuel, une seule fois)

L'app utilise la clé `service_role` côté serveur uniquement (jamais exposée au
navigateur). Elle n'est pas accessible via API automatique pour des raisons de
sécurité — il faut la copier depuis le dashboard :

1. Ouvre https://supabase.com/dashboard/project/ouedelavypygwvxxuudv/settings/api
2. Section **Project API keys** → copie la valeur de `service_role` (secret)
3. Mets-la dans `.env.local` (en dev) ou Vercel (en prod) sous
   `SUPABASE_SERVICE_ROLE_KEY`

## Préparer TMDB (films/séries)

1. Crée un compte sur https://www.themoviedb.org puis une clé API
   (Settings → API → "API Key v3").
2. Mets-la dans `TMDB_API_KEY`.

## Préparer IGDB (jeux vidéo)

1. Crée une app sur https://dev.twitch.tv/console/apps (OAuth Client Credentials).
2. Récupère `Client ID` + `Client Secret` → variables `TWITCH_CLIENT_ID` et
   `TWITCH_CLIENT_SECRET`.

Google Books et YouTube/Vimeo oEmbed fonctionnent sans clé.

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
| `TWITCH_CLIENT_ID`             | Twitch app ID (pour IGDB).                      |
| `TWITCH_CLIENT_SECRET`         | Twitch app secret (pour IGDB).                  |
| `GOOGLE_BOOKS_API_KEY`         | Optionnel.                                      |

## Déploiement (Vercel + Supabase)

1. Push ce repo sur GitHub.
2. Importe le repo sur Vercel.
3. Ajoute les variables ci-dessus dans les **Environment Variables** Vercel.
4. Deploy. Supabase fait office de DB et Storage, le frontend tourne en
   serverless.

## Mettre le projet Supabase en pause

Free tier : si personne ne s'en sert pendant ~7 jours il se met en pause
automatiquement. Pour le réveiller, ouvre le dashboard ou redéploie. Aucun
risque de perte de données.

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
  api/search/route.ts                 # TMDB + Google Books + IGDB + oEmbed
lib/
  db.ts                               # Types + métadonnées
  supabase.ts                         # Client serveur (service_role)
  igdb.ts                             # Token Twitch OAuth pour IGDB
  session.ts                          # Cookies auth + prénom
  format.ts                           # timeAgo
supabase/
  schema.sql                          # Migration de référence
```

## Idées pour la suite

- Réactions emoji rapides sur publications/commentaires
- Spoilers cliquables
- Page agrégée par œuvre (regroupement multi-membres)
- Notifications email pour nouveaux commentaires
- Mode sombre
