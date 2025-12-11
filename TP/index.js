const http = require('http');
const os = require('os');
const dns = require("dns");


//create server

const server = http.createServer((req, res) => {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    if (req.url === "/") {
        res.end("/status -> stat\n /resolve ");
    }
    else if (req.url === "/status") {
                res.writeHead(200, {
                  "Content-Type": "text/event-stream",
                  "Cache-Control": "no-cache",
                  Connection: "keep-alive",
                });

        const interval = setInterval(() => {
            res.write(WriteStat() + "\n");
        }, 1000); // every 100ms

        req.on("close", () => {
            clearInterval(interval);
    });
    } 
    else if(req.url.startsWith("/resolve"))
    {
        const hostname = req.url.split("?domain=")[1];
        try{
            ResolveDomaine(hostname,res);
        }
        catch(e)
        {
             res.writeHead(404, {
               "Content-Type": "text/plain; charset=utf-8",
             });
            res.statusCode="404";
            res.end(`erreur ${e}`);
        }
    }
    else if(req.url === "/exit")
    {
        server.close();
    }
    else {
        res.statusCode = 404;
        res.end("Page non trouvée.");
    }
});

server.listen(3000,() => {
    console.log(`Server is running on port http://localhost:3000`);
});
//#region fonction

///Fonction for 2
function WriteStat()
{
    return `{ CPU usage : ${getCpuUsage()} || free memory : ${os.freemem()} || time Elapsed since start : ${os.uptime()} }\n`;
}
function getCpuUsage()
{
        let id=0,tot=0;
        const cpus= os.cpus();
    for (c of cpus)
    {
        for (t in c.times)
        {
            tot += c.times[t];
        }
        id += c.times.idle;;
    }
    const idleAvg = id / cpus.length;
    const totalAvg = tot / cpus.length;

    const usage = 100 - (100 * idleAvg / totalAvg);
    return usage;
}

///Fonction for 3
function ResolveDomaine(urlAsked,res)
{
    console.log(urlAsked);
    // if(!urlAsked.startsWith("http://"))
    //     urlAsked=`http://${urlAsked}`;
    console.log(urlAsked);
    
    dns.resolve(urlAsked,(err,adresse)=>{
        if(err){
            throw `err ${err.message}`;
        }
        console.log(adresse);
        
        res.end(`l'adresse de ${urlAsked} ${adresse.length>2?"sont":"est"} : ${adresse}`);
    });
}

//#endregion