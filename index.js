var app = require('./server.js');

var port = 4568;

app.listen(process.env.PORT || port);

console.log('Server now listening on port ' + port);
