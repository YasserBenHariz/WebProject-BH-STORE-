# WebProject-BH-STORE-
# 🛒 BH STORE

## 📌 Description

BH STORE est une plateforme E-Commerce moderne développée pour la vente de smartphones, accessoires et pièces de rechange.

Le site permet aux utilisateurs de parcourir les produits disponibles, rechercher rapidement un article, ajouter des produits au panier, créer un compte et passer des commandes en ligne.

Le projet a été développé dans le cadre d'un apprentissage du développement Web Full Stack en utilisant PHP, MySQL, HTML, CSS et JavaScript.

---

## ✨ Fonctionnalités Principales

### 👤 Gestion des Utilisateurs
- Inscription des nouveaux utilisateurs
- Connexion sécurisée
- Déconnexion
- Gestion de session utilisateur

### 📱 Catalogue Produits
- Smartphones
- Accessoires
- Pièces de rechange

### 🔍 Recherche Intelligente
- Recherche dynamique des produits
- Affichage rapide des résultats

### 🛍️ Panier d'Achat
- Ajout de produits
- Modification des quantités
- Calcul automatique du total

### 📦 Gestion des Commandes
- Validation des commandes
- Enregistrement dans la base de données
- Historique des commandes

### ⚙️ Administration
- Tableau de bord administrateur
- Gestion des produits
- Suivi des commandes

### 📱 Responsive Design
- Compatible PC
- Compatible Tablette
- Compatible Mobile

---

## 🛠️ Technologies Utilisées

### Front-End
- HTML5
- CSS3
- JavaScript

### Back-End
- PHP

### Base de Données
- MySQL

---

## 🗄️ Structure de la Base de Données

### users
Gestion des comptes utilisateurs :

- id
- name
- email
- password
- created_at
- updated_at

### products
Stockage des produits :

- id
- name
- brand
- category
- specs
- price
- old_price
- image

### commandes
Gestion des commandes :

- id
- user_id
- items
- total
- status
- created_at

---

## 📂 Structure du Projet

```
BHSTORE/
│
├── index.html
├── style.css
├── login.php
├── register.php
├── logout.php
├── save_commande.php
├── get_products.php
├── config.php
│
├── admin.html
├── admin.php
├── admin.css
├── admin.js
│
├── DATABASE.sql
│
└── Images Produits
```

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/VOTRE-USERNAME/BHSTORE.git
```

### 2. Importer la base de données

Importer le fichier :

```sql
DATABASE.sql
```

dans phpMyAdmin.

### 3. Configurer la connexion MySQL

Modifier :

```php
config.php
```

avec vos informations :

```php
$host = "localhost";
$user = "root";
$password = "";
$database = "bh_store";
```

### 4. Lancer le projet

Placer le dossier dans :

```text
xampp/htdocs/
```

Puis ouvrir :

```text
http://localhost/BHSTORE
```

---

## 🎯 Objectifs du Projet

- Mettre en pratique le développement Web Full Stack.
- Comprendre l'intégration Front-End / Back-End.
- Utiliser PHP et MySQL dans une application réelle.
- Développer une plateforme E-Commerce fonctionnelle.

---

## 📍 Localisation

BH STORE – Ajim, Djerba, Tunisie

---

## 👨‍💻 Auteur

**BH YASSER**

Étudiant en Informatique – Génie Logiciel

Projet E-Commerce développé dans le cadre de l'apprentissage du développement Web.

---

## 📄 Licence

Projet académique et éducatif.
