'use strict';

const sanitize = require('mongo-sanitize');

const path = require('path');
const Key = require(path.join(__dirname, '..', 'models', 'Key.js'));

global.AUTH_KEY = process.env.AUTH_KEY;

module.exports = (router) => {
    const authenticate = (req, res, next) => {
        const authKey = req.get('auth-key');

        if (!authKey || authKey !== global.AUTH_KEY) {
            return res.status(401).json({
                message: 'bad authentication',
                timestamp: new Date().toISOString()
            });
        }

        return next();
    };

    router.post('/new', authenticate, (req, res) => {
        const key = new Key();

        console.log(key);

        key.save().then(() => {
            if (key.isNew) {
                console.error(new Error('Unknown error'));

                return res.status(500).json({
                    message: 'error saving key in database',
                    timestamp: new Date().toISOString()
                });
            }
            else {
                console.info(`Created new key with ID: ${key._id}`);

                return res.status(201).json({
                    message: 'key created',
                    _id: key._id,
                    timestamp: new Date().toISOString()
                });
            }
        }).catch((err) => {
            console.error(err);

            return res.status(500).json({
                message: 'error saving key in database',
                timestamp: new Date().toISOString()
            });
        });
    });

    router.get('/:id', authenticate, (req, res) => {
        Key.findById(req.params.id).exec().then((key) => {
            if (key) {
                return res.status(200).json(key.toJSON());
            }
            else {
                return res.status(500).json({
                    message: 'error finding key',
                    timestamp: new Date().toISOString()
                });
            }
        }).catch((err) => {
            console.error(err);

            return res.status(500).json({
                message: 'error finding key',
                timestamp: new Date().toISOString()
            });
        });
    });

    router.put('/:id', authenticate, (req, res) => {
        if (!req.body.machineId) {
            return res.status(400).json({
                message: `param 'machineId' required`,
                timestamp: new Date().toISOString()
            });
        }

        Key.findByIdAndUpdate(req.params.id, {
            machineId: sanitize(req.body.machineId)
        }, { new: true }).exec().then((key) => {
            if (key) {
                return res.status(200).json({
                    message: 'key updated',
                    timestamp: new Date().toISOString()
                });
            }
            else {
                return res.status(404).json({
                    message: 'key not found',
                    timestamp: new Date().toISOString()
                });
            }
        }).catch((err) => {
            console.error(err);

            return res.status(500).json({
                message: 'error updating key',
                timestamp: new Date().toISOString()
            });
        });
    });

    router.delete('/:id', authenticate, (req, res) => {
        Key.findByIdAndDelete(req.params.id).exec().then((key) => {
            if (key) {
                return res.status(204).json(key.toJSON());
            }
            else {
                return res.status(500).json({
                    message: 'error deleting key',
                    timestamp: new Date().toISOString()
                });
            }
        }).catch((err) => {
            console.error(err);

            return res.status(500).json({
                message: 'error deleting key',
                timestamp: new Date().toISOString()
            });
        });
    });

    ///////////

    router.post('/verify', (req, res) => {
        if (!req.body.key || !req.body.machineId) {
            return res.status(400).json({
                message: `parameters 'key' and 'machineId' required`,
                timestamp: new Date().toISOString()
            });
        }

        Key.findOne({
            key: sanitize(req.body.key),
            machineId: sanitize(req.body.machineId)
        }).exec().then((key) => {
            if (key) {
                return res.status(200).message({
                    verified: true,
                    message: 'key is verified',
                    timestamp: new Date().toISOString()
                });
            }
            else {
                return res.status(404).message({
                    verified: false,
                    message: 'key is not verified',
                    timestamp: new Date().toISOString()
                });
            }
        }).catch((err) => {
            console.error(err);

            return res.status(404).message({
                verified: false,
                message: 'error verifying key',
                timestamp: new Date().toISOString()
            });
        })
    });

    router.post('/active', (req, res) => {
        if (!req.body.key) {
            return res.status(400).json({
                message: `parameter 'key' required`,
                timestamp: new Date().toISOString()
            });
        }

        Key.findOne({ key: sanitize(req.body.key) }).exec().then((key) => {
            if (key) {
                if (key.machineId) {
                    return res.status(200).json({
                        active: true,
                        message: 'key is active',
                        timestamp: new Date().toISOString()
                    });
                }
                else {
                    return res.status(200).json({
                        active: false,
                        message: 'key is not active',
                        timestamp: new Date().toISOString()
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: 'key not found',
                    timestamp: new Date().toISOString()
                });
            }
        }).catch((err) => {
            console.error(err);

            return res.status(500).json({
                message: 'error finding key',
                timestamp: new Date().toISOString()
            });
        });
    });

    return router;
};