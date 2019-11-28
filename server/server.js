require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


//consultar
app.get('/usuario', function(req, res) {
    res.json("getUsuario");
});

//crear
app.post('/usuario', function(req, res) {

    //recogemos los parametros por post haciendo uso de un paquete llamado
    //npm body-parser
    let body = req.body;

    if (body.nombre === undefined) {
        //especificamos un bad request pk faltan parametros
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        });
    } else {
        res.json({
            body
        });
    }

});

//actualizar
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json(id);
});

//eliminar
app.delete('/usuario', function(req, res) {
    res.json("deleteUsuario");
});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${process.env.PORT}...`);
});