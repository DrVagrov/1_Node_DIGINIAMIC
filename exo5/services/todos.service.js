// On recupere les modules nécessaires

const { parseBody, sendJson } = require("../utils/http");

const fPath =
  "../exo5\\data\\todos.json";

const fs = require("fs");
const path = require("path");

const getT = async (req,res,pathname) => {

    if (pathname.split("/").length === 3) {
      return getIndex(req, res, pathname);
    } else {
      return getAll();
    }
};

const getAll =()=>{
    try{
        const file = fs.readFileSync(fPath);
        const jF = JSON.parse(file);
        return  jF;
    }
    catch(err)
    {
        return sendJson(res, 400, { error: err.message });
    }
};

const getIndex = async (req, res, pathname) =>
{
    console.log('fdfff');
    try {
        //extracting data
        const file = fs.readFileSync(fPath);
        const Jfile = JSON.parse(file);

        //sarching for target
        const index_id= getIndexandId(pathname,Jfile);


        //constructing object
        let body = await parseBody(req);
        const updated = Jfile[index_id.index];

        console.log(JSON.stringify(updated));
        return updated;
    } 
    catch (err) {
        return sendJson(res, 400, { error: err.message });
    }
}
const addAt = async (req, res, pathname) => {
    try {
        //extracting data
        const file = fs.readFileSync(fPath);
        const Jfile = JSON.parse(file);

        //sarching for target
        const index_id= getIndexandId(pathname,Jfile);


        //constructing object
        let body = await parseBody(req);
        const updated = { ...Jfile[index_id.index], ...body, id: index_id.targetId };

        //modifying target;
        Jfile[index_id.index] = updated;

        fs.writeFileSync(fPath,JSON.stringify(Jfile, null, 2));

        console.log(JSON.stringify(updated));
        return updated;
    } 
    catch (err) {
        return sendJson(res, 400, { error: err.message });
    }
};

const supAt = async (res, pathname) => {
  try {
    //extracting data
    const file = fs.readFileSync(fPath);
    const Jfile = JSON.parse(file);

    //sarching for target
    const index_id = getIndexandId(pathname,Jfile);

    const removed = Jfile[index_id.index]; 
    //modifying target;
    Jfile.splice(index_id.index, 1);;

    fs.writeFileSync(fPath, JSON.stringify(Jfile, null, 2));

    return removed;
  } catch (err) {
    return sendJson(res, 400, { error: err.message });
  }
};
const addLast =async (req,res) => {
    try {
      //extracting data
      const file = fs.readFileSync(fPath);
      const Jfile = JSON.parse(file);

      const maxId = Jfile.reduce((max, { id }) => Math.max(max, id || 0), 0) + 1;
      //constructing object
      let body = await parseBody(req);
      const updated = {id: maxId,...body};

      Jfile.push(updated);

      fs.writeFileSync(fPath, JSON.stringify(Jfile, null, 2));

      return updated;
    } 
    catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
}

const getIndexandId = (pathname,Jfile) => {
  //sarching for target
  const targetId = Number(pathname.split("/")[2]);
  const index = Jfile.findIndex((c) => c.id === targetId);
  return { index,targetId };
};

module.exports={
    getT,
    addAt,
    addLast,
    supAt
}
