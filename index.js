const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ctzede1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

async function run(){

try{
 const foodCollection = client.db('khFood').collection('foods');
 const reviewCollection = client.db('khFood').collection('review');



//  jwt token
app.post('/jwt', (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
    res.send({ token })
})
//  addfoods
 app.post("/allfood", async (req, res) => {
    const addFood = req.body;
    // console.log(result);
    const result = await foodCollection.insertOne(addFood);
    res.send(result);
    console.log(result);
})

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

app.patch('/review/:id', async(req, res) =>{
    const id = req.params.id;
    console.log(id);
    const status = req.body.status
    const query = {_id: ObjectId(id)};
    const updatervw = {
        $set:{
            status: status
        }
    }
    const result = await reviewCollection.updateOne(query, updatervw);
    res.send(result)
})

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