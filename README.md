### Simple Auth Server

## Information
This is a simple key-based auth server written in [Node.js](https://nodejs.org). The modules used in this project are:
- [body-parser](https://npmjs.com/package/body-parser) - Parse all request bodies
- [console-stamp](https://npmjs.com/package/console-stamp) - All console logs have data like timestamps
- [express](https://npmjs.com/package/express) - Create HTTP server
- [mongo-sanitize](https://npmjs.com/package/mongo-sanitize) - Sanitize inputs
- [mongoose](https://npmjs.com/package/mongoose) - ORM for interacting with MongoDB
- [morgan](https://npmjs.com/package/morgan) - Log server events
- [randexp](https://npmjs.com/package/randexp) - Key generation
- [require-all](https://npmjs.com/package/require-all) - Dynamic route creation
- [uuid](https://npmjs.com/package/uuid) - Use in place of MongoDB ObjectId

## Current Routes
- View key schema [here](https://github.com/amcode21/simple-auth/blob/master/models/key.js)

- Admin Endpoints
    - **POST** /key/new - *Creates new key and returns its ID*
        - **Body:** *None*
        - **201 Created** returned if operation successful
    - **GET** /key/:id - *Gets key by ID and shows relevant information*
    - **PUT** /key/:id - *Updates key with [machineId](https://npmjs.com/package/node-machine-id) in request body*
        - **Body:** ```
        {
            "machineId": "something"
        }```
        - **200 OK** returned if operation successful

- Other Endpoints
    - **POST** /key/verify - *Verifies if machineId and key in body are in database*
         - **Body:** ```
        {
            "key": "something",
            "machineId": "something"
        }```
        - **200 OK** returned if operation successful
    - **POST** /key/active - *Checks whether key is currently bound to a specific device*
         - **Body:** ```
        {
            "key": "something"
        }```
        - **200 OK** returned if operation successful

**Note:** *All responses have a 'message' attribute which gives a more detailed reason why a request failed, if it did, rather than just the status code.*

## Adding Routes
To add routes, there are only a few simple steps:
- Create a new file in the `routes/` folder. This will become the base of the route. 
    - Creating a file called `example.js` creates a base route of `/example`
- Add this code to begin with:
```javascript 
'use strict';

module.exports = (router) => {

    return router;
};
```
**Do __NOT__ remove the `module.exports` or anything already inside it.**
- To add routes, simply start coding like you would in a regular Express.js app!
```js 
'use strict';

module.exports = (router) => {
    // GET /example/
    router.get('/', (req, res) => res.send('hello there'));

    // GET /test
    router.get('/test', (req, res) => res.json({ message: 'this is a test' }));

    return router;
};
```
