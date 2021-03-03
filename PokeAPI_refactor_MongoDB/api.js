//ESTE JS SE HACE POST POR EL BODY

const express = require("express");
const fs = require("fs");

const bodyParser = require("body-parser");

const api = express();


//CONF CORS
api.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
  api.options("*", (req, res) => {
    // allowed XHR methods
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PATCH, PUT, POST, DELETE, OPTIONS"
    );
    res.send();
  });
});

//CONF DECODE BODYPARSER

api.use(bodyParser.json());

api.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.urlencoded({ extended: true })); TAMBIEN PUEDE USARSE A TRAVES DE EXPRESS

//GET

api.get("/api/pokemon", (request, response) => {
  fs.readFile("db/dbPokemon.json", (err, data) => {
    if (err) throw err; //elevar o notificar una excepcion
    const allPokemon = JSON.parse(data); //parseamos el contenido del fichero a JSON
    response.status(200).send({
      succes: true,
      message: "/api/pokemon",
      method: "GET",
      pokemon: allPokemon,
    });
  });
});

//2 formas de hacer POST:
//POST por el body

//POST pot parametros "api/pokemon?name=pikachu&type=electrico"

api.post("/api/pokemon", (request, response) => {
  // si nos faltara algun dato obligatorio, lo gestionamos de esta manera para que no haga nada

  if (!request.body.name || !request.body.type) {
    response.status(200).send({
      succes: false,
      url: "/api/pokemon",
      method: "POST",
      message: "name and type are required",
    });
  } else {
    //request.query tenemos los valores de la querystring
    // 1. Creamos el nuevo pokemon obteniendo los datos de request.query
    // 2. conseguimos el Array
    // 3. pusheamos el objeto en el array
    // 4. introducimos el array con el nuevo DataTransferItem, parseando el array con JSON.stringify(array)
    // 5. si todo ha ido BiquadFilterNode, respondemos con un mensaje ok

    fs.readFile("db/dbPokemon.json", (err, data) => {
      const allPokemon = JSON.parse(data);

      //configuramos el ID
      let idPokemon = 0

      if (allPokemon[allPokemon.length - 1] == null) {

        idPokemon = 1
      } else {
        idPokemon = allPokemon[allPokemon.length - 1].id + 1
      }

      const newPok = {
        id: idPokemon,
        name: request.body.name,
        type: request.body.type,
      };

      allPokemon.push(newPok);

      fs.writeFile("db/dbPokemon.json", JSON.stringify(allPokemon), (err) => {
        if (err) {
          response.status(400).send({
            succes: false,
            url: "/api/pokemon",
            method: "POST",
            message: "fallo al añadir el pokemon",
          });
        } else {
          response.status(201).send({
            succes: true,
            url: "/api/pokemon",
            method: "POST",
            message: "pokemon añadido correctamente",
          });
        }
      });
    });
  }
});

//DELETE
api.delete("/api/pokemon", (request, response) => {

  if (!request.body.id) {
    response.status(200).send({
      succes: false,
      url: "/api/pokemon",
      method: "DELETE",
      message: "id or name is required",
    });
  } else {

    fs.readFile("db/dbPokemon.json", (err, data) => {

      //con NAME

      // const allPokemon = JSON.parse(data);
      // const name = request.body.name;

      // const newAllPok = allPokemon
      //   .map((value) => {
      //     if (value.name !== name) {
      //       return value;
      //     }
      //   })
      //   .filter((value) => value != null);


      // con ID

      const allPokemon = JSON.parse(data);
      const id = request.body.id;

      const newAllPok = allPokemon
        .map((value) => {
          if (`${value.id}` !== id) {
            return value;
          }
        })
        .filter((value) => value != null);

      fs.writeFile("db/dbPokemon.json", JSON.stringify(newAllPok), (err) => {
        if (err) {
          response.status(400).send({
            succes: false,
            url: "/api/pokemon",
            method: "DELETE",
            message: "fallo al eliminar el pokemon",
          });
        } else {
          response.status(201).send({
            succes: true,
            url: "/api/pokemon",
            method: "DELETE",
            message: "pokemon eliminado correctamente",
          });
        }
      });
    });
  }
});



//GET ONE (query params)

api.get("/api/onepokemon", (request, response) => {


  if (!request.query.id) {
    response.status(200).send({
      succes: false,
      url: "/api/onepokemon",
      method: "GET ONE",
      message: "id or name is required",
    });
  } else {
    fs.readFile("db/dbPokemon.json", (err, data) => {

      const allPokemon = JSON.parse(data);
      const id = request.query.id;

      const onePokemon = allPokemon
        .map((value) => {
          if (`${value.id}` === id) {
            return value;
          }
        })
        .find((value) => value != null);

      response.status(201).send({
        succes: true,
        url: "/api/onepokemon",
        method: "GET ONE",
        message: "pokemon sacado correctamente",
        pokemon: onePokemon
      });
    })
  }
});

//GET ONE (por body)

// api.get("/api/onepokemon", (request, response) => {

//   if (!request.body.id) {
//     response.status(200).send({
//       succes: false,
//       url: "/api/onepokemon",
//       method: "GET ONE",
//       message: "id or name is required",
//     });
//   } else {
//     fs.readFile("db/dbPokemon.json", (err, data) => {

//       const allPokemon = JSON.parse(data);
//       const id = request.body.id;

//       const onePokemon = allPokemon
//         .map((value) => {
//           if (`${value.id}` === id) {
//             return value;
//           }
//         })
//         .find((value) => value != null);

