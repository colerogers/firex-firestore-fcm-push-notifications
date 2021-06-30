const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// The Firebase Cloud Messaging service
const cloudMessaging = admin.messaging();

exports.parseFirestore = functions.firestore
    .document('notifications/{docId}')
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

       const message = {
           tokens: doc.tokens,
           notification: {
               title: doc.title,
               body: doc.body,
           }
       };

       console.log("sending message: ", message);
       sendMessage(message);
    });

/* Helper methods */

generateMessage = function() {
    // parse the message from the Firestore
}

sendMessage = function(message) {
    cloudMessaging.sendMulticast(message)
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