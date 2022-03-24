const mongoose = require('mongoose')

const documentSchema = mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    url: {type: String, required: true},
    description: {type: String, required: false, default: "Default description"},
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

module.exports = mongoose.model('Document', documentSchema);
