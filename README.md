# Famille — partage

Petit site privé pour partager films, livres, jeux et vidéos en famille, et en
discuter en commentaires. Pensé pour être asynchrone et accessible à des proches
des deux côtés de l'Atlantique.

## V1 — fonctionnalités

- Mot de passe familial unique (à transmettre une fois aux membres)
- Identification par prénom (stocké en cookie, modifiable via "Quitter")
- Publications typées : 🎬 Film, 📺 Série, 📚 Livre, 🎮 Jeu, 📽️ Vidéo
- Commentaires sous chaque publication
- Flux chronologique d'accueil

## Démarrage local

```bash
cp .env.example .env.local
# édite .env.local et choisis un FAMILY_PASSWORD

npm install
npm run dev
```

Le site est dispo sur http://localhost:3000.

## Variables d'environnement

| Variable          | Description                                    |
| ----------------- | ---------------------------------------------- |
| `FAMILY_PASSWORD` | Mot de passe partagé pour entrer sur le site.  |
| `DATABASE_PATH`   | Optionnel. Par défaut `data/app.db` (SQLite).  |

## Déploiement

Le MVP utilise SQLite. Recommandé :

- **Fly.io / Railway / VPS / Raspberry Pi** : SQLite fonctionne directement.
  Monte un volume persistant pour `data/` et c'est parti.
- **Vercel** : SQLite ne persiste pas (filesystem éphémère). Pour Vercel,
  remplace `lib/db.ts` par un client Postgres (ex. Supabase / Neon) — la
  structure des deux tables `posts` et `comments` est triviale à porter.

## Structure

```
app/
  layout.tsx          # Header + auth-aware
  page.tsx            # Flux des publications
  login/page.tsx      # Mot de passe + prénom
  new/page.tsx        # Formulaire nouvelle publication
  p/[id]/page.tsx     # Détail + commentaires
  api/login/route.ts
  api/logout/route.ts
  api/posts/route.ts
  api/posts/[id]/comments/route.ts
lib/
  db.ts               # SQLite + schéma
  session.ts          # Cookies (auth + prénom)
  format.ts           # timeAgo
```

## Idées pour la suite

- Auto-complétion du titre via TMDB (films/séries) et Google Books (livres),
  avec affiche/couverture automatique
- Upload de photos (souvenirs, captures, dédicaces)
- Réactions emoji rapides sur les commentaires
- Page par œuvre (regroupement multi-membres)
- Notifications email/RSS pour nouveaux commentaires
