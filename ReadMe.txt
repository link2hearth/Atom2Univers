# 🌌 Atom → Univers

**Atom → Univers** est une refonte complète du clicker scientifique. L’ancien prototype a été archivé (`texte.txt`) et le projet repart sur des bases saines avec l’intégration du système de nombres à *layers* dès le départ.

## 🎯 Objectifs
- Cliquer sur le noyau pour générer des **atomes**.
- Augmenter la production manuelle (**APC**) et automatique (**APS**).
- Dépenser ses ressources dans une **boutique** pour débloquer des améliorations.
- Explorer une interface moderne, des pages d’information et d’options.
- Manipuler des grandeurs astronomiques via une arithmétique à couches (ex : `10^123`).

## 🧮 Nombres à layers
Le moteur numérique repose sur la classe `LayeredNumber` (JavaScript) qui gère deux couches de grandeur :
- **Layer 0** : notation scientifique classique (mantisse + exposant).
- **Layer 1** : représente `10^x` avec des opérations dédiées (addition logarithmique, multiplication, puissances).

Ce système permet de progresser sereinement vers des valeurs comme `10^1 000 000` et prépare l’extension vers des couches supplémentaires.

## 🕹️ Contenu actuel
- **Jeu** : affichage des ressources, clic central animé, jalons à atteindre.
- **Boutique** : cinq améliorations (clics, production automatique, hybrides) avec coûts croissants.
- **Infos** : présentation de l’univers du jeu et des notions clés.
- **Options** : thèmes (sombre, clair, néon), sauvegarde manuelle et réinitialisation.

## 💾 Sauvegarde
- Sauvegarde locale automatique toutes les 30 secondes.
- Sauvegarde manuelle et restauration au chargement de la page.
- Gain hors-ligne jusqu’à 12 heures en fonction des APS.

## 📁 Structure
```
index.html   # Interface principale
styles.css   # Thèmes et mise en page responsive
script.js    # Logique du jeu et moteur LayeredNumber
texte.txt    # Ancien prototype HTML pour référence
Assets/      # Médias (images, sons) provenant de l’ancien projet
```

## 🚧 À venir
- Réintégration du gacha et du tableau périodique.
- Systèmes moléculaires et « devkit » planifiés pour une phase ultérieure.
- Extension du moteur de nombres vers des couches > 1 pour des tours exponentiels plus profonds.
