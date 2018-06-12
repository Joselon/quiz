//Definicion del modelo de Contenido con validación

module.exports=function(sequelize, DataTypes) {
	return sequelize.define(
	 'Contenido',
	 {texto:{
		type: DataTypes.STRING,
		validate: {notEmpty:{msg: "->Falta Contenido"}}
		},
	   publicado:{
		type: DataTypes.BOOLEAN,
		defaultValue: false
		}
	  }
	);
}


