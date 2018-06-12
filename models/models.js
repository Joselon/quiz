var path=require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	=	(url[6]||null);
var user	=	(url[2]||null);
var pwd		=	(url[3]||null);
var protocol	=	(url[1]||null);
var dialect	=	(url[1]||null);
var port	=	(url[5]||null);
var host	=	(url[4]||null);
var storage	= process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize=require('sequelize');

// Usar BBDD SQLite o Postgres

var sequelize= new Sequelize(DB_name,user,pwd,
			{dialect:protocol,
			 protocol:protocol,
			 port:port,
			 host:host,
			 storage:storage, // solo SQLite (.env)
			 omitNull:true    // solo Postgres
			}
		  );

// Importar la definicion de la tabla Juego en juego.js
var juego_path=path.join(__dirname,'juego');
var Juego= sequelize.import(juego_path);

//Importar definicion de la tabla Commnet
var contenido_path=path.join(__dirname,'contenido');
var Contenido=sequelize.import(contenido_path);

Contenido.belongsTo(Juego);
Juego.hasMany(Contenido);

exports.Juego=Juego; // exportar definicion de tabla Juego
exports.Contenido=Contenido; //exportamos definicion de tabla Contenido

// sequelize.sync() crea e inicializa tabla de juegos de DB
sequelize.sync().then(function() {
 // then(..) ejecuta el manejador una vez creada la tabla
  Juego.count().then(function (count){
   if(count==0) { // la tabla se inicia solo si esta vacia
     Juego.create({ juego: 'Parchis',
		   descripcion: 'Tablero de parchís con 5 fichas clonables',
		   tipo: 'dado'});
     Juego.create({ juego: 'Dixit',
		   descripcion: 'Tablero con fichas para jugar al Dixit',
		   tipo: 'sinDado'})
   .then(function(){console.log('Base de flatos inicial izada')});
  };
 });
});
