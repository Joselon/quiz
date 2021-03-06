var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride=require('method-override');
var session=require('express-session');

var routes = require('./routes/index');

var app = express(); //Crea la aplicacion que al importarla en bin\www arranca el servidor express.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

 //Instala midlewares
app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev')); //Desarrollo
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser('Quiz jnavarro'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); 



//Helpers dinamicos:
app.use(function(req,res,next){
   //guardar path en session.redir para despues de login
   if(!req.path.match(/\/login|\/logout/)){
	req.session.redir=req.path;
   }
   //Hacer visible req.session en las vistas
   res.locals.session=req.session;
   next();
});

//MW para tiempo de inactividad
app.use(function(req,res,next){
	var marcaTiempo=(new Date).getTime();

	if (req.session.user && (marcaTiempo- req.session.user.loginDate)>600000){
	 delete req.session.user;
	 //delete req.session.loginDate;
	 res.redirect('/login');
	}
	else{ if(req.session.user){req.session.user.loginDate=marcaTiempo;}}
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
	    errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
	errors:[]
    });
});


module.exports = app;
