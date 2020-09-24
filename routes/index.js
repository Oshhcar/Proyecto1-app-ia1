var express = require('express');
const { ConnectionStates } = require('mongoose');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
const prolog = require('tau-prolog');

var session = prolog.create();

session.consult(`
  sangre_fria(reptil).
  tiene_exoesqueleto(artropodo).
  marinos(molusco).
  nacen_agua(anfibio).
  tiene_cola(anfibio).
  tiene_escama(reptil).
  viven_agua(pez).
  ponen_huevos(pez).
  tienen_alas(ave).
  pueden_volar(ave).
  sangre_caliente(mamifero).
  toman_leche(mamifero).
  longevidad_baja(X):- X < 10.
  longevidad_media(X):- X >= 10, X =< 60.
  longevidad_alta(X):- X > 60.
  extinta(X):- X == 0.
  vulnerable(X):- X < 5000.
  no_peligro(X):- X >= 5000.
  animal_grande(X,Y):- X > 50, Y > 1.
  animal_lento(X):- X < 1.
  animal_rapido(X):- X > 10.
  animal_normal(X):- \+ animal_lento(X), \+ animal_rapido(X).
  tiene_vida(_):- true.
  puede_respirar(_):- true.
  tiene_hueso(vertebrado).
  puede_sentir(_):- true.
`, {
  success: function () { console.log("correcto") },
  error: function (err) { console.log("error ") }
});

MongoClient.connect("mongodb+srv://wilson:wilson1234@cluster0.jgcb4.gcp.mongodb.net/proyecto_animales?retryWrites=true&w=majority", {
  useUnifiedTopology: true
})
  .then(client => {
    const db = client.db('proyecto_animales');
    const animalCollection = db.collection('animal');

    /* GET animal page. */
    router.get('/animal/:nombre', function (req, res, next) {
      animalCollection.find({ nombre: req.params.nombre }).toArray(function (err, result) {
        if (err) {
          console.log(err);
          res.render('animal', { title: 'Animal', msg: 'Ocurrió un error, inténtelo de nuevo.', data: [] });
        } else {
          if (result.length > 0) {
            //console.log(result[0].nombre);
            var nombre = result[0].nombre;
            nombre = nombre.replace(/\_/g, ' ');
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
            result[0].nombre = nombre;

            nombre = result[0].nombrecientifico;
            nombre = nombre.replace(/\_/g, ' ');
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
            result[0].nombrecientifico = nombre;

            res.render('animal', { title: 'Animal', msg: '', data: result[0] });
          } else {
            console.log("no encontro")
            res.render('animal', { title: 'Animal', msg: 'No se encontró el animal.', data: [] });

          }
        }
      });
    });


    /* POST consultar. */
    router.post('/consultar', function (req, res, next) {

      var filter = { clasificacion: "", tipo: "" };

      if (req.body.clasificacion != 'todo')
        filter.clasificacion = req.body.clasificacion;
      else
        delete filter.clasificacion;

      if (req.body.tipo != "")
        filter.tipo = req.body.tipo;
      else
        delete filter.tipo;

      animalCollection.find(filter).toArray(function (err, result) {
        if (err) {
          console.log(err);
          res.render('consultar', { title: 'Consultar', msg: 'No se puede consultar en este momento.', data: [] });
        } else {
          if (result != null) {

            if (req.body.longevidad != "") {
              var tmp = [];

              for (var i = 0; i < result.length; i++) {
                session.query("longevidad_"+req.body.longevidad+"(" + result[i].logevida + ").", {
                  success: function (goal) { /* Goal loaded correctly */ },
                  error: function (err) { /* Error parsing program */ }
                });

                session.answer({
                  success: function (answer) {
                    tmp.push("result["+i+"]");
                  },
                  fail: function () { },
                  error: function (err) { /* Uncaught exception */ },
                  limit: function () { /* Limit exceeded */ }
                });
              }
              setTimeout(() => { console.log(tmp); }, 2000);
              console.log(tmp)
            }
            res.render('consultar', { title: 'Consultar', msg: '', data: result });
          } else {
            res.render('consultar', { title: 'Consultar', msg: 'No se encontraron animales.', data: [] });
          }
        }
      });
    });


  })
  .catch(console.error)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Inicio' });
});

/* GET consultar page. */
router.get('/consultar', function (req, res, next) {
  res.render('consultar', { title: 'Consultar', msg: '', data: [] });
});

module.exports = router;
