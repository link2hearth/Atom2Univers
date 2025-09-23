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

## 🛠️ Implémentation

* **Technologies** : HTML, CSS et JavaScript vanilla.
* **Configuration** : `game-config.js` centralise l’équilibrage (bâtiments, gacha, bonus) ; `periodic-elements.js` référence les 118 éléments.
* **Accessibilité** : navigation par onglets, compteurs `aria-live`, animations désactivables via classes CSS.
* **Sauvegarde** : export/import JSON ; le format stocke les tickets, la progression de collection, les multiplicateurs et les paramètres de l’étoile à tickets.

---

## 🎯 Objectif

Collectez, automatisez, déclenchez des frénésies et maîtrisez la synthèse élémentaire via les tickets pour franchir l’échelle des grands nombres… jusqu’à reconstituer l’univers tout entier.
