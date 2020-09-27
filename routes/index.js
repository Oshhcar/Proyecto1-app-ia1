var express = require('express');
const { ConnectionStates } = require('mongoose');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
const prolog = require('tau-prolog');

var session = prolog.create();

session.consult(`
  sangre_fria(reptil).
  tiene_exoesqueleto(antropodo).
  tiene_exoesqueleto(pez).
  tiene_exoesqueleto(anfibio).
  tiene_exoesqueleto(ave).
  tiene_exoesqueleto(mamifero).
  marino(pez).
  terrestre(antropodo).
  terrestre(anfibio).
  terrestre(ave).
  terrestre(mamifero).
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
  animal_normal(X):- X >= 1, X =< 10.
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
          res.render('consultar', { title: 'Consultar', msg: 'No se puede consultar en este momento.', msg2: '', data: [], t: 1 });
        } else {
          if (result != null) {

            var tiempo = 0;

            if (req.body.longevidad != "") {
              tiempo += 200;
              result = filtering("longevidad_" + req.body.longevidad, result, 0);
            }

            if (req.body.sangre != ""){
              tiempo += 200;
              setTimeout(() => { result = filtering("sangre_" + req.body.sangre, result, 1); }, tiempo);
            }

            if (req.body.estado != ""){
              tiempo += 200;
              setTimeout(() => { result = filtering(req.body.estado, result, 2); }, tiempo);
            }

            if (req.body.tipo_animal != ""){
              tiempo += 200;
              setTimeout(() => { result = filtering(req.body.tipo_animal, result, 3); }, tiempo);
            }

            if (req.body.velocidad != ""){
              tiempo += 200;
              setTimeout(() => { result = filtering("animal_" + req.body.velocidad, result, 4); }, tiempo);
            }

            if (req.body.exoesqueleto != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("tiene_exoesqueleto", result, 1); }, tiempo);
            }

            if (req.body.marino != ""){
              tiempo += 200;
              setTimeout(() => { result = filtering(req.body.marino, result, 1); }, tiempo);
            }

            if (req.body.nacen_agua != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("nacen_agua", result, 1); }, tiempo);
            }

            if (req.body.toman_leche != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("toman_leche", result, 1); }, tiempo);
            }

            if (req.body.tiene_cola != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("tiene_cola", result, 1); }, tiempo);
            }

            if (req.body.tiene_escama != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("tiene_escama", result, 1); }, tiempo);
            }

            if (req.body.pueden_volar != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("pueden_volar", result, 1); }, tiempo);
            }

            if (req.body.viven_agua != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("viven_agua", result, 1); }, tiempo);
            }

            if (req.body.ponen_huevos != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("ponen_huevos", result, 1); }, tiempo);
            }

            if (req.body.tienen_alas != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("tienen_alas", result, 1); }, tiempo);
            }

            if (req.body.tiene_hueso != undefined){
              tiempo += 200;
              setTimeout(() => { result = filtering("tiene_hueso", result, 5); }, tiempo);
            }

            if(req.body.nombre == "")
              setTimeout(() => { res.render('consultar', { title: 'Consultar', msg: '', msg2: '', data: result, t: 1 }); }, tiempo+400);
            else{
              setTimeout(() => { 
                var msg2 = "El animal " + req.body.nombre + " no cumple las características.";
                
                for(var i = 0; i < result.length; i++){
                  if(result[i].nombre.toString().toUpperCase() === req.body.nombre.toString().toUpperCase()){
                    msg2 = "El animal " + req.body.nombre + " si cumple las características.";
                  }
                }

                res.render('consultar', { title: 'Consultar', msg: '', msg2: msg2, data: [], t: 0 }); 
              
              }, tiempo+400);
            }
            
          } else {
            res.render('consultar', { title: 'Consultar', msg: 'No se encontraron animales.', msg2: '', data: [], t: 1 });
          }
        }
      });
    });


  })
  .catch(console.error)

function filtering(query, result, tp) {
  var tmp = [];
  var resp = [];
  for (var i = 0; i < result.length; i++) {
    var q;

    switch(tp){
      case 0:
        q = query +  "(" + result[i].logevida + ").";
        break;
      case 1:
        q = query + "(" + result[i].tipo + ").";
        break;
      case 2:
        q = query + "(" + result[i].poblacion + ").";
        break;
      case 3:
        q = "animal_grande(" + result[i].peso + "," + result[i].altura +").";
        break;
      case 4:
        q = query + "(" + result[i].velocidad + ").";
        break;
      case 5:
          q = query + "(" + result[i].clasificacion + ").";
          break;
    }
    session.query(q, {
      success: function (goal) { },
      error: function (err) { }
    });

    session.answer(x => resp.push(session.format_answer(x)));
  }
  setTimeout(() => { 
    if(result.length == resp.length){
      if(tp != 3) {
        for(var i = 0; i < result.length; i++){
          if(resp[i] == "true.")
            tmp.push(result[i]);
        }
      } else {
        if(query == "grande"){
          for(var i = 0; i < result.length; i++){
            if(resp[i] == "true.")
              tmp.push(result[i]);
          }
        } else {
          for(var i = 0; i < result.length; i++){
            if(resp[i] == "false.")
              tmp.push(result[i]);
          }
        }
      }
    } else {
      tmp = result;
    }
   }, 10);

  return tmp;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Inicio' });
});

/* GET consultar page. */
router.get('/consultar', function (req, res, next) {
  res.render('consultar', { title: 'Consultar', msg: '', msg2: '', data: [], t: 0});
});

module.exports = router;
