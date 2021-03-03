const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const Restaurantes = require("./models/restaurantes")
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


//realizo la conexion con la base de datos

mongoose.connect("mongodb://localhost/just-eat", { useNewUrlParser: true, useUnifiedTopology: true }, (err, response) => {
  if (err) {
    console.error(err, "error al conectar con la BBDD")
  } else {
    console.log("BBDD de just-eat conectada")
  }
})

//GET All count
api.get("/api/restaurantes", (request, response) => {

  Restaurantes.find().countDocuments((err, data) => {
    if (err) {
      console.error(err)
    } else {
      response.send({ data })
    }
  })
})


//GET por tipo
api.get("/api/restaurantes/:type", (request, response) => {

  const { type } = request.params


  Restaurantes.find({ type_of_food: `${type}` })
    .countDocuments((err, data) => {
      if (err) {
        console.error(err)
      } else {
        response.send({ data })
      }
    })
})

//Top 5 de Pizza
api.get("/api/topfive/:type", (request, response) => {

  const { type } = request.params


  Restaurantes.find({ type_of_food: `${type}` })
    .sort({ rating: -1 })
    .limit(5)
    .exec((err, data) => {
      if (err) {
        console.error(err)
      } else {
        response.send(data)
      }
    })
})

//Direcciones 2-4-1 Pizza
api.get("/api/address/:name", (request, response) => {

  const { name } = request.params

  Restaurantes.find({ name: { $regex: `${name}`, $options: "i" } }, { "address": 1, "address line 2": 1, _id: 0 }, (err, data) => {
    if (err) {
      console.error(err)
    } else {
      response.send(data)
    }
  })


})



const port = "3333";
const host = "127.0.0.1";

api.listen(port, host, () => {
  console.log(`API de frutas corriendo en http://${host}:${port}/api/restaurantes`);
});


