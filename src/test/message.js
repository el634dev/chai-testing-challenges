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

// Should be a 12 byte string
const USER_OBJECT_ID = '2485833905949'
const SAMPLE_MESSAGE_ID = 'bbbbbbbbbbbb'
const SAMPLE_MESSAGE_ID_2 = 'cccccccccc'

describe('Message API endpoints', () => {
    beforeEach(async (done) => {
        // add any beforeEach code here
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
            _id: USER_OBJECT_ID
        })
        await sampleUser.save()

        const sampleMessage = new Message({
            title: 'Hello World',
            body: 'Saying hello in Node',
            author: sampleUser,
            _id: SAMPLE_MESSAGE_ID
        })
        await sampleMessage.save()
    })

    afterEach((done) => {
        // add any afterEach code here
        User.deleteMany({ username: ['myuser'] })
        Message.deleteMany({ title:['Hello World', 'steak for today', 'not today Node']})
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
                expect(response.body).to.be.an('object');
                expect(response.body.messages[0].title).to.deep.equal('Hello World')
                expect(response.body.messages[0].body).to.deep.equal('Saying hello in Node')
                expect(response.body.messages[0].author ).to.deep.equal('2485833905949')
                done();
            })
    })

    it('should get one specific message', (done) => {
        // Completed this
        chai.request(app)
            .get(`/messages/${SAMPLE_MESSAGE_ID}`)
            .end((error, response) => {
                if(error) done(error);
                expect(response.body).to.have.status(200);
                expect(response.body).to.be.an('object');
                expect(response.body.messages[0].title).to.deep.equal('Hello World')
                expect(response.body.messages[0].body).to.deep.equal('Saying hello in Node')
                expect(response.body.messages[0].author ).to.deep.equal('2485833905949')
                
                // Check to see if the message exists
                Message.findOne({ message: 'steak for today'}).then(message => {
                    expect(message).to.be.an('object');
                    done();
                })
            })
    })

    it('should post a new message', (done) => {
        // Completed this
        const newMessage = {
            title: 'hello',
            secondTitle: 'today',
            author: User._id
        }

        chai.request(app)
            .post('/messages')
            .end((error, response) => {
                if(error) done(error);
                expect(response.body.message).to.be.an('object')
                expect(response.body.message).to.be.property('title', 'secondTitle')
                expect(response.body.message).to.be.property('author', '2485833905949')
                done();
            })
    })

    it('should update a message', (done) => {
        // Complete this
        chai.request(app)
            .put(`/messages/${SAMPLE_MESSAGE_ID}`)
            .send({ title: 'Blog', body: 'All about food'})
            .end((error, response) => {
                if(error) done(error);
                expect(response.body.message).to.be.an('object')
                expect(response.body.message).to.be.property('title', 'newtitle')
                expect(response.body.message).to.be.property('body', 'newbody')
                
                // Check to see if the message exists
                Message.findOne({ title: 'Hello World'}).then(message => {
                    expect(message).to.be.an('object');
                    done();
                })
            })
    })

    it('should delete a message', (done) => {
        // Complete this
        chai.request(app)
            .delete(`/messages/${SAMPLE_MESSAGE_ID}`)
            .end((error, response) => {
                if(error) done(error);
                expect(response.body).to.equal('Successfully deleted.')
                expect(response.body._id).to.equal(SAMPLE_MESSAGE_ID);

                // Check to ensure deletion was successful
                User.findOne().then(user => {
                    expect(user).to.have.property('user_1', 'myuser')
                    expect(user).to.equal(null);
                }).then(() => {
                    Message.findOne({ title: 'first_post'}).then(message => {
                        expect(message).to.equal(null);
                    }).then(() => {
                        done();
                    })
                })
            })
    })
})
