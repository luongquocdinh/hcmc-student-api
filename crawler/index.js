var chrono = require('chrono-node');
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_ncdhz4rn:j51dpjdmpitu8v7onnt61uhi56@ds133281.mlab.com:33281/heroku_ncdhz4rn', function (err, result) {
    if (err) return console.log(err)
    console.log('Connect database successful')
})

let Source = require('./../models/source');
let News = require('./../models/news');
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
                        .then(res => {
                            let data = News({
                                source: "news",
                                topic: "Tin Tức Tổng Hợp",
                                topic_ascii: "tin-tuc-tong-hop",
                            
                                title: res.title,
                                thumbnail: res.thumbnail,
                                brief: res.brief,
                                content: res.content,
                                author: res.author,
                                is_accept: true,
                                datetime: chrono.parseDate(res.datetime).getTime() / 1000
                            })
                            console.log("Done:", p.link);
                            data.save()
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

// News.remove({topic_ascii: "tin-tuc-tong-hop"})
//     .then(r => {
//         console.log("Done");
//     })
//     .catch(err => {
//         console.log(err)
//     })