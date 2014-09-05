## Twitter game

Esse script foi criado durante o Meetup do dia 30 na IBTA para premiar o pessoal
que fizesse mais pontos enviando tweets com palavras-chave.

### Configuração

Você vai precisar dos tokens de autenticação do Twitter e configurar isso nesse
bloco de código no arquivo `app.js`:

```javascript
// Iniciamos o stream em tempo real do Twitter
var stream = new Twitter({
    consumer_key : '',
    consumer_secret : '',
    access_token_key : '',
    access_token_secret: ''
});
```

O bloco de código responsável por adicionar pontos para um usuário é este:

```javascript
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
```

Você também pode mudar a porta que o projeto vai rodar, no final do arquivo
`app.js`.

### Utilização

Existem dois métodos para consultar a pontuação dos participantes, uma dela
é a interface HTTP, que está com CORS habilitado, então você pode chamar
a url princial `http://seuservidor:8888/` de qualquer domínio através do
jQuery, AngularJS, Ember.js, etc..

```javascript
// Um exemplo com jQuery
$.getJSON('http://seuservidor:8888/', function(data){
    // Recebemos uma array de participantes junto
    // com a pontuação atual de cada um
    data.forEach(function(user){
        console.log('%s tem %s pontos', user.profile.screen_name, user.pontos);
    });
});
```

Também é possível receber em realtime a pontuação dos participantes, para
isso é necessário utilizar o Socket.io:

```javascript
var socket = io.connect('http://seuservidor:8888');
socket.on('tweet', function(tweet){
  console.log('SOCKET: %s tem %s pontos', user.profile.screen_name, user.pontos);
});
```

### Licença MIT

Copyright (c) <2014> <NodeBR>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

