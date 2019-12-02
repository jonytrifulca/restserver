const express = require('express');
//importo el modelo
const Usuario = require('../models/usuario');
//encriptar pass
const bcrypt = require('bcrypt');

//el jwt
const jwt = require('jsonwebtoken');

const app = express();

//ruta de login, recibe por post mail y password
app.post('/login', function(req, res) {

    let body = req.body;

    //vemos si existe el mail
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //puede que no exista el usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        //en este punto existe el usuario y comprobamos la contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        } else {

            //generamos el jwt
            let token = jwt.sign({
                usuario: usuarioDB //es el payload
            }, process.env.JWT_SEED, { expiresIn: process.env.JWT_CADUCIDAD_TOKEN }); //expira en una hora

            res.json({
                ok: true,
                usuario: usuarioDB,
                token: token
            });
        }

    });

});

module.exports = app;