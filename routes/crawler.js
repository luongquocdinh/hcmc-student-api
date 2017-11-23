let express = require('express')
let path = require('path')
let osmosis = require('osmosis')
let crawler = require('./../crawler/detail');
let router = express.Router()

router.post('/', (req, res) => {
    let url = req.body.url;
    let p = {
        "title": req.body.title,
        "thumbnail": req.body.thumbnail,
        "brief": req.body.brief,
        "content": req.body.content + ':html',
        "author": req.body.author,
        "datetime": req.body.datetime
    }

    osmosis
        .get(url)
        .set(p)
        .data((response) => {
            return res.json(response);
        })
        .error(error => {
            return res.json(error);
        })
        .debug(console.log)
})

module.exports = router