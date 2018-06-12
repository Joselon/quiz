var express = require('express');
var router = express.Router();

var juegoController = require('../controllers/juego_controller');
var contenidoController=require('../controllers/contenido_controller');
var sessionController=require('../controllers/session_controller');
var statsController=require('../controllers/stats_controller');

/* GET home page. */
router.get('/', function(req, res) {
 // console.log("ESTOY EN INDEX");
  res.render('index', { title: 'JNR',errors:[] });
});

//GET pagina de autor
router.get('/author', function(req, res) {
  res.render('author',{errors:[]});	
});

//Autoload de comandos con :quizId
router.param('juegoId', juegoController.load); //autoload :quizId
router.param('contenidoId', contenidoController.load); //autoload: contenidoId

//Definicion de rutas de sesion
router.get('/login',	sessionController.new);    //formulario login
router.post('/login',	sessionController.create); //crear sesion
router.get('/logout',	sessionController.destroy);//destruir sesion 

// Definicion de rutas de /quizes
router.get('/juegos',				juegoController.index);
router.get('/juegos/:juegoId(\\d+)', 		juegoController.show);
router.get('/juegos/new',		sessionController.loginRequired, juegoController.new);
router.post('/juegos/create',		sessionController.loginRequired, juegoController.create);
router.get('/juegos/:juegoId(\\d+)/edit',sessionController.loginRequired, juegoController.edit);
router.put('/juegos/:juegoId(\\d+)',	sessionController.loginRequired, juegoController.update);
router.delete('/juegos/:juegoId(\\d+)',	sessionController.loginRequired, juegoController.destroy);
router.get('/juegos/:juegoId(\\d+)/ahorcado', juegoController.ahorcado);

// Definicion de rutas de comentarios
router.get('/juegos/:juegoId(\\d+)/contenidos/new', contenidoController.new);
router.post('/juegos/:juegoId(\\d+)/contenidos',	 contenidoController.create);
router.get('/juegos/:juegoId(\\d+)/contenidos/:contenidoId(\\d+)/publish',
					 sessionController.loginRequired, contenidoController.publish);
router.get('/juegos/:juegoId(\\d+)/contenidos/:contenidoId(\\d+)/hide',
					 sessionController.loginRequired, contenidoController.hide);                                                                              
router.delete('/juegos/:juegoId(\\d+)/contenidos/:contenidoId(\\d+)',	 sessionController.loginRequired,contenidoController.destroy);
// Definicion de rutas de Estadisticas
router.get('/statistics', statsController.index);

module.exports = router;
