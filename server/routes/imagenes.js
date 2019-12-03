const express = require('express');

const fs = require('fs');
const path = require('path'); //para construir paths absolutos

let app = express();

const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, resp) => {

    let tipo = req.params.tipo;
    let imagen = req.params.img;

    //monto el path absoluto
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    console.log(pathImg);

    if (!fs.existsSync(pathImg)) {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg'); //monto el path absoluto
        resp.sendFile(noImagePath); //automaticamente lee el content type del archivo y lo setea !!
        //fs.unlinkSync(pathImagen);
    } else {
        //sino => la devolvemos
        resp.sendFile(pathImg); //automaticamente lee el content type del archivo y lo setea !!
    }



});


module.exports = app;