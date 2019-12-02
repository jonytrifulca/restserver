const express = require('express');
//importo el modelo
const Usuario = require('../models/usuario');

//encriptar pass
const bcrypt = require('bcrypt');

//underscore para filtrar campos en los objetos ver el put
const _ = require('underscore');


const app = express();

//me traigo el middleware de autenticacion del token
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

//consultar
//sin middleware app.get('/usuario', function(req, res) {
app.get('/usuario', verificaToken, (req, res) => {
    //app.get('/usuario', function(req, res) {

    //listado total no paginado
    /*Usuario.find({})
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarios //es igual a usuarios:usuarios
            })

        })*/


    //listado paginado, el usuario proporciona los que quiere y los que quiere escapar
    //OJO, ESE REQ.QUERY => POR METODO GET
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    //listado paginado
    //Usuario.find({}, 'nombre email') //en este find se pueden poner condicioens tal que google: true //tb podemos indicar que campos queremos devolver
    Usuario.find({ estado: true }, 'nombre email role estado google img') //en este find se pueden poner condicioens tal que google: true //tb podemos indicar que campos queremos devolver
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Usuario.count({ estado: true }, (err, conteo) => { //numero de registros de usuarios en la BD he puesto una condicion para que no cuente los eliminados

                res.json({
                    ok: true,
                    usuarios, //es igual a usuarios:usuarios
                    cuantos: conteo //num usuarios
                })

            });



        })



});

//crear
app.post('/usuario', [verificaToken, verificaAdminRol], function(req, res) {
    //recogemos los parametros por post haciendo uso de un paquete llamado
    //npm body-parser
    let body = req.body;

    //creamos el objeto
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //el segundo arg es el numero de vueltas ¿?¿
        role: body.role
    });

    //lo guardamos a la BD
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //kitamos el pass del usuario que devuelvo => lo hago en el usuarioSchema.methods.toJSON del modelo
        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


    /*
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
        }*/

});

//actualizar registro
app.put('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;

    //let body = req.body;
    //filtramos los campos actualizables
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    //el id, los campos, true => devuelve el registro actualizado y no el nuevo "entre llaves pk es un objeto"
    //runvalidators para que sea de acorde a las validaciones del schema del objeto
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });



});

//eliminar
//se pueden borrar fisicamente o marcando el estado = false
//para mantener la integridad referencial
app.delete('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let id = req.params.id;

    //delete duro

    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });*/

    //delete suave => actualizo su estado = false 
    let body = { estado: false };
    Usuario.findByIdAndUpdate(id, body, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});


//ojo a este export no es con llaves ¿?
module.exports = app;