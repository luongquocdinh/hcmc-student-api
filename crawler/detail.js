let trim = require('trim');
let url = require('url');

let osmosis = require('osmosis')

function crawler_detail(url, parse) {
    let p = {
        "title": parse.title,
        "thumbnail": parse.thumbnail,
        "brief": parse.brief,
        "content": parse.content,
        "author": parse.author,
        "datetime": parse.datetime
    }
    return new Promise((resolve, reject) => {
        osmosis
            .get(url)
            .set(p)
            .data((res) => {
                resolve(res)
            })
            .error(error => {
                console.log("ERROR: " + error);
                reject(error);
            })
            .debug(console.log)
    })
}

module.exports = {
    crawler_detail: crawler_detail
}