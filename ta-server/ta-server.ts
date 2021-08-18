import express = require('express');
import bodyParser = require("body-parser");
import Mail from "./services/mail";
import {Aluno} from '../common/aluno';
import {CadastroDeAlunos} from './cadastrodealunos';

var taserver = express();
const port = process.env.PORT || 3030;
taserver.use(express.json());

taserver.use(express.urlencoded({ extended: true }));

var cadastro: CadastroDeAlunos = new CadastroDeAlunos();

var allowCrossDomain = function(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

taserver.use(allowCrossDomain);

taserver.use(bodyParser.json());

taserver.get('/alunos', function (req: express.Request, res: express.Response) {
  res.send(JSON.stringify(cadastro.getAlunos()));
})

taserver.post('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body; //verificar se é mesmo Aluno!
  aluno = cadastro.cadastrar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi cadastrado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser cadastrado"});
  }
})

taserver.put('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body;
  aluno = cadastro.atualizar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi atualizado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser atualizado"});
  }
})

taserver.route("/sendemail").get((req, res) => {
  res.send({ 'result': 'version 0.0.2' })
});

taserver.post('/sendemail', function(req, res){
  let message = req.body;
     
  Mail.to = message.to;
  Mail.subject = message.subject;
  Mail.message = message.message;
  let result = Mail.sendMail();
  console.log(result)
  res.status(200).json({ 'result': result })
});


var server = taserver.listen(port, function () {
  console.log('Example app listening on port 3030!')
})

function closeServer(): void {
  server.close();
}

export { server, closeServer }