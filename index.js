const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.hvhc0.mongodb.net/?appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });



app.get('/', (req, res) => {
    res.send('All Sports Hub.......');
})



async function run() {
try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db('SportsDB').collection('users');
    const equipmentCollection = client.db('SportsDB').collection('equipment');
    const reviewCollection = client.db('SportsDB'.collection('review'));


    // create user 
    app.post('/users', async(req, res) => {
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    });


    // client review post 
    app.post('/review', async(req, res) => {
        const newReview = req.body;
        const result = await reviewCollection.insertOne(newReview);
        res.send(result);
    })


    // equipment relative api 
    app.post('/equipment', async(req, res) => {
        const newEquipment = req.body;
        const result = await equipmentCollection.insertOne(newEquipment);
        res.send(result);
    });

    app.get('/equipment', async(req, res) => {
        const cursor = equipmentCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });


    app.get('/details/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await equipmentCollection.findOne(query)
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
}
}
run().catch(console.dir);










app.listen(port, () => {
    console.log(`You Server Is Running on http://localhost:${port}`)
})
