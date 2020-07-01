
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');


var login = require('./routes/login');
var index = require('./routes/index');
var progress = require('./routes/progress');
var data = require('./routes/data');

// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', login.view);
app.get('/home', index.view);
app.get('/start', progress.view);
app.get('/data', data.view);
//call for charts
app.get('/data/charts', data.updateChart);

app.get('/start/B', progress.view2);
//alternate for user testing
//app.get('/data/viewAlt', data.viewAlt);

app.get('/login/:name', login.log);
app.get('/fbLogin/:name/:id', login.fbLog);
app.get('/login/username/password', login.checkUser);
app.get('/login/username/id', login.checkUser);
app.get('/login/:name/:id', login.fbCreateUser);
app.get('/login/logout', login.view);
app.get('/signup/:name/:email/:password', login.sig);
app.get('/home/:name/:hrs/:mins', index.next);
app.get('/save/:dist', progress.save);
app.get('/complete/:dur/:total', progress.complete);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
