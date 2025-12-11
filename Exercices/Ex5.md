Reprendre l'exercice des TODOS.

On veut maintenant utiliser une architecture modulaire qui permet de séparer les responsabilités, tel que vu en cours, avec : 

- index.js point d'entrée
- routes/todos.routes.js pour le routing vers les bonnes méthodes du controller
- controllers/todos.controller.js pour implémenter la partie gestion de codes, d'erreurs, et d'appels des bons services
- services/todos.service.js qui serai implémenté par le controller. Il comportera toute la partie logique de gestion des données
- (OPTION mais recommandé) utils/utils.js, un fichier utilitaire qui comporte des fonctions qui pourraient s'avérer transverses dans une optique de moduarité, et d'évolution de l'application (par exemple, sendJson se retrouve dans tous les controllers, en cas d'ajout de nouvelles ressources à mon API)