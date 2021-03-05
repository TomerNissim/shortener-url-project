const request = require("supertest");
const app = require("./app");
const fs = require("fs");
const shortid = require("shortid");
const DataBase = require("./database")
// const item = JSON.parse({"creationDate": "2021-03-05 13:23:07","redirectCount": 0 ,"originalUrl":"https://www.google.com","id":"8ZaZAgJKn"})

describe("testing post function", () =>{
    test("insert valid url and getting the short url", async () =>{
        const  response = await request(app).post("/api/shorturl/new").send({url:"https://www.google.com"})   
        const dataBaseUrl = await DataBase.getShortUrl("https://www.google.com")
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual("http://" + "localhost:3000" + "/api/shorturl/" + dataBaseUrl);
    });
    test("insert invalid URL and getting the appropriate response", async () =>{
        const response = await request(app).post("/api/shorturl/new").send({url:"hktps://www.go@ogle.com"})   
        const jsonResponse = await JSON.parse(response.text);
        expect(jsonResponse).toEqual({ error: ' Invalid URL' });
    });
    test("insert an url that already is in the system and getting the same short url", async () =>{
        const response = await request(app).post("/api/shorturl/new").send({url:"https://www.ynet.com"}) 
        expect(response.text).toEqual("http://" + "localhost:3000" + "/api/shorturl/" + "SHCPZEA67");
    });

});
describe("testing get function", () =>{
    test("get with path of /api/shorturl/:id to the correct url", async () =>{
        const  response = await request(app).get("/api/shorturl/SHCPZEA67");
        expect(response.text).toEqual( "Found. Redirecting to https://www.ynet.com")  
    });
    test("get with path of /api/shorturl/:id to the correct url", async () =>{
        const  response = await request(app).get("/api/shorturl/SHCPZA67");
        expect(response.text).toEqual( {error:' No short URL found for the given input'})  
    });

});