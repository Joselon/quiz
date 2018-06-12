var models=require('../models/models.js');
var urlBusqueda= '/juegos';
// Autoload -factoriza el codigo si ruta incluye :juegoId
exports.load=function(req, res, next, juegoId){
	//models.Juego.findById(juegoId).then(
	models.Juego.find({
		where: {id: Number(juegoId)},
		include: [{model:models.Contenido}],
		order:'"Contenidos"."createdAt" DESC'
	}).then(
	 function(juego){
	  if(juego){
		req.juego=juego;
	  	next();
	  }else{next(new Error('No existe juegoId='+juegoId));}
	 }
	).catch(function(error){ next(error);});
};
//GET /juegos
exports.index=function(req, res){

 if (req.query.search !== undefined){
  urlBusqueda='/juegos?search='+req.query.search ;
   //si estamos buscando filtramos las juegos
   //sustituimos en blanco por %
  if(req.query.search.charAt(0)=='~'){
   //filtramos por juegos con comentarios
	 /* var searchAux =  [];
	  searchAux=req.query.search.split(",");
	  searchAux.shift();
	  for(var i=0, l=searchAux.length;i<l;i++){
		  searchAux[i]=Number(searchAux[i]);
	  }
	  */
	   models.Juego.findAll({ include: [{model:models.Contenido,
                    where:['"Contenidos"."createdAt" is not null'],
                    order:[['"Contenidos"."createdAt"','DESC']],
                    group:"Contenidos.JuegoId"}],
                                order:'"Contenidos"."createdAt" DESC'
        }).then(function(juegos){
		res.render('juegos/index',{juegos:juegos, errors:[],urlBusqueda:urlBusqueda});
		});
  } 
  if(req.query.search.charAt(0)=='^'){
   //filtramos por tipo
	  var searchAux =req.query.search.replace("^", "");
	  if(searchAux=='null'){
	console.log('Buscando: '+searchAux);
	   models.Juego.findAll({where: ["tipo is null"],
			order:[["juego","ASC"]]}).then(function(juegos){
		res.render('juegos/index',{juegos:juegos, errors:[],urlBusqueda:urlBusqueda});
		});	  
	  }else{
	console.log('Buscando: '+searchAux);
	   models.Juego.findAll({where: {tipo: searchAux},
			order:[["juego","ASC"]]}).then(function(juegos){
		res.render('juegos/index',{juegos:juegos, errors:[],urlBusqueda:urlBusqueda});
		});}
  }
  else{
	  var searchAux= req.query.search;
          searchAux=searchAux.toUpperCase();
	  searchAux=searchAux.replace(/\s+/g, "%");
   	//Añadimos % al principio y el final
   	if (searchAux.charAt(0)!='%'){
	searchAux="%"+searchAux;
   	}
   	if(searchAux.charAt(searchAux.length-1)!='%'){
	searchAux=searchAux+"%";
   	}
  	//filtramos
   	models.Juego.findAll({where:{juego:{$ilike:searchAux}},
			order:[["juego","ASC"]]}).then(function(juegos){
		res.render('juegos/index',{juegos:juegos, errors:[],urlBusqueda:urlBusqueda});
		});
	  
 }
 }else{//mostramos todo
   models.Juego.findAll().then(function(juegos) {
     res.render('juegos/index', {juegos:juegos,errors:[],urlBusqueda:urlBusqueda});
    }).catch(function(error){next(error);});
  }
};

// GET /juegos/:id
exports.show = function(req, res) {	
	 res.render('juegos/show', {juego:req.juego,errors:[]});
};



// GET /juegos/new
exports.new = function(req,res){
	var juego=models.Juego.build( // crea objeto juego
	  {juego:"Nombre del Juego", descripcion: "Descripcion",tipo:"otro"});
	res.render('juegos/new', {juego: juego,errors:[]});
};

//POST /juegoes/create
exports.create = function(req, res) {
	var juego = models.Juego.build(req.body.juego);
	console.log("JUEGO:"+juego);
         console.log("VALIDATE:"+juego.validate());
	console.log("REQ:"+req.body.juego);
	
	juego.validate().then(function(err) {
		if(err) {
			res.render('juegos/new', {juego: juego, errors: err.errors});
		} else {
			// guarda en BD los campos juego y descripcion de juego
			juego.save({fields:["juego", "descripcion", "tipo"]}).then(function(){
				// redireccion HTTP (URL relativo) lista de juegos
				res.redirect('/juegos');
			})
		}
	});		
};

// GET /juegos/:id/edit
exports.edit=function(req,res){
	var juego=req.juego; //autoload de instancia de juego
	res.render('juegos/edit', {juego:juego, errors:[]});
};
// GET /juegos/:id/edit
exports.ahorcado=function(req,res){
	var juego=req.juego; //autoload de instancia de juego
	res.render('juegos/ahorcado', {juego:juego, errors:[]});
};

//PUT /juegos/:id
exports.update=function(req,res){
	req.juego.juego= req.body.juego.juego;
	req.juego.descripcion=req.body.juego.descripcion;
	req.juego.tipo=req.body.juego.tipo;

	req.juego.validate().then(function(err){
		if(err){
		 res.render('juegos/edit',{juego:req.juego,errors: err.errors});
		} else{
		 req.juego // save: guarda campos juego y descripcion en DB
		 .save( {fields: ["juego","descripcion","tipo"]})
		 .then( function(){res.redirect('/juegos');});
		} //Redireccion HTTP a lista de juegos (URL relativo)
	});

};

//DELETE 

exports.destroy=function(req,res){
	req.juego.destroy().then(function(){
	 res.redirect('/juegos');})
	.catch(function(error){next(error)});
};
