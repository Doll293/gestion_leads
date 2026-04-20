# Gestion des Leads

Application web de gestion de prospects (leads) avec un backend Node.js/Express, un frontend React/Vite et une base de données MySQL, le tout orchestré avec Docker Compose.

---

## Architecture Docker

| Réseau | Services | Rôle |
|--------|----------|------|
| `db_net` | mysql, phpmyadmin, backend | Couche données |
| `web_net` | backend, frontend | Couche présentation |

### Volumes

| Volume | Rôle |
|--------|------|
| `mysql_data` | Persistance de la base de données MySQL |

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré

---

## Installation et démarrage

### 1. Lancer tous les services

```bash
docker compose up -d
```

### 2. Vérifier que tout tourne

```bash
docker compose ps
```

---

## URLs des services

| Service | URL |
|---------|-----|
| Frontend React | http://localhost:5173 |
| API Backend | http://localhost:8081 |
| phpMyAdmin | http://localhost:8080 |

---

## Commandes utiles

Voir les logs d'un service :
```bash
docker logs gestion-leads-backend -f
docker logs gestion-leads-frontend -f
```

Accéder au shell du backend :
```bash
docker exec -it gestion-leads-backend sh
```

Arrêter tous les services :
```bash
docker compose down
```

Arrêter et supprimer les volumes (reset complet) :
```bash
docker compose down -v
```

---

## Fonctionnalités

- Lister tous les leads
- Ajouter un lead (nom, statut, tél, adresse, commentaire)
- Modifier un lead existant
- Supprimer un lead
- Recherche en temps réel sur tous les champs

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Backend | Node.js 20, Express 4 |
| Frontend | React 18 + Vite 5 |
| Base de données | MySQL 8.0 |
| Conteneurisation | Docker Compose |
