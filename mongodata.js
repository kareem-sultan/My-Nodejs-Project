const {MongoClient} = require('mongodb');
const url = "mongodb+srv://kareem:data123@atlascluster.mz9xv.mongodb.net/"

const client = new MongoClient(url);


const main = async () => {
await client.connect();
console.log("connected");

const database = client.db("MyData").collection("courses");
const data = await database.find().toArray();
console.log(data);
}

main();