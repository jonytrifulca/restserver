require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//conectar a mongo
const mongoose = require('mongoose');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


//importamos las rutas de usuario
/*
app.use(require('./routes/usuario'));
//rutas de login
app.use(require('./routes/login'));*/

//importamos todas las rutas en una linea usando el index.js de la carpeta ruta
app.use(require('./routes/index'));


//conectar a la BD
//mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;

    console.log("Base de datos conectada");
});

/*mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, resp) => {
    if (err) throw err;
    console.log("Base de datos conectada");
});*/


app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${process.env.PORT}...`);
});