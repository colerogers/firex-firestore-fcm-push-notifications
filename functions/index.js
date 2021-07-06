const functions = require("firebase-functions");

const helper = require('./helper');

/* Entry point into the Function */
exports.triggerNotification = functions.handler.firestore.document
    .onWrite(async (change) => {
        const documentData = change.after.data();
        
        try {
            await helper.handleEvent(documentData);
        } catch (err) {
            console.log(err);
            return null;
        }
    });