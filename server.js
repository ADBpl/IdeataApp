var express = require('express');
const bodyParser = require("body-parser");
var app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
// Static files
app.use(express.static('public'));


app.listen(process.env.PORT || 8000, function(req, res) {
  console.log("server is listening port number 8000");
});


app.post("/echo", function(req, res) {
  var speech =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});