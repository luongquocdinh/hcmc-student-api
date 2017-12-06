var expect = require('chai').expect;
var request = require('superagent');
var mongoose = require('mongoose');
var shutdown = require('./../bin/index').shutdown

mongoose.connect('mongodb://heroku_ncdhz4rn:j51dpjdmpitu8v7onnt61uhi56@ds133281.mlab.com:33281/heroku_ncdhz4rn', { useMongoClient: true })
    .then(result => {
    
    })
    .catch(err => {
    console.log(err);
    })

var port = require('./../bin/index').port

const ROOT_PATH = 'http://localhost:' + port
const USERS_PATH = ROOT_PATH + '/redeem';

let token = 'cd790654254d239f57faa5acf0d18dd962e6bfbab8b05cbda66a8ec111591e4c';

describe ('Test API Redeem Reward', () => {
    it ('Test API Redeem Reward - Missing token', (done) => {
        let data = {
            id: '59c86462c06b3147fda9fc99'
        }
        request
        .post(USERS_PATH)
        .send(data)
        .end( (err, res) => {
            expect(res.status).to.equal(400)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('Please Login');
            expect(res.body.meta.success).to.equal(0);
            done()
        })
    });

    it ('Test API Redeem Reward - Reward not extis', (done) => {
        let data = {
            id: mongoose.Types.ObjectId('59c86462c06b3147fda9fc90')
        }
        request
        .post(USERS_PATH)
        .set('token', token)
        .send(data)
        .end( (err, res) => {
            expect(res.status).to.equal(401)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('Reward not extis');
            expect(res.body.meta.success).to.equal(0);
            done()
        })
    });

    it ('Test API Redeem Reward - Not enough point', (done) => {
        let data = {
            id: mongoose.Types.ObjectId('59c86462c06b3147fda9fc99')
        }
        request
        .post(USERS_PATH)
        .set('token', token)
        .send(data)
        .end( (err, res) => {
            expect(res.status).to.equal(401)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('Not enough point');
            expect(res.body.meta.success).to.equal(0);
            done()
        })
    });

    it ('Test API Redeem Reward - Redeem successful', (done) => {
        let data = {
            id: mongoose.Types.ObjectId('59e31b50f96f5410f3f9c292')
        }
        request
        .post(USERS_PATH)
        .set('token', token)
        .send(data)
        .end( (err, res) => {
            expect(res.status).to.equal(200)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('System handling');
            expect(res.body.meta.success).to.equal(1);
            done()
        })
    });
})