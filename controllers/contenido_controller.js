var models=require('../models/models.js');

//Autoload :id de comentarios
exports.load=function(req,res,next,contenidoId){
	models.Contenido.find({
		where:{
			id:Number(contenidoId)
		}
	}).then(function(contenido){
	if (contenido) {
		req.contenido=contenido;
		next();
	} else{next(new Error('No existe contenidoId= '+contenidoId))}
       }
    ).catch(function(error){next(error)});
};

//GET /juegos/:juegoId/contenidos/new
exports.new=function(req,res) {
 res.render('contenidos/new.ejs',{juegoid: req.params.juegoId, errors:[]});
};

//POST /juegos/:juegoId/contenidos
exports.create=function(req,res) {
 var contenido=models.Contenido.build(
	{texto: req.body.contenido.texto,
	 JuegoId: req.params.juegoId
	});
 contenido.validate().then(
	function(err){
		if(err){
			res.render('contenidos/new.ejs',
				{contenido: contenido, juegoid: req.params.juegoId, errors:err.errors});
		}else{
			contenido.save() //save: guarda en DB campo texto de contenido
			.then( function(){ res.redirect('/juegos/'+req.params.juegoId)})
		}	//res.redirect: Redireccion HTTP a lista de preguntas
	}
	).catch(function(error){next(error)});
};

// PUT /juegos/:juegoId/contenidos/:contenidoId/publish
exports.publish=function(req,res) {
	req.contenido.publicado=true;
	req.contenido.texto=req.contenido.texto+' (Autorizado por: '+req.session.user.username+')';
	req.contenido.save({fields: ["texto","publicado"]})
		.then( function(){res.redirect('/juegos/'+req.params.juegoId);})
		.catch(function(error){next(error)});
};

// PUT /juegos/:juegoId/contenidos/:contenidoId/hide
exports.hide=function(req,res) {
	req.contenido.publicado=false;
	
	req.contenido.save({fields: ["publicado"]})
		.then( function(){res.redirect('/juegos/'+req.params.juegoId);})
		.catch(function(error){next(error)});
};

//DELETE 

exports.destroy=function(req,res){
	req.contenido.destroy().then(function(){
	 res.redirect('/juegos/'+req.params.juegoId);})
	.catch(function(error){next(error)});
};
