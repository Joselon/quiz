var models= require('../models/models');

//Estadisticas iniciales
exports.index=function(req,res){
	var stats={
	  nJuegos:0,
	  nContenidos:0,
	  nmedioContenidosXJuego:0,
	  nJuegoSinContenido:0,
	  nJuegoConContenido:0,
	  
};
	var listJuegoContenido=['~'];

models.Juego.findAll({
	include: [{model: models.Contenido}]
	}
	).then(
	 function(juegos) {
		stats.nJuegos=juegos.length;
		for (var i=0;i<juegos.length;i++){
		  if (juegos[i].Contenidos.length>0){
			console.log(juegos[i].Contenidos.length +' comentarios en '+juegos[i].juego);
			stats.nContenidos += (juegos[i].Contenidos.length);
			stats.nJuegoConContenido++;
			//listJuegoContenido.push(juegos[i].id);
		  }
		 if (juegos[i].tipo==null){stats.nJuegoSinContenido++;}
		}
		stats.nmedioContenidosXJuego=stats.nContenidos/stats.nJuegos;
		stats.nmedioContenidosXJuego=stats.nmedioContenidosXJuego.toFixed(2);
		
		res.render('statistics/show', {
			stats: stats,
			errors:[],
			listJuegoContenido:listJuegoContenido
		});
	}).catch(function(error){
		next(error);
	});
};
