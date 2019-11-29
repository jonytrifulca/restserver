//puerto
process.env.PORT = process.env.PORT || 3000;


//ENTORNO
//VARIABLE establecida por heroku
//si no existe => estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//base de datos //
let urlDB;

if (process.env.NODE_ENV == 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = 'mongodb://pacouser:pacouser@cluster0-prrvi.mongodb.net/test?retryWrites=true&w=majority';

process.env.URLDB = urlDB;