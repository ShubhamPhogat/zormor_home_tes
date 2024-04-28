const express = require("express");
const app = express();
const mysql = require("mysql");
app.use(express.json());
const cors = require("cors");
const corsOption = {
  origin: "http://localhost:3000",
  methods: "GET,POST,DELETE",
  Credential: true,
};
app.use(cors());
const port = 3001;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123asd()A",
  database: "places",
});
con.connect(function (err) {
  if (err) console.log("error in connection", err);
  else console.log("connection successful");
});

app.get("/getData", async (req, res) => {
  await con.query(
    "SELECT d.*, di.image_src FROM destinations d LEFT JOIN destination_images di ON d.id = di.destination_id",
    (error, response) => {
      if (error) {
        console.log("error in fetiching the data", error);
      } else {
        res.status(200).send(response);
      }
    }
  );
});

app.delete("/delete", async (req, res) => {
  const id = req.query.id;

  await con.query(
    `delete from destinations where destinations.id=${id}`,
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    }
  );
});
app.put("/update", async (req, res) => {
  const id = req.query.id;
  const data = req.body;
  await con.query(
    `update destinations set name="${data.name}", description="${data.description}",location="${data.location}",opening_hours="${data.openingHours}" where id=${id}`,
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    }
  );
});

app.post("/create", async (req, res) => {
  const data = req.body;
  await con.query(
    `INSERT INTO destinations (name, description, opening_hours, location) VALUES ("${data.name}","${data.description}","${data.openingHours}","${data.location}")`,
    (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    }
  );
});

app.listen(port, function () {
  console.log("app is running");
});
