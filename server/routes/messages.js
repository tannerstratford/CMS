var express = require('express');
const contact = require('../models/contact');
var router = express.Router();
const Message = require('../models/message');
const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');

router.get('/', (req, res, next) => {
    Message.find()
    .populate('sender')
      .then(messages => {
        res.status(200).json({
            message: 'messages fetched successfully!',
            messages: messages
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'An error occurred',
          error: error
        });
      });
  });

 
router.post('/', (req, res, next) => {
    
    const maxMessageId = sequenceGenerator.nextId("messages");
    console.log("message Routes req.body.sender: " + req.body.sender)

    //senderContact = new Contact({id: "", name: "", email: "", phone: "", imageUrl: "", group: null});

    const message = new Message({
        id: maxMessageId,
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: req.body.sender,
        senderContact: new Contact({id: "", name: "", email: "", phone: "", imageUrl: "", group: null})
      });

    Contact.findOne({ _id: req.body.sender })
    .then(contact => {
       // senderContact = contact
       console.log("contact: " + contact)
        message.save()
      .then(createdMessage => {
        createdMessage.senderContact = contact;
        console.log("Created message: " + createdMessage)
        res.status(201).json({
          message: 'message added successfully',
          message: createdMessage
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
          });
      });

    });
});


  
// router.put('/:id', (req, res, next) => {
//     Message.findOne({ id: req.params.id })
//       .then(message => {
//         message.name = req.body.name;
//         message.description = req.body.description;
//         message.url = req.body.url;
  
//         Message.updateOne({ id: req.params.id }, message)
//           .then(result => {
//             res.status(204).json({
//               message: 'message updated successfully'
//             })
//           })
//           .catch(error => {
//              res.status(500).json({
//              message: 'An error occurred',
//              error: error
//            });
//           });
//       })
//       .catch(error => {
//         res.status(500).json({
//           message: 'message not found.',
//           error: { message: 'message not found'}
//         });
//       });
//   });

//   router.delete("/:id", (req, res, next) => {
//     Message.findOne({ id: req.params.id })
//       .then(message => {
//         Message.deleteOne({ id: req.params.id })
//           .then(result => {
//             res.status(204).json({
//               message: "message deleted successfully"
//             });
//           })
//           .catch(error => {
//              res.status(500).json({
//              message: 'An error occurred',
//              error: error
//            });
//           })
//       })
//       .catch(error => {
//         res.status(500).json({
//           message: 'message not found.',
//           error: { message: 'message not found'}
//         });
//       });
//   });

  module.exports = router; 