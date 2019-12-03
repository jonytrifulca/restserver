const express = require('express');
//importo el modelo
const Producto = require('../models/producto');
//underscore para filtrar campos en los objetos ver el put
const _ = require('underscore');
const app = express();

//me traigo el middleware de autenticacion del token
const { verificaToken } = require('../middlewares/autenticacion');


//hay que hacer las rutas de
/*
todo sin derechos de administrador

todos los productos => paginado y con la categoria y el user

producto por id => mas el usuario y la cat

el post de creacion de producto, grabar el user y la categoria

el put de modificacion de productos  pero ojo... mmmm antes no modificamos user de categorias, k haremos con producto ¿?¿?

y el delete de productos pero delete suave con el campo disponible


*/


//consultar
app.get('/producto', verificaToken, (req, res) => {

    //paginacion
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('descripcion') //ordenar por la descripcion
        .populate('usuario', 'nombre email') //populate diciendo los campos a mostrar
        .populate('categoria', 'descripcion') //populate diciendo los campos a mostrar
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productos, //es igual a productos
                    cuantos: conteo //num productos
                })

            });
        })
});


//obtengo una producto por id
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id) //en este find se pueden poner condicioens tal que google: true //tb podemos indicar que campos queremos devolver
        .populate('usuario', 'nombre email') //populate diciendo los campos a mostrar
        .populate('categoria', 'descripcion') //populate diciendo los campos a mostrar
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "no existe producto para ese id"
                    }
                });
            }

            res.json({
                ok: true,
                producto
            })

        })
});



//buscar productos
app.get('/producto/buscar/:termino', [verificaToken], (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //i => insensible a mayus y minus

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email') //populate diciendo los campos a mostrar
        .populate('categoria', 'descripcion') //populate diciendo los campos a mostrar
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "no existe producto para ese id"
                    }
                });
            }

            res.json({
                ok: true,
                productos
            })

        })

});

//crear, la producto ha de tener el id del creador, que vienen en el token en:
//req.usuario._id
app.post('/producto', [verificaToken], function(req, res) {
    //recogemos los parametros por post haciendo uso de un paquete llamado
    //npm body-parser
    let body = req.body;

    //creamos el objeto
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: body.disponible,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id //el usuario que lo crea es el propietario, no se pasa por body 
    });

    //lo guardamos a la BD
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});

//actualizar registro
app.put('/producto/:id', [verificaToken], function(req, res) {

    let id = req.params.id;

    //filtramos los campos actualizables
    //let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria'])
    let body = req.body;

    //el id, los campos, true => devuelve el registro actualizado y no el nuevo "entre llaves pk es un objeto"
    //runvalidators para que sea de acorde a las validaciones del schema del objeto
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "no encontrado producto con dicho id"
                }
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        });

    });



});

//eliminar
//se pueden borrar fisicamente o marcando el estado = false
//para mantener la integridad referencial
//en este caso borrado suave atendiendo a disponible
app.delete('/producto/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    let body = { disponible: false };

    Producto.findByIdAndUpdate(id, body, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "producto no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


module.exports = app;