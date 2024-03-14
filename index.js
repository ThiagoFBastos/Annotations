const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

const bodyParser = require('body-parser');
const {engine} = require('express-handlebars');
const handlebars = require('handlebars');

const indexRoutes = require('./routes/index');
const tagRoutes = require('./routes/tags');
const annotationRoutes = require('./routes/annotations');
const userRoutes = require('./routes/users');

require('dotenv').config();

var store = new MongoDBStore({
  uri: 'mongodb://root:example@localhost:27017/connect_mongodb_session_test?authSource=admin',
  collection: 'mySessions'
});

app.use(session({secret: '10dkdkddpdlkdjffpaffpiew', resave: true, saveUninitialized: true, store: store, cookie: {maxAge: 30 * 24 * 60 * 60 * 1000}}));

app.engine('handlebars', engine({defaultLayout: 'base', runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
}}));

handlebars.registerHelper('mod', (a, b, c) => {return a % b == c});

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();  
});

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/tags', tagRoutes);
app.use('/annotations', annotationRoutes);

app.get('*', (req, res) => {
    res.status(404).render('not_found');
});

app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).render('error');
});

app.listen(process.env.PORT || 8181, (req, res) => console.log("rodando"));
