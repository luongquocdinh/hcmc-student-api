let osmosis = require('osmosis')
let url = 'http://tuoitre.vn/dung-day-va-lam-lai-dang-hoang-duoc-khong-ong-chu-khaisilk-20171028181723056.htm'
let p = {
    title: "h1",
    datetime: "span.date",
    brief: "h2.txt-head",
    author: "div.author",
    content: "div.fck:html",
    thumbnail: "meta[property='og:image']@content"
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
