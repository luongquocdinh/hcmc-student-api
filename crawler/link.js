let path = require('path');
let sources = path.join(__dirname, './../sources');
let fs = require('fs');
let trim = require('trim');
let url = require('url');

let osmosis = require('osmosis')

fs.readdirSync(sources).forEach(file => {
    let content = fs.readFileSync(sources + '/' + file, 'utf8')
    let parse = JSON.parse(content);

    osmosis.get(parse.url)
        .set({
            link: parse.crawler.link
        })
        .data(res => {
            res.link = res.link.map(value => {
                // parse.origin_url + value
                let href = decodeURIComponent(trim(value))
                let hrefInfo = url.parse(href, true, true);
                
                if (hrefInfo.protocol != 'http:' && hrefInfo.protocol != 'https:') {
                    return parse.origin_url + value;
                } else {
                    return value;
                }
            });
            console.log(res.link);
        })
})  