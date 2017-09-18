let path = require('path');
let sources = path.join(__dirname, './../sources');
let fs = require('fs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_ncdhz4rn:j51dpjdmpitu8v7onnt61uhi56@ds133281.mlab.com:33281/heroku_ncdhz4rn', function (err, result) {
    if (err) return console.log(err)
    console.log('Connect database successful')
  })

let Source = require('./../models/source');

return new Promise((resolve, reject) => {
    fs.readdirSync(sources).forEach(file => {
        let content = fs.readFileSync(sources + '/' + file, 'utf8')
        let parse = JSON.parse(content);
        
        let data = new Source({
            name: parse.name,
            origin_url: parse.origin_url,
            url: parse.url,
            crawler: {
                link: parse.crawler.link,
                detail: {
                    title: parse.crawler.detail.title,
                    thumbnail: parse.crawler.detail.thumbnail,
                    brief: parse.crawler.detail.brief,
                    content: parse.crawler.detail.content,
                    author: parse.crawler.detail.author,
                    datetime: parse.crawler.detail.datetime
                }
            },
        });
        
        data.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Done");
            }
        });
    })
})
