const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

var cors = require("cors");
const { query } = require("express");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pgthecp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  try {
    const serviceCollection = client.db("pakGhar").collection("services");
    const reviewCollection = client.db("pakGhar").collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.sort({ _id: -1 }).toArray();
      res.send(services);
    });

    app.get("/serviceslimit", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.sort({ _id: -1 }).limit(3).toArray();
      res.send(services);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await reviewCollection.findOne(query);
      res.send(service);
    });

    app.put("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = req.body;
      const option = { upsert: true };
      const updatedReview = {
        $set: {
          description: user.description,
        },
      };
      const result = await reviewCollection.updateOne(
        query,
        updatedReview,
        option
      );
      res.send(result);
    });

    app.post("/addServices", async (req, res) => {
      const addService = req.body;
      const result = await serviceCollection.insertOne(addService);
      res.send(result);
    });

    app.post("/addReviews", async (req, res) => {
      const addReview = req.body;
      const result = await reviewCollection.insertOne(addReview);
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/courses", (req, res) => {
//   res.send(datas);
// });

// app.get("/courses/:id", (req, res) => {
//   const id = req.params.id;
//   const selectedCourse = datas.find((c) => c.id === id);
//   res.send(selectedCourse);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
