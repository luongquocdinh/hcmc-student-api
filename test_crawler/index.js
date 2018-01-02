let path = require('path');
let trim = require('trim');
let url = require('url');

let osmosis = require('osmosis')
let origin_url = 'http://tuoitre.vn'
osmosis
    .get(origin_url)
    .set({
        "link": [
            "h4 a@href",
            "h3 a@href",
            "ul.list-1 li a@href"
        ]
    })
    .data((res) => {
        res.link = res.link.map(value => {
            let href = decodeURIComponent(trim(value))
            let hrefInfo = url.parse(href, true, true);
            
            if (hrefInfo.protocol != 'http:' && hrefInfo.protocol != 'https:') {
                return origin_url + value;
            } else {
                return value;
            }
        });
        console.log(res.link)
    })
    .error(error => {
        console.log(error);
    })
    .debug(console.log)