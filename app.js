var Twitter = require('ntwitter');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Configuramos o banco de dados
var level = require('level')('./db', {
    valueEncoding: 'json'
});

// Iniciamos o stream em tempo real do Twitter
var stream = new Twitter({
    consumer_key : '',
    consumer_secret : '',
    access_token_key : '',
    access_token_secret: ''
});


// Quando um tweet com o #meetupnodebr chegar,
// fazemos o parse dele
stream.stream('statuses/filter', {track: ['#meetupnodebr']}, function(stream){
    stream.on('data', function(tweet) {

        // Começamos com nenhum ponto
        var pontos = 0;

        // Vamos adicionando pontos para as palavras
        // que achamos no meio do tweet
        if(/nodebr/i.test(tweet.text))
            pontos++;

        if(/@paypaldev/i.test(tweet.text))
            pontos++;

        if(/ibta/i.test(tweet.text))
            pontos++;

        if(/@agendor/i.test(tweet.text))
            pontos++;

        // Vamos procurar se esse usuário já
        // está cadastrado banco de dados
        level.get(tweet.user.screen_name, function(err, user){

            if(err)
                console.log(err.stack);

            // Se não estiver vamos inicializar
            // ele no banco de dados
            if(!user || !user.pontos){
                user = {pontos: 0};
                user.profile = tweet.user;
            }

            // Acrescentamos os pontos
            // que ele acabou de ganhar com esse tweet
            user.pontos += pontos;

            // Salvamos a nova pontuação no banco de dadps
            level.put(tweet.user.screen_name, user, function(err){
                if(err)
                    console.log(err.stack);

                // Enviamos um broadcast para todos
                // que estão conectados na interface websocket
                // dizendo que um novo tweet com pontos foi parseado
                io.emit('tweet', {user : user, tweet: tweet});
            });

        });
    });
});

// Iniciamos o Express e habilitamos o CORS, assim esse projeto
// pode rodar standalone em qualquer servidor e permitir
// consultas de outros domínios
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// A rota principal vai retornar uma lista de usuários
// que já pontuaram no concurso
app.get('/', function(req, res){
    var users = [];
    level.createReadStream()
        .on('data', function(data){
            users.push(data.value);
        })
        .on('end', function(){
            res.json(users);
        });
});

// Iniciamos tudo na porta abaixo
server.listen(8888);
