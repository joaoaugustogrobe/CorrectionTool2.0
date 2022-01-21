require("dotenv").config();
const Docker = require("dockerode");
const FeedbackController = require('./FeedbackController')
const FileController = require("./FileController");
var Promise = require("es6-promise").Promise;
const path = require("path");

let filaDeExecucao = [];
let docker;

module.exports = {
  executarOperacao(_parametroEntrada) {
    filaDeExecucao.push(_parametroEntrada)
    operadorLoop()
  },
  async containerCallback(req, res) {
    //FeedbackController.generateFeedbackFromDocker(req.body)
    res.send(200)
  }
};

let executando = false;

async function operadorLoop() {
  if (executando == true) return;

  do {
    executando = true;
    let resolucao = filaDeExecucao.shift()
    await corrigir(resolucao)
  } while (filaDeExecucao.length > 0)
  executando = false;
}

async function corrigir(_parametroEntrada) {
  try {
    executarContainer(_parametroEntrada)
  } catch (e) {
    throw e;
  }
}




function getDocker() {
  if (docker == null) docker = new Docker({ protocol: 'http', host: 'host.docker.internal', port: 2376 })
  return docker;
}

function createContainer(parametros) {
  return new Promise((resolve, reject) => {
    var docker = getDocker();
    docker.run(
      'mtmiller/octave:latest',
      ["octave", "--eval", `newton2065738(${parametros.teste.input.join(',')})`, "-p", `/usr/local/Exercicios/${parametros.materia}/${parametros.exercicio}/${parametros.aluno}`, "-q"],
      [process.stdout, process.stderr], {
      Tty: false,
      HostConfig: {
        AutoRemove: true,
        Binds: ["/Users/joaoaugusto/Documents/Repositorios/CorrectionTool2.0/api/uploads:/usr/local/Exercicios/"]
      }
    },
      function (err, data, container) {
        if (err) {
          console.error(err)
          reject(err)
        }
      }).on('log', function (log) {
        console.log(log)
        resolve();
      });

    // docker
    //   .createContainer({
    //     //EXECUTAR ANTES DE RODAR A API: docker pull mtmiller/octave
    //     Image: "mtmiller/octave:latest",
    //     //AttachStdout: true,

    //     HostConfig: {
    //       AutoRemove: true,
    //       // Binds: ["G:/Repositorios/CorrectionTool2.0/api/uploads:/usr/local/Exercicios/"], //necessario colocar diretorio dos uploads da maquina HOST
    //     },
    //     // Cmd: ["python3", "/opt/corretor/init_code.py" , `${prepararJsonEntrada(_parametroEntrada)}`]
    //     Cmd: ["echo", "testeeeee ?? eai, sera que vai ?"],
    //     //Cmd: ["tail", "-f", "/dev/null"], //mantem container vivo
    //   }, function (err, container) {
    //     if (err) {
    //       console.error(err)
    //       reject(err)
    //     }
    //     /*
    //     container.attach({ stream: true, stdout: true, stderr: true }, function (
    //       err,
    //       str
    //     ) {
    //       str.pipe(process.stdout);
    //     });
    //     */
    //     container.run().on('container', function (container) {
    //       //...
    //       console.log(container)
    //     });
    //     resolve(container);
    //   })
  });
}

async function executarContainer(path) {
  createContainer(path)
    .catch(e => {
      console.error(e)
    });
}

function prepararJsonEntrada(_parametroEntrada) {
  for (json in _parametroEntrada) {
    _parametroEntrada[json] = `${JSON.stringify(_parametroEntrada[json])}`
    _parametroEntrada[json] = _parametroEntrada[json].replace(/\\/g, "");
    _parametroEntrada[json] = _parametroEntrada[json].replace(/\s/g, "");
  }

  return _parametroEntrada
}