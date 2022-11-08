const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
 const reviewCollection = client.db('khFood').collection('review');

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

 app.get('/allfood/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await foodCollection.findOne(query)
    res.send(service)
});


//review
app.get('/review', async (req, res) => {
    let query = {};
    if (req.query.email) {
        query = {
            email: req.query.email
        }
    }
    const cursor = reviewCollection.find(query);
    const review = await cursor.toArray();
    res.send(review)
})

app.post('/review', async (req, res) => {
    const review = req.body;
    const result = await reviewCollection.insertOne(review);
    res.send(result)
});

app.delete('/review/:id', async(req, res) =>{
    const id = req.params.id;
    const query = { _id: ObjectId(id)};
    const result = await reviewCollection.deleteOne(query);
    res.send(result);
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