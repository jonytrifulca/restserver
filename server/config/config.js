//puerto
process.env.PORT = process.env.PORT || 3000;


//ENTORNO
//VARIABLE establecida por heroku
//si no existe => estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//base de datos 
let urlDB;

if (process.env.NODE_ENV == 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else {
    //urlDB = 'mongodb+srv://pacouser:pacouser@cluster0-prrvi.mongodb.net/test?retryWrites=true&w=majority';
    //establezco variable de entorno con heroku para k no se va el pass en plano en git
    //heroku config:set MONGO_URI="mongodb+srv://pacouser:pacouser@cluster0-prrvi.mongodb.net/test?retryWrites=true&w=majority"
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//VARIABLES DE VENCIMINENTO DEL TOKEN Y SEED O SEMILLA DE AUTH

//60 segs x 60 mins
process.env.JWT_CADUCIDAD_TOKEN = 60 * 60 * 60 * 24;
process.env.JWT_SEED = process.env.JWT_SEED || 'este-es-el-seed-de-desarrollo';


//google client id
process.env.GOOGLE_CLIENT_ID = '396775027470-9703oo9i19gdci9ata8iaebbf1sgbame.apps.googleusercontent.com';