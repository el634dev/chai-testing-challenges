require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})


describe('Message API endpoints', () => {
    beforeEach((done) => {
        // add any beforeEach code here
        const sampleMessage = new Message({
            message: 'Hello Jane',
            _id: SAMPLE_MESSAGE_ID
        })
        sampleMessage.save()
            .then(() => {
                done()
            })
    })

    afterEach((done) => {
        // add any afterEach code here
        Message.deleteMany({ message: ['Hello Jane', 'steak for today']})
            .then(() => {
                done()
            })
    })

    it('should load all messages', (done) => {
        // Completed this
        chai.request(app)
            .get('/messages')
            .end((error, response) => {
                if(error) done(error);
                expect(response.body).to.be.deep.equal({
                    message: 'Hello Jane'
                });
                done();
            })
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai.request(app)
            .get('/messages/{messageId}')
            .end((error, response) => {
                if(error) done(error);
                expect(response.body).to.bedefined();
            })
            done();
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        chai.request(app)
            .post('/messages')
            .end((error, request) => {
                if(error) done(error);
                expect(response.body).to.contain({
                    message: "Hello Jane"
                })
                done();
            })
            
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        done()
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        done()
    })
})

