var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    request = require('request');
    Schema = mongoose.Schema;

    var userSchema = new Schema({
      id       : String, 
      name: String,
  	  username: { type: String, required: true, unique: true },
	  password: { type: String, required: true },
      admin: Boolean,
    });

    var User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

express()
  // https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies -> I am a test

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

.get('/poke', function(req, res){
	var pokemon = req.body.queryResult.parameters['pokemon'];
    /*request('https://pokeapi.co/api/v2/pokemon/' + pokemon, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
        frase = 'As habilidades do '+ pokemon +' são ';
        for (var i = body.abilities.length - 1; i >= 0; i--) {
          frase += body.abilities[i].ability.name;
          if (i == 0){
            frase += '.';
          }else if(i == 1){
            frase += ' e ';
          }else{
            frase += ', ';
          }
        }
      let responseObj={
          "fullfillmentText": "",
          "": [{"text": {"text": [frase]}}],
          "source": ""
      }
    });*/
    res.json(pokemon);
   })

  .get('/people', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    User.find({}, function ( err, pessoas ){
      res.json(200, pessoas);
    });
  })

	.post('/poke', function (req, res) {
    var pokemon = req.body.queryResult.parameters['pokemon'];
    request('https://pokeapi.co/api/v2/pokemon/' + pokemon, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
        frase = 'As habilidades do '+ pokemon +' são ';
        for (var i = body.abilities.length - 1; i >= 0; i--) {
          frase += body.abilities[i].ability.name;
          if (i == 0){
            frase += '.';
          }else if(i == 1){
            frase += ' e ';
          }else{
            frase += ', ';
          }
        }
      let responseObj={
          "fullfillmentText": "",
          "": [{"text": {"text": [frase]}}],
          "source": ""
      }
    });
    res.json(responseOnj);
  })

  .post('/people', function (req, res) {
    var user = new User( req.body );
    // http://mongoosejs.com/docs/api.html#model_Model-save
    user.save(function (err) {
      res.json(200, user);
    });
  })

  .get('/people/:name', function(req, res){
    User.findOne({
      name: req.params.name
    })
    .exec(function(err, pessoa){
      if(err){
        res.send('err has ocurred');
      }else{
        res.json(pessoa);
      }
    })
  })

  .put('/people/:name', function(req, res){
    User.findOneAndUpdate({
      name: req.params.name
    },
    {$set: {username: req.body.username, 
    		password: req.body.password,
    		admin: req.body.admin}, 
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

.delete('/people/:name', function(req, res){
  User.findOneAndRemove(
    {name: req.params.name},
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
