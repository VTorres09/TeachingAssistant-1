import express = require('express');
import bodyParser = require("body-parser");
import Mail from "./services/mail";
import {Aluno} from '../common/aluno';
import {CadastroDeAlunos} from './cadastrodealunos';

var taserver = express();
const port = process.env.PORT || 3000;
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
  const {aluno, medias} = req.body;
  const dateNow = (new Date()).getTime();
  const lastEmailDate = (new Date(aluno.lastEmail)).getTime();
  const dayInMilliseconds = 86400000;
  if((dateNow - lastEmailDate) < dayInMilliseconds){
    console.log("Esse aluno já recebeu email hoje");
    res.status(403).json({result: "Esse aluno já recebeu email hoje"});
  }else{
    Mail.to = aluno.email;
    Mail.subject = "Atualização de Notas";
    Mail.message = `<p>Prezado, ${aluno.nome}. Suas notas foram atualizadas! Confira a seguir:.</p><p>Requisitos: ${aluno.metas.requisitos}</p><p>Gerencia de Configuração: ${aluno.metas.gerDeConfiguracao}</p><p>Confira a Média da turma a seguir:</p><p>Requisitos: ${medias.requisitos}</p><p>Gerencia de Configuração: ${medias.gerDeConfiguracao}</p>`;
    Mail.sendMail();
    console.log("Email enviado com sucesso!");
    res.status(200).json({result:"Email enviado com sucesso!"});
  }
});


var server = taserver.listen(port, function () {
  console.log('Example app listening on port 3000!')
})

function closeServer(): void {
  server.close();
}

export { server, closeServer }