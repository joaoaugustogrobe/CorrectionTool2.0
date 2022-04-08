/*
db2 = connect("host.docker.internal:27017/correctiontool")

db2.createCollection("professors");

db2.professors.insert({
    //"_id": ObjectID(),
    "email": "joaoaugustogrobe@hotmail.com",
    "password": "123456789",
    "nome": "João Augusto",
    "gravatarUrl": "4085a2c8ef93d10d6e714c2e32db9fe9"
})
*/

db.test.insertMany([
  {
    _id: 1,
    name: 'Tensor',
    age: 6
  },
  {
    _id: 2,
    name: 'Flow',
    age: 10
  }
])

/*
db.createUser(
    {
        user: "roppwer2",
        pwd: "SuperSecretPasswordddee",
        roles: [
            {
                role: "readWrite",
                db: "correctiontool"
            }
        ]
    }
);
*/