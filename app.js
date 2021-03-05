require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {urlencoded} = require("body-parser")
const DataBase = require("./database");
const { response } = require("express");
const app = express();

app.use(cors());
app.use("/public", express.static(`./public`));
app.use(urlencoded({extended: false}));
app.use(express.json());


app.post("/api/shorturl/new", async (req, res) => {
    let id = await DataBase.addUrl(req.body);
    if(id === "400/URL"){
      // res.send({status: 400, error: 'error' + ':' +' Invalid URL' }).status(400)
      res.send({error: ' Invalid URL' }).status(400)
    }else{
      res.send("http://" + "localhost:3000" + "/api/shorturl/" + id).status(200);
    }

})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/shorturl/:id", async (req,res) => {
    const id = req.params.id;
    
    let url =await DataBase.getOriginUrl(id);
    // if(url === "400/short-url"){
    //   res.send({error: " Invalid short-url format" }) 
    // }
    if(url === "404/getOriginUrl"){
      res.send({error:' No short URL found for the given input'})
    }
     res.redirect(url);
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
      case "400/URL":
          return {status: 400, error: "error" + ":" +" Invalid URL" };    
      case "404/statistic":
          return {status: 404, error: "error" + ":" +" No statistic found for the given input" };
      case "404/getOriginUrl":
          return {status: 404, error: "error" + ":" +" No short URL found for the given input" }
  }
  return {status: 200, data: response}
}


module.exports = app;
