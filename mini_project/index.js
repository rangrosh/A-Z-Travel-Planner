var express = require('express');
var html = require('./controllers/html');
var path = require('path');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));

html(app);

app.listen('3000', () => {
    console.log("Server started on port 3000");
});