# 🧪 Atom → Univers

**Atom → Univers** est un idle/clicker cosmique. Chaque clic forge des atomes, chaque atome alimente vos laboratoires, et votre objectif ultime reste d’atteindre \(10^{80}\) atomes afin de reconstituer un univers entier.

Le jeu combine plusieurs boucles complémentaires :

* **Clic manuel (APC)** : appuyez sur l’atome central pour générer instantanément des ressources.
* **Production passive (APS)** : investissez dans des bâtiments scientifiques qui produisent automatiquement.
* **Moments de frénésie** : capturez les orbes de frénésie pour multiplier temporairement vos gains.
* **Collection** : utilisez des tickets pour déclencher le gacha et étendre votre tableau périodique, chaque élément offrant des bonus croissants.

---

## ⚙️ Ressources & progression

* Les atomes servent à acheter des améliorations, débloquer de nouveaux bâtiments et augmenter la puissance de vos clics.
* Une arithmétique à couches gère les très grands nombres : notation classique, scientifique, puis double exponentielle (`ee`). Il n’existe pas de plafond théorique.
* Les sauvegardes utilisent un export/import JSON qui retient mantisses et exposants pour les sessions hors ligne.

---

## 🏭 Bâtiments scientifiques

Les bâtiments sont regroupés par rôle (manuel, automatique, hybride) et se renforcent avec des paliers :

* **Paliers ×2 / ×4** aux niveaux 10, 25, 50, 100, 150, 200 (puis 300/400/500 pour ×4).
* Plusieurs synergies croisées existent, par exemple l’Accélérateur de particules qui renforce les Laboratoires de physique, ou les Supercalculateurs boostés par les Stations orbitales.
* Les descriptions détaillées se trouvent directement en jeu et dans `game-config.js`.

---

## 🎟️ Tickets de gacha

Le gacha ne consomme plus d’atomes : chaque tirage coûte **1 ticket**.

### Collecte des tickets

* Une **étoile de tickets** apparaît sur l’écran principal toutes les ~60 secondes (intervalle moyen). Cliquez dessus pour obtenir des tickets.
* Les éléments de rareté **Mythe quantique** réduisent cet intervalle d’1 s par élément unique, jusqu’à un minimum de 5 s.
* Certaines récompenses d’événements ou de DevKit peuvent également octroyer des tickets bonus.

### Tirages

* Un bouton dédié lance une animation cosmique et consomme automatiquement 1 ticket (sauf modes gratuits spéciaux).
* Les éléments tirés s’ajoutent à votre collection : les nouveaux éléments octroient des bonus “unique”, tandis que les doublons activent des effets “duplicate”.
* Chaque tirage affiche la rareté, le nom de l’élément et l’état de votre collection (nouveau/doublon/max).

### Raretés et probabilités

| Rareté | Poids | Description |
| --- | --- | --- |
| **Commun cosmique** | 55 % | Les éléments omniprésents dans les nébuleuses. |
| **Essentiel planétaire** | 20 % | Les fondations des mondes rocheux et océaniques. |
| **Forge stellaire** | 12 % | Alliages forgés au cœur des étoiles actives. |
| **Singularité minérale** | 7 % | Cristaux rarissimes difficiles à stabiliser. |
| **Mythe quantique** | 4 % | Éléments quasi légendaires, aux effets systémiques. |
| **Irréel** | 2 % | Créations synthétiques, jamais observées naturellement. |

---

## 💠 Bonus par rareté

Chaque groupe de rareté dispose d’une configuration propre. Les bonus sont cumulés par élément, puis complétés par des récompenses de collection :

### Commun cosmique

* **Par copie** : +1 atome par clic.
* **Collection complète** : +500 APC plats.
* **Accumulation** : toutes les 50 copies, +1 au multiplicateur global (APC & APS).

### Essentiel planétaire

* **Par élément unique** : +10 APC plats. Les doublons donnent également +10 APC.
* **Collection complète** : +1 000 APC plats.
* **Accumulation** : toutes les 30 copies, +1 au multiplicateur global (APC & APS).

### Forge stellaire

* **Par élément unique** : +50 APC plats.
* **Par doublon** : +25 APC plats.
* **Collection complète** : multiplie par 2 les bonus plats apportés par les Commun cosmique.
* **Accumulation** : toutes les 20 copies, +1 au multiplicateur global (APC & APS).

### Singularité minérale

