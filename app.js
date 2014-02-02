var express = require('express');
var app = express();

app.use(express.logger());
app.use('/', express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on port 3000');