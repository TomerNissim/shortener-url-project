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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/:id", async (req,res) => {
    const id = req.params.id;
    if(id === "favicon.ico"){
      res.status(400);
      return;
    }
    let url =await DataBase.getOriginUrl(id);
    if(url.startsWith("htt")){
      res.redirect(url);
      return;
    }
    res.send(responseHandling(url));  
})

app.get("/api/statistic/:id", async (req,res) => {
  const id = req.params.id;
  let statistics = await DataBase.getStatistics(id);
    res.send(responseHandling(statistics))
})

function responseHandling(response){
  switch(response){
      case "400/short-url":
          return {status: 400, error: "error" + ":" +" Invalid short-url format" };
      case "400/protocol":
          return {status: 400, error: "error" + ":" +" Invalid protocol" };    
      case "404/statistic":
          return {status: 404, error: "error" + ":" +" No statistic found for the given input" };
      case "404/getOriginUrl":
          return {status: 404, error: "error" + ":" +" No short URL found for the given input" }
  }
  return {status: 200, data: response}
}


module.exports = app;
