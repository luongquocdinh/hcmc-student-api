let path = require('path');
let sources = path.join(__dirname, './../sources');
let fs = require('fs');
let trim = require('trim');
let url = require('url');

let osmosis = require('osmosis')


function crawler_link(parse) {
    let link
    let parser = []
    return new Promise((resolve, reject) => {
        parse.crawler.link.map(r => {
            parser.push(r);
        })
        osmosis.get(parse.url)
            .set({
                "link": parser
            })
            .data((res) => {
                res.link = res.link.map(value => {
                    let href = decodeURIComponent(trim(value))
                    let hrefInfo = url.parse(href, true, true);
                    
                    if (hrefInfo.protocol != 'http:' && hrefInfo.protocol != 'https:') {
                        return parse.origin_url + value;
                    } else {
                        return value;
                    }
                });
                link = res.link
            })
            .done(() => resolve(link))
            .error(error => {
                console.log("ERROR: " + error);
                reject(error);
            })
            .debug(console.log)
        })
}

module.exports = {
    crawler_link: crawler_link
}
