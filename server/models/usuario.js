const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'mail es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'pass  necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//actualizamos este metodo automatico para que no devuelva el password
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//le decimos al schema que use el plugin del unique validator
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

//se exporta indicando el nombre del modelo
module.exports = mongoose.model('Usuario', usuarioSchema);