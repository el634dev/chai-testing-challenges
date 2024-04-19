const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message')

/** Route to get all messages. */
router.get('/', (req, res) => {
   // Get all Message objects using `.find()`
   Message.find()
   .then((messages) => {
        // Return the Message objects as a JSON list
        return res.json([{messages}])
   }).catch((err) => {
        throw err.message;
   })
})

/** Route to get one message by id. */
router.get('/:messageId', (req, res) => {
    // Get the Message object with id matching `req.params.id` using `findOne
    Message.findOne(req.params.id)
    .then((matchingMessage) => {
        // Return the matching Message object as JSON
        return res.json({message: matchingMessage});
    }).catch((err) => {
        throw err.message;
    })
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    let message = new Message(req.body)
    message.save()
    .then(message => {
        return User.findById(message.author)
    })
    .then(user => {
        // console.log(user)
        user.messages.unshift(message)
        return user.save()
    })
    .then(() => {
        return res.send(message)
    }).catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', (req, res) => {
    let {title, body } = req.body;

    // Update the matching message using `findByIdAndUpdate`
    Message.findByIdAndUpdate(req.params.messageId, {title, body})
    .then((updatedMessage) => {
        // Return the updated Message object as JSON
        return res.json({message: updatedMessage })
    }).catch((err) => {
        throw err.message;
    })
})

/** Route to delete a message. */
router.delete('/:messageId', (req, res) => {
    // Delete the specified Message using `findByIdAndDelete`. Make sure
    // to also delete the message from the User object's `messages` array
    Message.findByIdAndDelete(req.params.messageId)
    .then(() => {
        // Return a JSON object indicating that the Message has been deleted
        return res.json({
            message: 'Message has been deleted successfully',
            '_id': req.params.messageId
        })

    }).catch((err) => {
        throw err.message
    })
})

module.exports = router