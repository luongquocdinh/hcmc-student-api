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
const USERS_PATH = ROOT_PATH + '/event/register';

let token = 'e288fa61f3102f3ab6afa84df06ef326b1ab6f8d32c186a1545bff99e9d5fb1c';

describe ('Test API Register Event', () => {
    it ('Test API Register Event - Missing token', (done) => {
        let data = {
            id: '59cd139958e48c0016663261'
        }
        request
        .post(USERS_PATH)
        .send(data)
        .end( (err, res) => {
            expect(res.status).to.equal(401)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('Please Login');
            expect(res.body.meta.success).to.equal(0);
            done()
        })
    });

    it ('Test API Register Event - Missing id Event', () => {
        let data = {
            id: '59cd139958e48c001666326134'
        }

        request
        .post(USERS_PATH)
        .set('token', token)
        .send(data)
        .end((err, res) => {
            expect(res.status).to.equal(401)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('Event not exits');
            expect(res.body.meta.success).to.equal(0);
            done()
        })
    })

    it ('Test API Register Event - Number register enough', () => {
        let data = {
            id: '59cd139958e48c0016663261'
        }

        request
        .post(USERS_PATH)
        .set('token', token)
        .send(data)
        .end((err, res) => {
            expect(res.status).to.equal(401)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('Number enough');
            expect(res.body.meta.success).to.equal(0);
            done()
        })
    })

    it ('Test API Register Event - Register Event Successful', () => {
        let data = {
            id: '59c799f4faeb1f7579d04645'
        }

        request
        .post(USERS_PATH)
        .set('token', token)
        .send(data)
        .end((err, res) => {
            expect(res.status).to.equal(401)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('Register Event Successful');
            expect(res.body.meta.success).to.equal(0);
            done()
        })
    })

    it ('Test API Register Event - You have register event', () => {
        let data = {
            id: '59c799f4faeb1f7579d04645'
        }

        request
        .post(USERS_PATH)
        .set('token', token)
        .send(data)
        .end((err, res) => {
            expect(res.status).to.equal(401)
            expect(res.header['content-type']).to.have.string('application/json');
            expect(res.body.meta.message).to.equal('You have register');
            expect(res.body.meta.success).to.equal(0);
            done()
        })
    })

    after(function () {
        shutdown()
    })
})

