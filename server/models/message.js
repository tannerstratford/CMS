const mongoose = require('mongoose');
const contact = require('./contact');

const messageSchema = mongoose.Schema({
   id: { type: String, required: true },
   subject: { type: String, required: true },
   msgText: { type: String, required: true },
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
   senderContact: { type: mongoose.Schema.Types.Mixed, required: false }
});

module.exports = mongoose.model('Message', messageSchema);