var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_ncdhz4rn:j51dpjdmpitu8v7onnt61uhi56@ds133281.mlab.com:33281/heroku_ncdhz4rn', function (err, result) {
    if (err) return console.log(err)
    console.log('Connect database successful')
})

let Source = require('./../models/source');
let Link = require('./../models/link');
let link = require('./link');
let detail = require('./detail');

// Source.find({ is_enable: true })
//     .then(sources => {
//         sources.map(parse => {
//             let source_id = parse._id;
//             link.crawler_link(parse)
//                 .then(r => {
//                     r.map(l => {
//                         Link.findOne({link: l})
//                             .then(result => {
//                                 if (!result) {
//                                     let data = Link({
//                                         "source_id": source_id,
//                                         "link": l
//                                     })
                                    
//                                     data.save((err) => {
//                                         if (err) {
//                                             throw err
//                                         }
        
//                                         console.log("Insert link:", l);
//                                     })
//                                 } else if (result) {
//                                     console.log("Link exist:", l)
//                                 }
//                             })
//                     })
//                 })
//         })
//     })
//     .catch(err => {
//         console.log(err)
//     })

Link.find({is_enable: true})
    .then(links => {
        links.map(p => {
            Source.findOne({_id: p.source_id})
                .then(s => {
                    detail.crawler_detail(p.link, s.crawler.detail)
                        .then(data => {
                            console.log(data);
                            p.is_enable = false;
                            p.save();
                        })
                        .catch(error => {
                            console.log(error);
                        })
                })
        })
    })
    .catch(err => {
        console.log(err);
    })