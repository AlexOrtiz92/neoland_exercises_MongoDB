
const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose")


const PokemonList = require("./models/listado")
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

//realizo la conexion con la base de datos
mongoose.connect("mongodb://localhost/POKEMON", { useNewUrlParser: true, useUnifiedTopology: true }, (err, response) => {
  if (err) {
    console.error(err, "error al conectar con la BBDD")
  } else {
    console.log("BBDD de pokemon conectada")
  }
})


//GET

api.get("/api/pokemon", (request, response) => {

  PokemonList.find((err, data) => {
    if (err) {
      console.error(err)
    } else {
      response.send(data)
    }
  })
});



//POST


api.post("/api/pokemon", (request, response) => {

  const { name, type } = request.body



  PokemonList.find(null, { id: 1, _id: 0 }).sort({ id: -1 }).limit(1).exec((err, data) => {
    if (err) {
      console.error(err)
    } else {

      const newPok = new PokemonList({
        id: data[0].id + 1,
        name,
        type
      })

      newPok.save((err) => {
        if (err) {
          console.error(err)
        } else {
          response.send({
            message: "pokemon añadido correctamente",
            pokemon: newPok
          })
        }
      })
    }
  })
})


//DELETE

api.delete("/api/pokemon", (request, response) => {

  const { _id } = request.body

  PokemonList.findByIdAndDelete(_id, (err, data) => {
    if (err) {
      console.error(err)
    } else {
      response.send({
        message: "pokemon eliminado correctamente",
        idi: _id
      })
    }
  })
})


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


