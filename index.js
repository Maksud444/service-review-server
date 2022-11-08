const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ctzede1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

try{
 const foodCollection = client.db('khFood').collection('foods');

 app.get('/foods', async(req, res) =>{
    const query = {};
    const cursor = foodCollection.find(query);
    const foods = await cursor.limit(3).toArray();
    res.send(foods);
 });
 app.get('/allfood', async(req, res) =>{
    const query = {};
    const cursor = foodCollection.find(query);
    const allfood = await cursor.toArray();
    res.send(allfood);
 });

}
finally{

}

}
run().catch(err => console.error(err))


app.get('/', (req, res) =>{
    res.send('kh food is running')
});

app.listen(port, () =>{
    console.log(`Kh Food is running ${port}`)
})