* **Par élément unique** : +25 APC et +25 APS plats.
* **Par doublon** : +20 APC et +20 APS plats.
* **Accumulation** : toutes les 10 copies, +1 au multiplicateur global (APC & APS).

### Mythe quantique

* **Réduction des tickets** : chaque élément unique réduit de 1 s l’intervalle d’apparition de l’étoile à tickets (minimum 5 s).
* **Hors-ligne** : chaque doublon ajoute +1 % de gains hors-ligne (jusqu’à +100 %). Au-delà du plafond, chaque doublon offre +50 APC et +50 APS plats.
* **Collection complète** : +50 % de chances supplémentaires de déclencher une frénésie.

### Irréel

* **Par élément unique** : +1 % de chance de critique (cumulatif).
* **Par doublon** : +1 % au multiplicateur de critique.
* **Accumulation** : toutes les 5 copies, +1 au multiplicateur global (APC & APS).

---

## 📈 Progression de collection (recommandation indicative)

* **Début** : sécuriser les Commun cosmique et Essentiel planétaire pour accélérer les clics.
* **Milieu de partie** : les Forge stellaire et Singularité minérale installent de véritables moteurs APS/APC.
* **Fin de partie** : Mythe quantique et Irréel débloquent la gestion avancée des tickets, du hors-ligne, des critiques et des frénésies.

---

## 🧰 Encart spécial : bonus & modificateurs cumulés

Ce mémo récapitule l’ensemble des bonus actuellement en jeu. Il couvre les bâtiments de la boutique, les collections d’éléments, les succès et la fusion moléculaire, ainsi que leurs effets sur l’APC, l’APS, les frénésies, les critiques ou la génération de tickets.

### 🏪 Boutique scientifique

| Bâtiment | Rôle | Bonus principaux |
| --- | --- | --- |
| **Électrons libres** | Manuel | +1 APC plat/niveau, +5 % APC tous les 25 niveaux, chaque palier ×2/×4 ajoute +2 % APC supplémentaires.【F:config/config.js†L47-L68】 |
| **Laboratoire de Physique** | Automatique | +1 APS plat/niveau (paliers ×2/×4), +5 % APC tous les 10 labos, +20 % APS si l’Accélérateur ≥200.【F:config/config.js†L71-L123】 |
| **Réacteur nucléaire** | Automatique | +10 APS plat/niveau (paliers ×2/×4), +1 % APS par 50 Électrons, +20 % APS si les Labos ≥200, palier 150 : APC global ×2.【F:config/config.js†L96-L123】 |
| **Accélérateur de particules** | Hybride | +50 APS plat/niveau (boosté par ≥100 Supercalculateurs), +2 % APC par niveau, palier 200 : +20 % APS pour les Labos.【F:config/config.js†L125-L145】 |
| **Supercalculateurs** | Automatique | +500 APS plat/niveau (paliers ×2/×4), doublés par les Stations ≥300, +1 % APS global tous les 25 niveaux.【F:config/config.js†L147-L170】 |
| **Sonde interstellaire** | Hybride | +5 000 APS plat/niveau (boosté par les Réacteurs), palier 150 : +10 APC plats par sonde.【F:config/config.js†L172-L197】 |
| **Station spatiale** | Hybride | +50 000 APS plat/niveau (paliers ×2/×4), +5 % APC par station, palier 300 : Supercalculateurs ×2.【F:config/config.js†L199-L216】 |
| **Forgeron d’étoiles** | Hybride | +500 000 APS plat/niveau (+2 % APS par Station), palier 150 : +25 % APC global.【F:config/config.js†L217-L241】 |
| **Galaxie artificielle** | Automatique | +5 000 000 APS plat/niveau (doublée par Bibliothèque ≥300), +10 % APS multiplicatif par niveau, palier 100 : +50 % APC global.【F:config/config.js†L242-L271】 |
| **Simulateur de Multivers** | Automatique | +500 000 000 APS plat/niveau (paliers ×2/×4) et +0,5 % APS global par bâtiment possédé, palier 200 : coûts −5 %.【F:config/config.js†L273-L293】 |
| **Tisseur de Réalité** | Hybride | +10 000 000 000 APS plat/niveau (paliers ×2/×4), bonus de clic plat = 0,1 × bâtiments × niveau, palier 300 : production totale ×2.【F:config/config.js†L295-L321】 |
| **Architecte Cosmique** | Hybride | +1 000 000 000 000 APS plat/niveau (paliers ×2/×4), −1 % coût futur par Architecte, palier 150 : +20 % APC global.【F:config/config.js†L323-L341】 |
| **Univers parallèle** | Automatique | +100 000 000 000 000 APS plat/niveau (paliers ×2/×4).【F:config/config.js†L343-L358】 |
| **Bibliothèque de l’Omnivers** | Hybride | +10 000 000 000 000 000 APS plat/niveau (paliers ×2/×4), +2 % boost global par Univers parallèle, palier 300 : Galaxies artificielles ×2.【F:config/config.js†L360-L384】 |
| **Grand Ordonnateur Quantique** | Hybride | +1 000 000 000 000 000 000 APS plat/niveau (paliers ×2/×4), palier 100 : double définitivement APC & APS.【F:config/config.js†L386-L403】 |

