const express = require('express');
const app = express();


//rutas a exportar
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;