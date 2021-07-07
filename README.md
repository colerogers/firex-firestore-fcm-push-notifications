# Trigger Push Notifications

**Author**: Cole Rogers

**Description**: Composes and sends push notifications from a Firestore Cloud Messaging instance based on the contents of documents from a specified Firestore collection.

Adding a document will trigger a push notification built from the documents fields. The documents top level fields specify the device or devices to send the notification to. The documents `notification` field specifies the notification content the device will recieve.

Here's an exmaple:
```js
admin.firestore().collection('notification').add({
    topic: 'mytopic',
    notification: {
        title: 'New Notification',
        body: 'We missed you!'
    }
});
```

You can specify both topics or individual devices, check out the PREINSTALL file for more info.

#### Additional Setup

Before installing this extension, make sure your Firebase project has both a Firestore and a Cloud Messaging instance.

#### Configuration Paramaters

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Notification documents collection: What is the path to the collection that contains the documents used to build and send the notifications?