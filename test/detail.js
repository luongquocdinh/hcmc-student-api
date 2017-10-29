let osmosis = require('osmosis')
let url = 'http://tinnong.thanhnien.vn/chuyen-la/tau-ngam-hat-nhan-my-dam-vao-nui-ngam-van-khong-suy-suyen-57779.html'
let p = {
    "title": "h1.mainTitle",
    "datetime": "div.date-line span",
    "brief": "h2",
    "author": "#abody p strong:last",
    "content": "#abody",
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
