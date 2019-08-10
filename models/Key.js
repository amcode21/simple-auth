'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const uuid = require('uuid');
const RandExp = require('randexp');

const keyExp = 'GN-' + '[A-Z0-9]{5}-'.repeat(6).slice(0, -1);
const key = new RandExp(keyExp);

const generateKey = () => key.gen();

const Key = new Schema({
    _id: { type: String, required: false, default: uuid.v4 },
    key: { type: String, required: false, default: generateKey },
    machineId: { type: String, required: false, default: undefined },
    created_at: { type: Date, required: false, default: Date.now }
});

module.exports = mongoose.model('Key', Key);