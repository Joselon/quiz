var models= require('../models/models');

//Estadisticas iniciales
exports.index=function(req,res){
	var stats={
	  nQuizes:0,
	  nComments:0,
	  nmedioCommentsXQuiz:0,
	  nQuizSinComment:0,
	  nQuizConComment:0
};

models.Quiz.findAll({
	include: [{model: models.Comment}]
	}
	).then(
	 function(quizes) {
		stats.nQuizes=quizes.length;
		for (var i=0;i<quizes.length;i++){
		  if (quizes[i].Comments.length>0){
			console.log(quizes[i].Comments.length +' comentarios en '+quizes[i].pregunta);
			stats.nComments += (quizes[i].Comments.length);
			stats.nQuizConComment++;
		  }else {stats.nQuizSinComment++;}
		}
		stats.nCommentsXQuiz=stats.nComments/stats.nQuizes;
		
		res.render('statistics/show', {
			stats: stats,
			errors:[]
		});
	}).catch(function(error){
		next(error);
	});
};