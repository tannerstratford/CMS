var express = require('express');
var router = express.Router();
const Contact = require('../models/contact');
const sequenceGenerator =  require('./sequenceGenerator')


router.get('/', (req, res, next) => {
    //console.log("getContacts route called")
    Contact.find()
      .populate('group')
      .then(contacts => {
        res.status(200).json({
            message: 'Contacts fetched successfully!',
            contacts: contacts
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
    const maxContactId = sequenceGenerator.nextId("contacts");
  
    const contact = new Contact({
      id: maxContactId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: [null]
    });

    console.log("made it this far")
  
    contact.save()
      .then(createdContact => {
        res.status(201).json({
          message: 'contact added successfully',
          contact: createdContact
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
          });
          console.log(error);
      });
  });

  
router.put('/:id', (req, res, next) => {
    Contact.findOne({ id: req.params.id })
      .then(contact => {
        contact.id = req.body.id
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone
        contact.imageUrl = req.body.imageUrl;
        contact.group = req.body.group;
  
        Contact.updateOne({ id: req.params.id }, contact)
          .then(result => {
            res.status(204).json({
              message: 'contact updated successfully'
            })
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'contact not found.',
          error: { contact: 'contact not found'}
        });
      });
  });

  router.delete("/:id", (req, res, next) => {
    Contact.findOne({ id: req.params.id })
      .then(contact => {
        Contact.deleteOne({ id: req.params.id })
          .then(result => {
            res.status(204).json({
              message: "contact deleted successfully"
            });
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          })
      })
      .catch(error => {
        res.status(500).json({
          message: 'contact not found.',
          error: { contact: 'contact not found'}
        });
      });
  });

module.exports = router; 