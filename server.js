var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),

    usuario = new mongoose.Schema({
      id       : String, 
      nome     : String,
      email   : String,
      age     : Number
    }),

    User = mongoose.model('User', usuario);

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

express()
  // https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

  .use(function(req, res, next){
		res.setHeader("Access-Control-allow-Origin", "*");
		res.setHeader("Access-Control-allow-Methods", "GET, POST, PUT, DELETE");
		res.setHeader("Access-Control-allow-Headers", "Content-type");
		res.setHeader("Access-Control-allow-Credentials", true);
		next();
  })

  .get('/', function(req, res){
	res.send('ola');
   })

  .get('/people', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    User.find( function ( err, todos ){
      res.json(200, todos);
    });
  })

  .post('/people', function (req, res) {
    var user = new User( req.body );
    // http://mongoosejs.com/docs/api.html#model_Model-save
    user.save(function (err) {
      res.json(200, user);
    });
  })

  .get('/people/:nome', function(req, res){
    User.findOne({
      nome: req.params.nome
    })
    .exec(function(err, pessoa){
      if(err){
        res.send('err has ocurred');
      }else{
        res.json(pessoa);
      }
    })
  })

  .put('/people/:nome', function(req, res){
    User.findOneAndUpdate({
      nome: req.params.nome
    },
    {$set: {email: req.body.email}, 
     $set: {age: req.body.age}
	},
    {upsert: true},
    function(err, pessoa){
      if(err){
        res.send('err has ocurred');
      }else{
        res.json(pessoa);
      }
    })
  })

.delete('/people/:nome', function(req, res){
  User.findOneAndRemove(
    {nome: req.params.nome},
    function(err, pessoa){
      if(err){
        res.send('err has ocurred');
      } else{
        res.send(pessoa);
      }
    })
  })

  .use(express.static(__dirname + '/'))
  .listen(process.env.PORT || 5000);
