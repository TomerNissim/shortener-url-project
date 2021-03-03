require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {urlencoded} = require("body-parser")
const DataBase = require("./database")
const app = express();

app.use(cors());
app.use("/public", express.static(`./public`));
app.use(urlencoded({extended: false}));
app.use(express.json());


app.post("/api/shorturl/new", async (req, res) => {
  let id = await DataBase.addUrl(req.body);
  res.send("http://" + req.get("host") + "/" + id).status(200);
})

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/index.html");
// });

app.get("/:id", async (req,res) => {
  const id = req.params.id;
  if(id === "favicon.ico"){
    res.status(200);
    return ;
  }

  let url =await DataBase.getOriginUrl(id);
  if(url!== null){
    res.redirect(url);
  }
})
module.exports = app;
