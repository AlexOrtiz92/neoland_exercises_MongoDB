//ESTE JS SE HACE POST POR QUERY PARAMS

const express = require("express");
const fs = require("fs");


const api = express();

//GET

api.get("/api/pokemon", (request, response) => {
  fs.readFile("db/dbPokemon.json", (err, data) => {
    if (err) throw err;//elevar o notificar una excepcion
    const allPokemon = JSON.parse(data);//parseamos el contenido del fichero a JSON
    response.status(200).send({
      succes: true,
      message: "/api/pokemon",
      method: "GET",
      pokemon: allPokemon
    })
  })
})

//2 formas de hacer POST:
//POST por el body

//POST pot parametros "api/pokemon?name=pikachu&type=electrico"


api.post("/api/pokemon", (request, response) => {
  // si nos faltara algun dato obligatorio, lo gestionamos de esta manera para que no haga nada

  if (!request.query.name || !request.query.type) {
    response.status(200).send({
      succes: false,
      url: "/api/pokemon",
      method: "POST",
      message: "name and type is required"
    })
  } else {

    //request.query tenemos los valores de la querystring
    // 1. Creamos el nuevo pokemon obteniendo los datos de request.query
    // 2. conseguimos el Array
    // 3. pusheamos el objeto en el array
    // 4. introducimos el array con el nuevo DataTransferItem, parseando el array con JSON.stringify(array)
    // 5. si todo ha ido BiquadFilterNode, respondemos con un mensaje ok

    fs.readFile("db/dbPokemon.json", (err, data) => {
      const allPokemon = JSON.parse(data);

      const newPok = {
        id: allPokemon.length + 1,
        name: request.query.name,
        type: request.query.type
      }


      allPokemon.push(newPok);

      fs.writeFile("db/dbPokemon.json", JSON.stringify(allPokemon), (err) => {
        if (err) {
          response.status(400).send({
            succes: false,
            url: "/api/pokemon",
            method: "POST",
            message: "fallo al añadir el pokemon"
          });
        } else {
          response.status(201).send({
            succes: true,
            url: "/api/pokemon",
            method: "POST",
            message: "pokemon añadido correctamente"

          })
        }

      })

    })
  }

})

const port = "5555";
const host = "127.0.0.1";

api.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}/api/pokemon`)
})
