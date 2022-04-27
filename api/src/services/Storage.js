const fs = require("fs");
const path = require("path");

module.exports = {
	mover(path_anterior, path_novo, nome_anterior, nome_novo){
		if(!fs.existsSync(path_novo))
			if(!fs.mkdirSync(path_novo, { recursive: true})) throw 'Falha ao salvar submissão'; //Cria diretorio recursivamente

		const fullpath_anterior = path.resolve(path_anterior, nome_anterior);
		const fullpath_novo = path.resolve(path_novo, nome_novo);

		if(fs.existsSync(fullpath_anterior) && fs.existsSync(path_novo))
			fs.renameSync(fullpath_anterior, fullpath_novo)
		else throw 'Falha ao salvar submissão'
	},

  async deletarArquivo(path) {
		if(fs.existsSync(path))
			fs.unlinkSync(path);
  },
  gerarDiretorio(materiaId, exercicioId, userId) {
    let filePath;
    try {
      filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'uploads',
        String(materiaId),
        String(exercicioId),
        String(userId),
      );
    } catch (e) {
      console.log(e);
      console.log(".")
    }
    return filePath;
  },

  read(_path, filename) {
    const fullPath = path.resolve(_path, filename);
    console.log('read file', fullPath);
    return fs.readFileSync(fullPath, 'utf8');
  }
};
