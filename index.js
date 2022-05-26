const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');

// dbuser
// user : get-gears
//  password : xMPrZ2brvnbVymbJ
// middelware 

app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://get-gears:xMPrZ2brvnbVymbJ@cluster0.cbcnz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const servicesCollection = client.db("get-gears").collection("products");
      const reviewsCollection = client.db("get-gears").collection("reviews");
      app.get("/services",async(req,res)=>{
          const query={};
          const cursor = servicesCollection.find(query);
          const services = await cursor.toArray()
          res.send(services)
      })
      app.get("/reviews",async(req,res)=>{
          const query={};
          const cursor = reviewsCollection.find(query);
          const reviews = await cursor.toArray()
          res.send(reviews)
      })
     
     
    }
    finally{

    }
  }
  run()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})