//       response.status(201).send({
//         succes: true,
//         url: "/api/onepokemon",
//         method: "GET ONE",
//         message: "pokemon sacado correctamente",
//         pokemon: onePokemon
//       });
//     })
//   }
// });

// lo haremos mediante PARAMS(pero otros params) mas elegante.
///api/pokemons/1 por ejemplo
api.get("/api/pokemons/:id", (request, response) => {
  console.log("como consigo el id?");

  if (!request.params.id) {
    response.status(200).send({
      succes: false,
      url: "/api/pokemons",
      method: "GET ONE",
      message: "id  is required",
    });
  } else {

    fs.readFile("db/dbPokemon.json", (err, data) => {
      const allPokemon = JSON.parse(data);

      const onePokemon = allPokemon.find((value) => value.id === parseInt(request.params.id));

      response.status(201).send({
        succes: true,
        url: "/api/pokemons",
        method: "GET ONE por Params",
        message: "pokemon sacado correctamente",
        pokemon: onePokemon,
      });
    });
  };
});

//metodo PUT
//sacamos la info por params y actualizamosa traves del body
api.put("/api/pokemons/:id", (request, response) => {

  if (!request.params.id) {
    response.status(200).send({
      succes: false,
      url: "/api/pokemons",
      method: "PUT",
      message: "id  is required",
    });
  } else {

    fs.readFile("db/dbPokemon.json", (err, data) => {
      const allPokemon = JSON.parse(data);

      const updatedPokemon = allPokemon.map((value) => {
        if (value.id === parseInt(request.params.id)) {
          value = {
            id: value.id,
            name: request.body.name || value.name,
            type: request.body.type || value.type
          }
          //ó
          // value = { ...value, type: request.body.type }  //Este es solo para type
          return value
        } else {
          return value
        }
      })

      fs.writeFile("db/dbPokemon.json", JSON.stringify(updatedPokemon), (err) => {
        if (err) {
          response.status(400).send({
            succes: false,
            url: "/api/pokemons",
            method: "PUT",
            message: "fallo al actualizar el pokemon",
          });
        } else {
          response.status(201).send({
            succes: true,
            url: "/api/pokemons",
            method: "PUT",
            message: "pokemon actualizado correctamente",
          })
        }
      })
    })
  }
})

//PAGINADO

api.get("/api/pokemons/page/:page", (request, response) => {

  //paginado con limite 5 items
  if (!request.params.page) {
    response.status(200).send({
      succes: false,
      url: "/api/movies/page",
      method: "PUT",
      message: "id is required",
    });
  } else {
    if (isNaN(parseInt(request.params.page))) {
      response.status(400).send({
        succes: false,
        url: "/api/movies/page",
        method: "GET",
        message: "Por favor, introduzca un numero",
      })

    } else {
      fs.readFile("db/dbPokemon.json", (err, data) => {
        const allPokemon = JSON.parse(data);
        const PAGE_SIZE = 5;//permite cambiar el tamaño de las paginas segun queramos
        // const group = () => { request.params.page * 5 }

        const groupPokemon = allPokemon.slice((Math.abs(request.params.page) * PAGE_SIZE) - PAGE_SIZE, (Math.abs(request.params.page) * PAGE_SIZE));

        const nPaginas = Math.ceil(allPokemon.length / PAGE_SIZE)
        response.status(201).send({
          succes: true,
          url: "/api/pokemons",
          method: "GET",
          message: "Pagina sacada correctamente",
          pagina: parseInt(request.params.page),
          noPages: nPaginas,
          pokemon: groupPokemon
        })
      })
    }
  }
})

//PAGINADO con limit y offset
//lo suyo seria abordarlo dentro del primer get, pero por tener apuntes nuevos lo haremos a parte

api.get("/api/pokemon/pageoffset", (request, response) => {

  fs.readFile("db/dbPokemon.json", (err, data) => {

    const allPokemon = JSON.parse(data);


    // const { offset, limit } = request.query
    const offset = Math.abs(parseInt(request.query.offset)) - 1;
    const limit = Math.abs(parseInt(request.query.limit));

    if (!(offset + 1) || !limit) {
      response.status(400).send({
        succes: false,
        url: "/api/pokemon/pageoffset",
        method: "GET",
        message: "empty data",
      });
    } else {

      const groupPokemon = allPokemon.slice(offset, offset + limit);

      response.status(201).send({
        succes: true,
        url: "/api/pokemon/pageoffset",
        method: "GET",
        message: "Pagina sacada correctamente",
        pokemon: groupPokemon
      })
    }
  })
})

//hacer llamada a Sub-recursos

api.get("/api/pokemons/:pokemonID/location/:locationID", (request, response) => {

  fs.readFile("db/dbPokemon.json", (err, data) => {
    const allPokemon = JSON.parse(data);

    const pokemon = allPokemon.find((value) => value.id === parseInt(request.params.pokemonID))

    const locationPok = () => {
      if (!pokemon.locations) {

        return undefined

      } else {
        return pokemon.locations.find((value) => value.id === parseInt(request.params.locationID))
      }
    }

    if (locationPok() == null) {
      response.status(400).send({
        succes: false,
        url: "/api/pokemon",
        method: "GET",
        message: "no existe ese pokemon o esa localizacion",
      });
    } else {
      response.status(201).send({
        succes: true,
        url: "/api/pokemon",
        method: "GET",
        message: `Localizacion del pokemon ${pokemon.name}`,
        pokemon: locationPok()
      })
    }
  })
})








const port = "5555";
const host = "127.0.0.1";

api.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}/api/pokemon`);
});


