#  Tomer Nissim URL shortener 

## how does it works?
first of all clone my code to your computer.
you insert your long URL to the marked place and after you press on thr post URL button,
you will get your short URL for your own use.
for example:
you insert the long-URL https://www.youtube.com/watch?v=4o87lG04pBs => press post URL button =>
and you will get a unique id:"tRafMoX2c" and just entering the id in these template http://localhost:3000/api/shorturl/tRafMoX2c 
and get redirect To the requested site.

if you want to know some statistics like the date of creation of the short url or how many usage he have.
enter instead of api/shortur/tRafMoX2c enter api/statistic/tRafMoX2c like that=> http://localhost:3000/api/statistic/tRafMoX2c 
and this is what you will get.
{
"creationDate": "2021-03-06 17:25:15",
"redirectCount": 0,
"originalUrl": "https://www.youtube.com/watch?v=4o87lG04pBs",
"id": "tRafMoX2c"
}
#### repl.it link
https://repl.it/@TomerNissim/shortener-url-project#README.md
