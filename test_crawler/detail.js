let osmosis = require('osmosis')
let url = 'http://thethao.thanhnien.vn/bong-da-viet-nam/hlv-calisto-se-dan-dat-clb-tphcm-79388.html'
let p = {
    "title": "h1",
    "datetime": "time",
    "brief": "div#chapeau",
    "author": "div#abody p:last strong",
    "content": "div#abdf",
    "thumbnail": "meta[property='og:image']@content"
}
    osmosis
        .get(url)
        .set(p)
        .data((res) => {
            console.log(res)
        })
        .error(error => {
            console.log("ERROR: " + error);
        })
        .debug(console.log)
