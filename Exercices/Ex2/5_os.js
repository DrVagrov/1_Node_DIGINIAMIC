// Ecrivez la fonction displayOsMessage() qui détecte le systeme d'exploitation
// Cette fonction affichera un message différend pour Windows, macOS et Linux
// Appelez la fonction pour la tester
// Il faudra trouver quel est la chaîne de retour pour chacun des systèmes

const os =require('os');

function displayOnMessage()
{
    console.log(`os : ${ReturnPlateform()} \n ${RetunrCPUS()}`)
}
function RetunrCPUS()
{
    let cpus= os.cpus();
    let string=`number of cpu : ${cpus.length}\n`;
    for( c of cpus)
    {
        string += `- ${c.model}\n`;
    }

    return string;
}
function ReturnPlateform()
{
    let plat = os.platform();
    let typ = os.type();

    switch (plat){
        case "win32":
            plat = "Windows";
            break;
    }
    switch (typ){
        case "Windows_NT":
            tpy="Windows";
            break;
    }
    return `plateform : ${plat}, d'origine ${typ}`;
}
displayOnMessage();