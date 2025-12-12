Reprendre l'application tâches en intégrant ces fonctionnalités à l'aide d'EJS

Page Index : 
Cette page affiche un tableau listant toutes les tâches. Pour chaque tâche, les actions suivantes sont possibles :
    - Modifier : Accéder à la page de modification de la tâche sélectionnée.
    - Supprimer : Effacer la tâche de la liste.
    - Marquer comme accomplie (Done) : Indiquer que la tâche est terminée.
    - Marquer comme non accomplie (Undone) : Revenir sur le statut accompli d'une tâche pour la marquer comme non terminée.


Page Update (Mise à jour) : 
Permet de modifier une tâche existante. Tous les champs de la tâche à modifier sont disponibles pour être édités. Cette page utilise le composant _taskForm pour la saisie des informations.

Page Create (Création) : 
Permet de créer une nouvelle tâche. Cette fonctionnalité utilise également le composant _taskForm, offrant un formulaire pour saisir les détails de la nouvelle tâche.

Composant _TaskForm : 
C'est le formulaire utilisé à la fois pour créer et modifier les tâches. Il contient tous les champs nécessaires à la saisie des informations relatives à une tâche.

Composant _Header : 
C'est le layout qui est affiché sur toutes les pages relatives aux tâches. Il inclut un bouton permettant de naviguer vers la page Index et un autre vers la page Create, facilitant l'accès rapide aux fonctionnalités principales de l'application.