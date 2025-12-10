// Créez un chemin complet vers un fichier appelé example.txt dans un dossier nommé assets
// Affichez le nom du répertoire du chemin complet
// Affichez le nom du fichier à partir du chemin complet
// Affichez l'extension du fichier

const path = require('path');

const filePath = path.join(__dirname, 'assets', 'example.txt');
console.log(filePath); // Chemin complet vers le fichier example.txt C:\Users\rddin\Desktop\1_Node_DIGINIAMIC\Exercices\Ex2\assets\example.txt
console.log(path.dirname(filePath)); // Nom du répertoire du chemin complet C:\Users\rddin\Desktop\1_Node_DIGINIAMIC\Exercices\Ex2\assets
console.log(path.basename(filePath)); // Nom du fichier à partir du chemin complet example.txt
console.log(path.extname(filePath)); // Extension du fichier .txt