### 🧬 Collections d’éléments

* **Commun cosmique** : +1 APC plat par copie, set complet : +500 APC, multiplicateur global (APC & APS) +1 tous les 50 exemplaires (jusqu’à +100).【F:config/config.js†L910-L928】
* **Essentiel planétaire** : +10 APC plats par élément unique ou doublon, set complet : +1 000 APC, multiplicateur global +1 tous les 30 exemplaires (cap 100).【F:config/config.js†L929-L948】
* **Forge stellaire** : +50 APC plats par unique, +25 APC par doublon, set complet : double les bonus plats des Commun cosmique, multiplicateur global +1 tous les 20 exemplaires (cap 100).【F:config/config.js†L949-L968】
* **Singularité minérale** : +25 APC/APS plats par unique, +20 APC/APS par doublon, multiplicateur global +1 tous les 10 exemplaires (cap 100).【F:config/config.js†L969-L989】
* **Mythe quantique** : −1 s sur l’intervalle de l’étoile à tickets par élément unique (min 5 s), +1 % de gains hors-ligne par doublon (jusqu’à +100 %), puis +50 APC/APS plats au-delà, set complet : +50 % de chances de frénésie.【F:config/config.js†L990-L1014】
* **Irréel** : +1 % de chance de critique par unique, +1 % sur le multiplicateur de critique par doublon, multiplicateur global +1 tous les 5 exemplaires (cap 100).【F:config/config.js†L1015-L1034】

### 🏆 Succès & trophées

* **Échelles atomiques (21 paliers)** : de la cellule humaine (10^14) à l’univers observable (10^80), chaque trophée ajoute +2 au boost global de production (soit ×3 par palier obtenu).【F:config/config.js†L409-L608】
* **Ruée vers le million** : atteindre 1 000 000 d’atomes synthétisés ajoute +0,5 au boost global (×1,5 une fois débloqué).【F:config/config.js†L745-L776】
* **Convergence frénétique** : déclencher 100 frénésies augmente la réserve maximale de frénésies simultanées à 2.【F:config/config.js†L777-L793】
* **Tempête tri-phasée** : déclencher 1 000 frénésies porte la réserve à 3 et applique un multiplicateur global ×1,05.【F:config/config.js†L794-L809】
* **Collecteur d’étoiles** : compléter les raretés Commun cosmique & Essentiel planétaire active la collecte automatique des étoiles à tickets après 3 s.【F:config/config.js†L810-L827】

### ⚗️ Fusion moléculaire

* **Molécule d’eau (H₂O)** : consomme 2 Hydrogènes et 1 Oxygène avec 50 % de réussite pour octroyer +100 APC plats immédiats.【F:config/config.js†L713-L741】

Combinez ces leviers pour orchestrer vos pics de production, maximiser les frénésies et sécuriser les ressources critiques tout au long de la montée vers 10^80 atomes.

---

## 🛠️ Implémentation

* **Technologies** : HTML, CSS et JavaScript vanilla.
* **Configuration** : `game-config.js` centralise l’équilibrage (bâtiments, gacha, bonus) ; `periodic-elements.js` référence les 118 éléments.
* **Accessibilité** : navigation par onglets, compteurs `aria-live`, animations désactivables via classes CSS.
* **Sauvegarde** : export/import JSON ; le format stocke les tickets, la progression de collection, les multiplicateurs et les paramètres de l’étoile à tickets.

---

## 🎯 Objectif

Collectez, automatisez, déclenchez des frénésies et maîtrisez la synthèse élémentaire via les tickets pour franchir l’échelle des grands nombres… jusqu’à reconstituer l’univers tout entier.
