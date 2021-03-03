const shortid = require("shortid");
const fs = require("fs").promises;

class DataBase {
    static items = [];

    static async readData(){
        const data = await fs.readFile("data.json", "utf8", function (err, data) {
            if(err){
                return console.log(err);
            }
            console.log(data);
        });
        this.items = JSON.parse(data);
    }

    static async addUrl(body){
        await this.readData();
        for(let item of this.items){
            if(body.url === item.originalUrl)
            return item.id;
        }
        let item = {
            creationDate: Date.now(),
            redirectCount: 0,
            originalUrl: body.url,
            id: shortid.generate()
        };
        this.items.push(item);
        fs.writeFile("data.json", JSON.stringify(this.items), function (err){
            console.log("data-saved");
        })
        return item.id;
    }

    static async getOriginUrl(id) {
        await this.readData();
        for(let item of this.items){
            if(id === item.id){
                item.redirectCount += 1;
                fs.writeFile("data.json", JSON.stringify(this.items));
                return item.originalUrl;
            }
        } 
        return null;    
    }
}

module.exports = DataBase;
