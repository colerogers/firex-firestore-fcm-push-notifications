// The Firebase Admin SDK to access Firebase Cloud Messaging.
const admin = require('firebase-admin');
admin.initializeApp();

// The Firebase Cloud Messaging service
const cloudMessaging = admin.messaging();

// The Fetch API
const fetch = require('node-fetch');
// The FCM send endpoint
const FCMEndpoint = 'https://fcm.googleapis.com/fcm/send';
// The FCM server key
const FCMServerKey = `key=${process.env.FCM_SERVER_KEY}`;

/* Helper functions */
const handleEvent = async (document) => {
    try {
        await sendNotification(document);
    } catch (err) {
        throw (err);
    }
};

const sendNotification = async (document) => {
    // formats the message or throws an error if the document isn't valid
    let messageToSend;
    try {
        messageToSend = generateNotification(document);
    } catch (err) {
        throw (err);
    }

    // sends the formatted message to the Firebase Cloud Messaging server
    if (messageToSend.tokens) {
        // we have tokens
        sendBody.registration_ids = messageToSend.tokens;
        try {
            const response = await fetch(FCMEndpoint, {
                method: 'POST',
                body: JSON.stringify(sendBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': FCMServerKey
                }
            });
            const result = await response.json();

            console.log(result);

            if (result.error) {
                throw new Error(result.error);
            }
        } catch (err) {
            throw (err);
        }
    } else {
        // we have a topic
        sendBody.to = '/topics/' + messageToSend.topic;

        try {
            const response = await fetch(FCMEndpoint, { 
                method: 'POST', 
                body: JSON.stringify(sendBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': FCMServerKey
                }
                });
            const result = await response.json();

            console.log(result);

            if (result.error) {
                throw new Error(result.error);
            }
        } catch (err) {
            throw (err);
        }
    }
};

const generateNotification = (data) => {
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
};

exports.handleEvent = handleEvent;
exports.generateNotification = generateNotification;
exports.sendNotification = sendNotification;