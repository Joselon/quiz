//Definicion del modelo de Juego con Validacion

module.exports=function(sequelize, DataTypes) {
	return sequelize.define('Juego',
	 { juego: {
		type: DataTypes.STRING,
		validate: {notEmpty: {msg: "-> Falta nombre del Juego"}}
		},
	   descripcion: {
		type:DataTypes.STRING,
		validate: {notEmpty: {msg: "-> Falta Descripcion"}}
		},
	   tipo:{type: DataTypes.STRING,
                validate: {notEmpty: {msg: "-> Falta Tipo"}}
	      }		   
	 }
	);

}

