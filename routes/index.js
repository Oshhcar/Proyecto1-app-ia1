var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient

MongoClient.connect("mongodb+srv://wilson:wilson123@cluster0.jgcb4.gcp.mongodb.net/practica1?retryWrites=true&w=majority", { 
  useUnifiedTopology: true })
  .then(client => {
    const db = client.db('practica1');
    const estudiantesCollection = db.collection('estudiantes');

    /* POST agregar. */
    router.post('/agregar', function(req, res, next) {
      estudiantesCollection.insertOne(req.body)
      .then(result=>{
        res.render('agregar', { title: 'Agregar', msg: 'Se agregó correctamente.', err: '' });
      })
      .catch(error=>{
        console.error(error)
        res.render('agregar', { title: 'Agregar', msg: '', err: 'Ocurrió un error, inténtelo de nuevo.' });
      });
    });

    /* POST consultar. */
    router.post('/consultar', function(req, res, next) {
      estudiantesCollection.findOne(req.body, function(err, result){
        if(err) {
          console.log(err);
          res.render('consultar', { title: 'Consultar', msg: '', err: 'Ocurrió un error, inténtelo de nuevo.' });
        } else {
          if(result != null){
            res.render('consultar', { title: 'Consultar', msg: 'Si posee un número de grupo.', err: '' });
          } else {
            res.render('consultar', { title: 'Consultar', msg: 'No existe el estudiante.', err: '' });
          }
        }
      });
    });

    /* POST grupo. */
    router.post('/grupo', function(req, res, next) {
      estudiantesCollection.find(req.body).toArray(function(err, result){
        if (err){
          console.log(err);
          res.render('grupo', { title: 'Grupo' , msg: '', err: 'Ocurrió un error, inténtelo de nuevo.', data: [] });
        } else {
          if(result.length > 0){
            //console.log(result);
            res.render('grupo', { title: 'Grupo' , msg: '', err: '', data: result});
          } else{
            res.render('grupo', { title: 'Grupo' , msg: 'El grupo no existe.', err: '', data: [] });

          }
        }
      });
    });


  })
  .catch(console.error)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Inicio' });
});

/* GET agregar page. */
router.get('/agregar', function(req, res, next) {
  res.render('agregar', { title: 'Agregar', msg: '', err: '' });
});

/* GET consultar page. */
router.get('/consultar', function(req, res, next) {
  res.render('consultar', { title: 'Consultar', msg: '', err: ''});
});

/* GET grupo page. */
router.get('/grupo', function(req, res, next) {
  res.render('grupo', { title: 'Grupo' , msg: '', err: '', data: [] });
});

module.exports = router;
