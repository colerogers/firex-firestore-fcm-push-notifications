const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// The Firebase Cloud Messaging service
const cloudMessaging = admin.messaging();

// .document('notifications/{docId}')
exports.triggerNotification = functions.handler.firestore.document
    .onWrite((change, context) => {
        /* we assume the record has a structure of 
            {
                tokens: [ 't1', 't2', ...],
                title: 'myTitle',
                body: 'myBody',
            }
        */
        console.log(context.params);
        const doc = change.after.data();
        console.log(doc);

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
        console.log(err);
        throw new Error("Failed in handleEvent.");
    }
}

generateNotification = function(data) {
    // parse the message from the Firestore
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

    // must have title and body 
    if (!data.notification || 
        !data.notification.title || 
        !data.notification.body ||
        typeof data.notification.title !== "string" ||
        typeof data.notification.body !== "string") {
        throw new Error(`Document does not have a 'notification' object with 'title' and 'body' required fields.`);
    }

    const message = {
        notification: {
            title: data.notification.title,
            body: data.notification.body,
        }
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

    return message;
}

sendNotification = function(message) {
    // sends a formatted message to the Firebase Cloud Messaging server
    cloudMessaging.send(message)
        .then((response) => {
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                  if (!resp.success) {
                    failedTokens.push(registrationTokens[idx]);
                  }
                });
                console.log('List of tokens that caused failures: ' + failedTokens);
            }
        })
        .catch((err) => {
            console.log("Error: fcm.sendMulticast failed...");
            console.log(err);
        });
}

// TODO: Add ability to send up to 5 topics
generateTopicString = function(topicArray) {
    // build a topic condition string
    // ex -> '\'stock-GOOG\' in topics || \'industry-tech\' in topics';
    return null;
}