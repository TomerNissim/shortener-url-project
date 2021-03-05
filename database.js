const shortid = require("shortid");
const fs = require("fs").promises;
const dir = process.env.NODE_ENV === 'test' ? './test':'./data';

class DataBase {
    static items = [];

    static async readData(){
        const data = await fs.readFile(`${dir}.json`, "utf8", function (err, data) {
            if(err){
                return console.log(err);
            }
        });
        this.items = JSON.parse(data);
    }

    static async addUrl(body){
        if(!isValidUrl(body.url)){
            return "400/URL"
        }
        await this.readData();
        for(let item of this.items){
            if(body.url === item.originalUrl)
            return item.id;
        }
        let item = {
            creationDate: convertDate(new Date()),
            redirectCount: 0,
            originalUrl: body.url,
            id: shortid.generate()
        };
        this.items.push(item);
        fs.writeFile(`${dir}.json`, JSON.stringify(this.items), function (err){
            console.log("data-saved");
        })
        return item.id;
    }

    static async getOriginUrl(id) { 
        await this.readData();
        for(let item of this.items){
            if(id === item.id){
                item.redirectCount += 1;
                fs.writeFile(`${dir}.json`, JSON.stringify(this.items));
                return item.originalUrl;
            }
        } 
        return "404/getOriginUrl";    
    }

    static async getStatistics(shortUrl){
        if(!shortid.isValid(shortUrl)){
            return "400/short-url";
        }
        await this.readData();
        console.log(shortUrl);
        for(let item of this.items){
            if(item.id === shortUrl){
                return {creationDate: item.creationDate ,
                        redirectCount: item.redirectCount ,
                        originalUrl: item.originalUrl ,
                        id: item.id
                } 
            }
        }
        return "404/statistic"
    }

    static async getShortUrl(longUrl){
        await this.readData();
        for(let item of this.items){
            if(item.originalUrl === longUrl){
                return item.id;
            }
        }
    }

}    
    
function isValidUrl(fullUrl) {
        const pattern = new RegExp(/^(https?|ftp|torrent|image|irc):\/\/+([w|W]{3}\.)?(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?$/);
        return pattern.test(fullUrl);
}
    
    // function isValidProtocol(url){
//     console.log(url);
//     // if(url.toString().startsWith("http://") || url.startsWith("https://")){
//     //     return true;
//     // }
//     // return false;
// }
function convertDate(date){
    return date.toISOString().toString().replace("T"," ").substr(0,19);
}
module.exports = DataBase;
