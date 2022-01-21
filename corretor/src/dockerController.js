const Docker = require("dockerode");



class DockerClient {
    docker = null;

    constructor() {
        this.docker = new Docker({ protocol: 'http', host: 'host.docker.internal', port: 2376 })
    }

    executarTeste(parametros) {
        console.log(`[RUN] Instancia Octave: ${parametros.nomeFuncao}`);
        const { nomeFuncao, input, materia, exercicio, aluno } = parametros;
        //funcao: newton
        const _correcao_inicio = Date.now();


        return new Promise((resolve, reject) => {
            var docker = this.docker;

            docker.run(
                'mtmiller/octave:latest',
                ["octave", "--eval", `${nomeFuncao}(${input.join(',')})`, "-p", `/usr/local/Exercicios/${materia}/${exercicio}/${aluno}`, "-q"],
                process.stdout, {
                    Tty: false,
                    HostConfig: {
                        AutoRemove: true,
                        Binds: ["/Users/joaoaugusto/Documents/Repositorios/CorrectionTool2.0/api/uploads:/usr/local/Exercicios/"]
                    }
                },
                function(err, data, container){
                    if (err) {
                        console.error(err)
                        reject(err)
                      }
                }
            ).on('stream', function (stream) {
                let output = "";
                stream.on('data', data=>output += data)
                stream.on('close', ()=>{
                    const _correcao_final = Date.now();
                    resolve({output, _correcao_final, _correcao_inicio})
                })
                // resolve();
              });

            setTimeout(reject, 10000); //10s timeout

        
            // .then(data => console.log("data:", data)).catch(e => console.error)
        });
    }
}

module.exports = DockerClient;