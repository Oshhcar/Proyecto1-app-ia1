var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient

/*
MongoClient.connect("mongodb+srv://wilson:wilson123@cluster0.jgcb4.gcp.mongodb.net/estudiante?retryWrites=true&w=majority", {
  useUnifiedTopology: true
}, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
})
*/

MongoClient.connect("mongodb+srv://wilson:wilson123@cluster0.jgcb4.gcp.mongodb.net/practica1?retryWrites=true&w=majority", { 
  useUnifiedTopology: true })
  .then(client => {
    const db = client.db('practica1');
    const estudiantesCollection = db.collection('estudiantes');

    /* POST agregar. */
    router.post('/agregar', function(req, res, next) {
      estudiantesCollection.insertOne(req.body)
      .catch(error=>console.error(error));

      res.redirect('/agregar')
    });


  })
  .catch(console.error)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Inicio' });
});

/* GET agregar page. */
router.get('/agregar', function(req, res, next) {
  res.render('agregar', { title: 'Agregar' });
});

/* GET consultar page. */
router.get('/consultar', function(req, res, next) {
  res.render('consultar', { title: 'Consultar' });
});

/* GET grupo page. */
router.get('/grupo', function(req, res, next) {
  res.render('grupo', { title: 'Grupo' });
});


module.exports = router;
