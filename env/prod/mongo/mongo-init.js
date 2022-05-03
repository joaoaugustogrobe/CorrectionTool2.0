print('Start #################################################################');
db = db.getSiblingDB(_getEnv("MONGO_INITDB_DATABASE"));

db.createUser(
  {
    user: _getEnv("MONGO_INITDB_ROOT_USERNAME"),
    pwd: _getEnv("MONGO_INITDB_ROOT_PASSWORD"),
    roles: [{ role: 'readWrite', db: _getEnv("MONGO_INITDB_DATABASE") }],
  },
);

db.createUser(
  {
    user: "readonly",
    pwd: _getEnv("MONGO_READONLY_PASSWORD"),
    roles: [{ role: 'read', db: _getEnv("MONGO_INITDB_DATABASE") }],
  },
);

db.createCollection('admins');
db.createCollection('alunos');
db.createCollection('comentarios');
db.createCollection('correcaos');
db.createCollection('exercicios');
db.createCollection('materias');
db.createCollection('matriculas');
db.createCollection('professors');
db.createCollection('resolucaos');
db.createCollection('testeresolucaos');
db.createCollection('testes');


print('END #################################################################');