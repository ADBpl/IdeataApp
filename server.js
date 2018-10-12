var express = require('express');
var app = express();

// Static files
app.use(express.static('public'));


app.listen(process.env.PORT || 8000, function(req, res) {
  console.log("server is listening port number 8000");
});
