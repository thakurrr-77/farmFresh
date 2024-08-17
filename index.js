const http=require('http')
const fs=require('fs')
const url=require('url');
const replaceTemplate=require('./modules/replaceTemplate.js');
console.log(typeof replaceTemplate)

const tempOverview=fs.readFileSync("./templates/template-overview.html",'utf-8');
const tempProduct=fs.readFileSync("./templates/template-product.html",'utf-8');
const tempCard=fs.readFileSync("./templates/template-card.html",'utf-8');

const data=fs.readFileSync("./dev-data/data.json",'utf-8');
const dataObj=JSON.parse(data);

const server=http.createServer((req,res)=>{
   
    const {pathname,query}=url.parse(req.url,true);
    console.log(query);
    if(pathname=='/' || pathname=='/overview'){
        res.writeHead(200,{
            "Content-type":"text/html"
        })
        const cardsHtml=dataObj.map((element)=> replaceTemplate(tempCard,element)).join('');
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    }
    // product page
    else if(pathname=='/product'){
        const product=dataObj[query.id];
        let output=replaceTemplate(tempProduct,product);
        res.writeHead(200,{
            "Content-type":"text/html"
        })
        res.end(output);
    }
    // not found
    else{
        res.writeHead(400,{
            "Content-type":'text/html'
        });
        res.end("<h1>opps page not found</h1>")
    }
    // res.end("hello from the sever");
})

server.listen(8000,'127.0.0.1',()=>{
    console.log("server started at 8000");
})