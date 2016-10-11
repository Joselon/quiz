var models=require('../models/models.js');

// Autoload -factoriza el codigo si ruta incluye :quizId
exports.load=function(req, res, next, quizId){
	//models.Quiz.findById(quizId).then(
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model:models.Comment}]
	}).then(
	 function(quiz){
	  if(quiz){
		req.quiz=quiz;
	  	next();
	  }else{next(new Error('No existe quizId='+quizId));}
	 }
	).catch(function(error){ next(error);});
};
//GET /quizes
exports.index=function(req, res){

 if (req.query.search !== undefined){
   //si estamos buscando filtramos las preguntas
   //sustituimos en blanco por %
  if(req.query.search.charAt(0)!='~'){
   var searchAux= req.query.search.replace(/\s+/g, "%");
   //Añadimos % al principio y el final
   if (searchAux.charAt(0)!='%'){
	searchAux="%"+searchAux;
   }
   if(searchAux.charAt(searchAux.length-1)!='%'){
	searchAux=searchAux+"%";
   }
  //filtramos
   models.Quiz.findAll({where:["pregunta LIKE ?",searchAux],
			order:[["pregunta","ASC"]]}).then(function(quizes){
		res.render('quizes/index',{quizes:quizes, errors:[]});
		});
  }else{
	  //filtramos por preguntas con comentarios
	  var searchAux = [];
	  var n=0;
	  for ( var i = 0, l = req.query.search.length,n=0; i < l; i++ ) {
		 if( req.query.search[ i ]!=','){
   		  searchAux[ n ] = Number(req.query.search[ i ]);
	 	  n++;
		 }
		}
	  searchAux.shift();
	  
	  
	   models.Quiz.findAll({where: ["id IN(?)", searchAux],
			order:[["pregunta","ASC"]]}).then(function(quizes){
		res.render('quizes/index',{quizes:quizes, errors:[]});
		});
  }  
 }else{//mostramos todo
   models.Quiz.findAll().then(function(quizes) {
     res.render('quizes/index', {quizes:quizes,errors:[]});
    }).catch(function(error){next(error);});
  }
};

// GET /quizes/:id
exports.show = function(req, res) {	
	 res.render('quizes/show', {quiz:req.quiz,errors:[]});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado='Incorrecto';	
	 if(req.query.respuesta === req.quiz.respuesta) {
	 	resultado='Correcto'
	 }
	res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado,errors:[]});
	 
};

// GET /quizes/new
exports.new = function(req,res){
	var quiz=models.Quiz.build( // crea objeto quiz
	  {pregunta:"Pregunta", respuesta: "Respuesta",tema:"otro"});
	res.render('quizes/new', {quiz: quiz,errors:[]});
};

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	console.log("QUIZ:"+quiz);
         console.log("VALIDATE:"+quiz.validate());
	console.log("REQ:"+req.body.quiz);
	
	quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// guarda en BD los campos pregunta y respuesta de quiz
			quiz.save({fields:["pregunta", "respuesta", "tema"]}).then(function(){
				// redireccion HTTP (URL relativo) lista de preguntas
				res.redirect('/quizes');
			})
		}
	});		
};

// GET /quizes/:id/edit
exports.edit=function(req,res){
	var quiz=req.quiz; //autoload de instancia de quiz
	res.render('quizes/edit', {quiz:quiz, errors:[]});
};

//PUT /quizes/:id
exports.update=function(req,res){
	req.quiz.pregunta= req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;
	req.quiz.tema=req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if(err){
		 res.render('quizes/edit',{quiz:req.quiz,errors: err.errors});
		} else{
		 req.quiz // save: guarda campos pregunta y respuesta en DB
		 .save( {fields: ["pregunta","respuesta","tema"]})
		 .then( function(){res.redirect('/quizes');});
		} //Redireccion HTTP a lista de preguntas (URL relativo)
	});

};

//DELETE 

exports.destroy=function(req,res){
	req.quiz.destroy().then(function(){
	 res.redirect('/quizes');})
	.catch(function(error){next(error)});
};
