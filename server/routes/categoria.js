const express = require('express');
//importo el modelo
const Categoria = require('../models/categoria');

//underscore para filtrar campos en los objetos ver el put
const _ = require('underscore');

const app = express();

//me traigo el middleware de autenticacion del token
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

//consultar
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion') //ordenar por la descripcion
        //populate, gracias a que en el modelo categoria pusimos el ref Usuario mongoose es capaz de inyectar aki el modelo a partir de su id
        //.populate('usuario')
        .populate('usuario', 'nombre email') //populate diciendo los campos a mostrar
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias, //es igual a categorias
                    cuantos: conteo //num categorias
                })

            });
        })
});


//obtengo una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id) //en este find se pueden poner condicioens tal que google: true //tb podemos indicar que campos queremos devolver
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "no existe categoria para ese id"
                    }
                });
            }

            res.json({
                ok: true,
                categoria
            })

        })
});



//crear, la categoria ha de tener el id del creador, que vienen en el token en:
//req.usuario._id
app.post('/categoria', [verificaToken], function(req, res) {
    //recogemos los parametros por post haciendo uso de un paquete llamado
    //npm body-parser
    let body = req.body;

    //creamos el objeto
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    //lo guardamos a la BD
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//actualizar registro
app.put('/categoria/:id', [verificaToken], function(req, res) {

    let id = req.params.id;

    //filtramos los campos actualizables
    let body = _.pick(req.body, ['descripcion'])

    //el id, los campos, true => devuelve el registro actualizado y no el nuevo "entre llaves pk es un objeto"
    //runvalidators para que sea de acorde a las validaciones del schema del objeto
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });



});

//eliminar
//se pueden borrar fisicamente o marcando el estado = false
//para mantener la integridad referencial
//SOLO UN ADMIN PUEDE BORRAR CATEGORIA Y LO HAREMOS BORRADO FISICAMENTE
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;
    //delete duro
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrado
        });
    });
});


module.exports = app;