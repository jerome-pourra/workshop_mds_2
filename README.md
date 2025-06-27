# Projet Workshop MyDigitalSchool (Juin 2025)

## Membres
- Jérôme
- Florian
- Esteban

## Description
Application web d'appels vocaux avec transcription automatique et formatage intelligent des entretiens. L'application permet de créer des appels entre deux personnes, d'enregistrer les conversations et de générer des transcriptions structurées.

## Architecture Technique

### Frontend
- **Framework :** Vue.js 3 + Vite
- **Styling :** TailwindCSS 4
- **State Management :** Pinia
- **Routing :** Vue Router 4
- **WebRTC :** Communication temps réel
- **Socket.IO :** Communication bidirectionnelle

### Backend  
- **Framework :** NestJS (Node.js)
- **WebSockets :** Socket.IO
- **Upload :** Multer
- **IA :** OpenAI API
- **Documentation :** Swagger

### Routes API Principales
```
POST /conversation/:uuid/join       # Rejoindre un appel
POST /conversation/:uuid/audio      # Upload audio
POST /conversation/:uuid/transcript # Générer transcription
POST /conversation/:uuid/format-transcript # Formater transcription
GET  /conversation/:uuid            # Récupérer infos appel
GET  /user/:uuid                    # Infos utilisateur
```

### Routes Frontend
```
/                                   # Page d'accueil
/join                              # Rejoindre un appel  
/call                              # Interface d'appel
/transcript/:conversationUuid/:userUuid # Transcription
```

## Lancement du projet

### Backend
```bash
cd backend
npm install
npm run start:dev  # Port 3000
```

### Frontend
```bash
cd frontend-dev
npm install
npm run dev       # Port 5173
```

## Guide de contribution

Voici les règles à suivre pour collaborer efficacement au développement.

### Branches principales

- `master` : branche de **production** – uniquement les versions stables y sont présentes.
- `devlop` : branche de **développement principal** – base pour toutes les nouvelles fonctionnalités ou correctifs.

### Workflow Git

1. **Création de fonctionnalités ou correctifs**
- À partir de la branche `devlop`, créez une branche dédiée :
  ```bash
  git checkout devlop
  git pull origin devlop
  git checkout -b feat/ma-nouvelle-feature
  ```
- Préfixes de branches recommandés :
  - `feat/` : pour une nouvelle fonctionnalité
  - `fix/` : pour une correction de bug
  - `tech/` : pour des modifications techniques 

2. **Travail sur la branche**
- Commitez régulièrement avec des messages clairs :
  ```bash
  git commit -m "feat: ajoute le composant Header"
  ```
- Une fois prêt, poussez la branche :
  ```bash
  git push origin feat/ma-nouvelle-feature
  ```

3. **Merge Request (MR) vers `devlop`**
- Ouvrez une merge request (aussi appelée pull request) de votre branche vers `devlop`.
- **Condition obligatoire** : la MR doit être **validée par les 3 membres** de l'équipe :
  - Florian
  - Esteban
  - Jérôme

4. **Merge vers `master`**
- Une fois la branche `devlop` **stable et testée**, elle peut être mergée dans `master` pour la mise en production.

### Récapitulatif des règles

- **Pas de push direct sur `devlop` ni `master`**.
- Toujours créer une branche depuis `devlop`.
- Les MRs vers `devlop` doivent être **relues et validées par Florian, Esteban et Jérôme**.
- `master` représente la **version en production**, à ne modifier que via des MRs depuis `devlop`.

Merci de respecter **dans la mesure du possible** ce processus afin de garantir la qualité et la stabilité du projet.
