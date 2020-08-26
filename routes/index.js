var express = require('express');
var router = express.Router();

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
