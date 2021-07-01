const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firebase Cloud Messaging.
const admin = require('firebase-admin');
admin.initializeApp();

// The Firebase Cloud Messaging service
const cloudMessaging = admin.messaging();

/* Entry point into the Function */
exports.triggerNotification = functions.handler.firestore.document
    .onWrite((change) => {
        const documentData = change.after.data();
        
        try {
            handleEvent(documentData)
        } catch (err) {
            console.log(err);
            return null;
        }
    });

/* Helper methods */
handleEvent = function(data) {
    try {
        const notification = generateNotification(data);
        sendNotification(notification);
    } catch (err) {
        throw (err);
    }
}

generateNotification = function(data) {
    // parse the message from the Firestore document
    /* we assume the record has a structure of 
    {
        notification: {
            title: 'Notification Title',
            body: 'Notification Body'
        }
        deviceTokens: [ 'token1', 'token2', ...],
        topic: 'subscription topic'
    }
    */
    const message = {}  // message to build

    // must have title and body 
    if (!data.notification || 
        !data.notification.title || 
        !data.notification.body ||
        typeof data.notification.title !== "string" ||
        typeof data.notification.body !== "string") {
        throw new Error(`Document does not have required 'notification' object with 'title' and 'body' fields.`);
    }

    message.notification = {
        title: data.notification.title,
        body: data.notification.body,
    };

    if (data.deviceTokens && 
        Array.isArray(data.deviceTokens) && 
        data.deviceTokens.length > 0 &&
        data.deviceTokens.find((item) => typeof item !== "string") === undefined) {
        // deviceTokens is a non-empty array of all strings
        message.tokens = data.deviceTokens;
    }

    if (data.topic &&
        typeof data.topic === "string") {
        message.topic = data.topic;
    }

    if (message.tokens === undefined && message.topic === undefined) {
        throw new Error(`Document must have a valid property: 'deviceTokens' or 'topic'.`);
    }

    if (message.tokens && message.topic) {
        throw new Error(`Document must have only one valid property: 'deviceTokens' or 'topic', not both.`);
    }

    return message;
}

sendNotification = function(message) {
    // sends a formatted message to the Firebase Cloud Messaging server

    if (message.tokens) {
        cloudMessaging.sendMulticast(message)
            .then((response) => {
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(message.tokens[idx]);
                    }
                    });
                    console.log('List of tokens that caused failures: ' + failedTokens);
                }
            })
            .catch((error) => {
                console.log('Error sending multicast message:', error);
            });
    } else {
        cloudMessaging.send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    }
}

// TODO: Add ability to send up to 5 topics
generateTopicString = function(topicArray) {
    // build a topic condition string
    // ex -> '\'stock-GOOG\' in topics || \'industry-tech\' in topics';
    return null;
}