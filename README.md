# Portfolio Full-Stack Java / Angular

Portfolio professionnel full-stack permettant de présenter des projets, gérer dynamiquement le contenu depuis un espace administrateur sécurisé, recevoir des messages de contact, gérer un CV en ligne, administrer les contenus légaux, personnaliser l’apparence du site et déployer l’ensemble automatiquement via GitHub et Render.

Le projet est conçu avec une séparation claire entre le frontend public, l’interface d’administration et le backend API. L’objectif est d’obtenir une application moderne, maintenable, responsive, performante, sécurisée et compatible avec une mise en production professionnelle.

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Stack technique](#stack-technique)
- [Architecture générale](#architecture-générale)
- [Frontend](#frontend)
- [Backend](#backend)
- [Base de données et stockage](#base-de-données-et-stockage)
- [Sécurité](#sécurité)
- [SEO, performance et accessibilité](#seo-performance-et-accessibilité)
- [Internationalisation](#internationalisation)
- [Apparence dynamique](#apparence-dynamique)
- [Déploiement](#déploiement)
- [Variables d’environnement](#variables-denvironnement)
- [Installation locale](#installation-locale)
- [Scripts utiles](#scripts-utiles)
- [Tests](#tests)
- [Bonnes pratiques respectées](#bonnes-pratiques-respectées)
- [Évolutions possibles](#évolutions-possibles)
- [État du projet](#état-du-projet)
- [Auteur](#auteur)

---

## Présentation

Ce portfolio a pour objectif de présenter un profil développeur full-stack de manière professionnelle, tout en permettant une gestion dynamique du contenu depuis une interface administrateur.

Le site permet notamment :

- d’afficher des projets côté public ;
- de gérer les projets depuis un dashboard admin ;
- de modifier les sections dynamiques du site ;
- de gérer les messages reçus depuis le formulaire de contact ;
- de gérer le CV PDF ;
- de gérer les mentions légales et la politique de confidentialité ;
- de traduire certains contenus en anglais ;
- de personnaliser la couleur principale du site depuis l’administration ;
- de conserver une architecture propre, scalable et maintenable.

Le projet respecte une logique full-stack moderne avec un frontend Angular standalone, un backend Spring Boot en architecture hexagonale, une base PostgreSQL Neon, Cloudinary pour les fichiers et Render pour le déploiement.

---

## Fonctionnalités principales

### Partie publique

- Page d’accueil dynamique.
- Présentation des projets.
- Filtres projets.
- Page de détail projet.
- Génération PDF côté frontend.
- Section Hero dynamique.
- Section About dynamique.
- Section Contact dynamique.
- Formulaire de contact fonctionnel.
- Envoi email via Brevo SMTP.
- Sauvegarde des messages de contact en base.
- Pages légales dynamiques :
  - mentions légales ;
  - politique de confidentialité.
- Affichage du CV PDF.
- Prévisualisation PDF.
- Interface responsive desktop/mobile.
- Mode clair, sombre et automatique.
- Couleur principale dynamique chargée depuis le backend.
- SEO avec sitemap, robots.txt et SSR/prerender.

### Partie administration

- Authentification admin via JWT.
- Dashboard administrateur.
- CRUD complet des projets.
- Drag & drop pour l’ordre des projets.
- Duplication de projet.
- Upload images via Cloudinary.
- Optimisation images WebP via Cloudinary.
- Upload du CV PDF via Cloudinary.
- Gestion des sections dynamiques :
  - Hero ;
  - About ;
  - Contact ;
  - CV ;
  - Legal ;
  - Apparence.
- Traduction automatique admin via DeepL.
- Éditeur riche maison pour les contenus HTML simples.
- Sanitization HTML côté backend.
- Gestion des messages de contact :
  - liste paginée ;
  - détail ;
  - recherche backend ;
  - filtres ;
  - lu / non lu ;
  - archivage ;
  - suppression ;
  - actions groupées ;
  - statistiques ;
  - badge messages non lus.
- Page Apparence :
  - modification de la couleur principale ;
  - prévisualisation immédiate ;
  - sauvegarde en base PostgreSQL ;
  - bouton de réinitialisation vers la couleur d’origine ;
  - application côté public.

---

## Stack technique

### Frontend

- Angular standalone : 17.3.x
- Angular CLI : 17.3.17
- Angular CDK : 17.3.10
- Angular SSR / prerender : 17.3.17
- TailwindCSS : 3.4.19
- ngx-translate : 17.0.0
- Lucide Angular : 1.0.0
- RxJS : 7.8.x
- TypeScript : 5.4.x
- Zone.js : 0.14.x
- pdfjs-dist : 5.5.207
- jsPDF : 2.5.x
- html2canvas : 1.4.1
- Express : 4.18.x, utilisé pour le serveur SSR Angular

### Backend

- Java : 17
- Spring Boot : 3.5.10
- Spring Security : version gérée par Spring Boot 3.5.10
- Spring Data JPA : version gérée par Spring Boot 3.5.10
- Spring Validation : version gérée par Spring Boot 3.5.10
- Spring Mail / JavaMailSender : version gérée par Spring Boot 3.5.10
- JWT avec JJWT : 0.12.5
- PostgreSQL JDBC Driver : version gérée par Spring Boot 3.5.10
- Springdoc OpenAPI : 2.7.0
- Cloudinary Java SDK : 2.3.2
- DeepL Java SDK : 1.16.0
- JSoup : 1.17.2
- JUnit / Mockito / Spring Boot Test : versions gérées par Spring Boot 3.5.10
- Maven : utilisé pour la compilation, les tests et le packaging backend

### Base de données

- PostgreSQL via Neon
- Persistance avec Spring Data JPA / Hibernate
- Création et mise à jour du schéma via la configuration JPA du projet

### Hébergement

- Render pour le frontend
- Render pour le backend
- GitHub pour le versioning et le déploiement automatique

### Stockage fichiers

- Cloudinary pour les images projets
- Cloudinary pour les images optimisées WebP
- Cloudinary pour le CV PDF

### Services externes

- Brevo SMTP pour l’envoi des emails
- DeepL API pour la traduction automatique
- cron-job.org pour le cron anti-sleep Render

---

## Architecture générale

Le projet est séparé en deux applications principales :

```txt
frontend/
backend/
```

Le frontend Angular consomme l’API backend Spring Boot.

Les routes publiques utilisent des endpoints publics, tandis que les routes d’administration utilisent des endpoints protégés par JWT.

Flux général :

```txt
Utilisateur public
    ↓
Frontend Angular public
    ↓
API publique Spring Boot
    ↓
PostgreSQL / Cloudinary / Brevo

Administrateur
    ↓
Frontend Angular admin
    ↓
API admin sécurisée JWT
    ↓
PostgreSQL / Cloudinary / DeepL
```

---

## Frontend

### Organisation principale

```txt
src/app/
├── core/
├── shared/
├── sections/
├── pages/
│   ├── public/
│   └── admin/
├── layout/
└── assets/i18n/
```

### Rôle des dossiers

#### `core/`

Contient les services globaux :

- appels API ;
- authentification ;
- guards ;
- SEO ;
- i18n ;
- configuration runtime ;
- thème ;
- apparence dynamique.

#### `shared/`

Contient les éléments réutilisables :

- composants UI ;
- modèles TypeScript ;
- validators ;
- directives ;
- utils ;
- services partagés.

#### `sections/`

Contient les grandes sections publiques du portfolio :

- Hero ;
- About ;
- Projects ;
- Contact.

#### `pages/public/`

Contient les pages publiques :

- accueil ;
- détail projet ;
- mentions légales ;
- politique de confidentialité.

#### `pages/admin/`

Contient les pages d’administration :

- dashboard ;
- projets ;
- formulaire projet ;
- hero ;
- about ;
- contact ;
- CV ;
- legal ;
- messages ;
- apparence.

#### `layout/`

Contient les layouts :

- layout public ;
- layout admin.

#### `assets/i18n/`

Contient les fichiers de traduction :

- français ;
- anglais.

---

## Backend

### Architecture hexagonale

Le backend suit une architecture hexagonale pour séparer clairement le domaine métier, les cas d’usage, les technologies externes et l’exposition HTTP.

Organisation principale :

```txt
src/main/java/com/portfolio/portfolio_backend/
├── domain/
├── application/
├── infrastructure/
└── web/
```

### `domain/`

Contient le cœur métier :

- modèles métier ;
- règles métier ;
- ports de sortie.

Exemples :

```txt
domain/model/
domain/port/out/
```

### `application/`

Contient les services applicatifs :

- orchestration des cas d’usage ;
- validation métier ;
- appels aux ports ;
- logique applicative.

Exemples :

```txt
application/service/
```

### `infrastructure/`

Contient les implémentations techniques :

- persistance JPA ;
- repositories Spring Data ;
- mappers ;
- sécurité ;
- Cloudinary ;
- SMTP ;
- DeepL ;
- configuration technique.

Exemples :

```txt
infrastructure/persistence/
infrastructure/security/
infrastructure/cloudinary/
```

### `web/`

Contient la couche HTTP :

- controllers REST ;
- DTO ;
- réponses API ;
- gestion des exceptions.

Exemples :

```txt
web/controller/
web/dto/
web/exception/
web/response/
```

---

## Base de données et stockage

### PostgreSQL Neon

La base PostgreSQL est hébergée sur Neon.

Elle stocke notamment :

- les projets ;
- les contenus dynamiques ;
- les messages de contact ;
- les contenus légaux ;
- les paramètres d’apparence ;
- les informations nécessaires au dashboard admin.

### Cloudinary

Cloudinary est utilisé pour :

- les images projets ;
- les versions optimisées WebP ;
- le CV PDF ;
- la persistance des fichiers en production.

Cela permet d’éviter les pertes de fichiers liées au fonctionnement éphémère du système de fichiers Render.

---

## Sécurité

Le projet applique plusieurs protections :

- authentification admin via JWT ;
- endpoints admin protégés ;
- séparation stricte entre API publique et API admin ;
- validation backend stricte ;
- validation frontend cohérente ;
- anti-spam sur le formulaire de contact ;
- honeypot ;
- rate limit ;
- sanitization HTML via JSoup ;
- secrets stockés uniquement via variables d’environnement ;
- erreurs SMTP non exposées au visiteur public ;
- endpoint `/api/health` public, rapide et sans données sensibles.

### API publique

Les endpoints publics permettent uniquement la lecture ou les actions nécessaires côté visiteur.

Exemples :

```txt
GET /api/public/...
POST /api/contact
GET /api/health
```

### API admin

Les endpoints admin sont protégés par JWT.

Exemples :

```txt
GET /api/admin/...
POST /api/admin/...
PUT /api/admin/...
PATCH /api/admin/...
DELETE /api/admin/...
```

---

## SEO, performance et accessibilité

Le projet intègre plusieurs éléments pour améliorer le rendu public :

- SSR / prerender ;
- sitemap dynamique ;
- robots.txt ;
- JSON-LD ;
- HTML sémantique ;
- responsive mobile ;
- optimisation des images Cloudinary ;
- lazy loading ;
- gestion des erreurs accessible ;
- focus visible ;
- navigation clavier ;
- limitation des appels API inutiles ;
- endpoints publics simples et rapides.

---

## Internationalisation

Le frontend utilise `ngx-translate`.

Les traductions sont organisées dans :

```txt
assets/i18n/
```

Langues prévues :

```txt
fr
en
```

L’administration permet aussi de déclencher une traduction automatique de certains contenus via DeepL.

---

## Apparence dynamique

La page admin Apparence permet de gérer la couleur principale du portfolio.

Fonctionnalités :

- lecture de la couleur actuelle depuis le backend ;
- sauvegarde en PostgreSQL ;
- application côté public ;
- prévisualisation immédiate côté admin ;
- bouton de réinitialisation ;
- fallback propre si aucune configuration n’existe encore.

Couleur d’origine :

```txt
#c5a567
```

Cette couleur correspond au doré historique du site.

Endpoints utilisés :

```txt
GET  /api/public/appearance
GET  /api/admin/appearance
PUT  /api/admin/appearance
POST /api/admin/appearance/reset
```

Exemple de payload :

```json
{
  "accentColor": "#c5a567"
}
```

Le thème clair / sombre / auto reste indépendant de cette configuration.

---

## Déploiement

Le projet est déployé avec :

- GitHub pour le versioning ;
- Render pour le backend ;
- Render pour le frontend ;
- Neon pour PostgreSQL ;
- Cloudinary pour les fichiers ;
- Brevo pour l’envoi SMTP ;
- cron-job.org pour limiter le cold start du backend Render.

### Health check

Le backend expose :

```txt
GET /api/health
```

Cet endpoint est public, rapide et ne renvoie aucune donnée sensible.

Il est utilisé par Render et par cron-job.org.

### Cron anti-sleep

Un cron externe appelle régulièrement :

```txt
https://portfolio-api-ak2s.onrender.com/api/health
```

Cela réduit fortement le cold start Render sur plan gratuit, sans garantir une disponibilité parfaite.

---

## Variables d’environnement

Les variables exactes peuvent dépendre de l’environnement local ou Render.

### Backend

Exemples de variables attendues :

```env
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

DEEPL_API_KEY=

SPRING_MAIL_HOST=
SPRING_MAIL_PORT=2525
SPRING_MAIL_USERNAME=
SPRING_MAIL_PASSWORD=

ADMIN_EMAIL=
ADMIN_PASSWORD=
```

### Frontend

Exemple :

```env
API_BASE_URL=
```

Selon la configuration réelle du projet, certaines valeurs peuvent être gérées via des fichiers de configuration runtime.

---

## Installation locale

### Prérequis

- Node.js
- npm
- Java 17
- Maven
- PostgreSQL ou accès Neon
- Compte Cloudinary
- Compte Brevo
- Clé API DeepL si la traduction automatique est utilisée

---

## Lancer le backend

Depuis le dossier backend :

```bash
cd backend
mvn spring-boot:run
```

Ou avec le wrapper Maven si disponible :

```bash
cd backend
./mvnw spring-boot:run
```

Backend local :

```txt
http://localhost:8080
```

Test rapide :

```bash
curl http://localhost:8080/api/health
```

---

## Lancer le frontend

Depuis le dossier frontend :

```bash
cd frontend
npm install
npm start
```

Frontend local :

```txt
http://localhost:4200
```

---

## Scripts utiles

### Frontend

```bash
npm install
npm start
npm run build
npm run serve:ssr:frontend
```

### Backend

```bash
mvn test
mvn spring-boot:run
```

---

## Tests

Le backend utilise :

- JUnit ;
- Mockito ;
- Spring Boot Test ;
- MockMvc pour les controllers.

Les tests sont placés dans :

```txt
src/test/java/
```

Exemples de tests couverts :

- services applicatifs ;
- controllers admin ;
- controllers publics ;
- messages de contact ;
- paramètres d’apparence ;
- validation métier ;
- actions groupées ;
- pagination ;
- recherche backend.

Commande :

```bash
cd backend
mvn test
```

---

## Bonnes pratiques respectées

Le projet applique plusieurs bonnes pratiques :

- séparation public / admin ;
- architecture hexagonale backend ;
- Angular standalone ;
- composants réutilisables ;
- DTO dédiés ;
- validation frontend et backend ;
- gestion centralisée des erreurs ;
- endpoints publics limités ;
- endpoints admin protégés ;
- fichiers persistés hors Render via Cloudinary ;
- base PostgreSQL externe via Neon ;
- déploiement automatisé ;
- thème clair / sombre / auto ;
- couleur principale persistante ;
- UI admin responsive ;
- design cohérent ;
- tests backend ;
- SSR / prerender conservé.

---

## Évolutions possibles

Le développement fonctionnel principal est terminé.

Les évolutions futures possibles concernent surtout le polish UX/UI :

- amélioration fine du rendu mobile ;
- amélioration de certaines micro-interactions ;
- audit accessibilité plus poussé ;
- amélioration de l’éditeur riche maison ;
- ajout optionnel d’un logo administrable ;
- amélioration visuelle de certaines cartes publiques ;
- harmonisation encore plus fine des états hover/focus ;
- amélioration du contraste selon les couleurs choisies ;
- ajout éventuel de presets de couleurs dans la page Apparence.

Ces évolutions ne sont pas bloquantes pour le fonctionnement actuel du site.

---

## État du projet

Le projet est considéré comme fonctionnellement terminé.

Fonctionnalités principales terminées :

- portfolio public ;
- dashboard admin ;
- gestion projets ;
- gestion messages ;
- gestion CV ;
- gestion contenus légaux ;
- contact avec email et sauvegarde base ;
- traduction admin ;
- sécurité JWT ;
- Cloudinary ;
- Neon PostgreSQL ;
- Render ;
- SSR/prerender ;
- apparence persistante ;
- bouton de réinitialisation couleur ;
- health check ;
- cron anti-sleep.

---

## Auteur

Projet développé par Jamel BOUAZZA.

Objectif : créer un portfolio full-stack professionnel, maintenable, sécurisé et évolutif, en appliquant une architecture propre et des pratiques modernes de développement web.