# Trigger Push Notifications

**Author**: Cole Rogers

**Description**: Composes and sends push notifications to a Firestore Cloud Messaging instance based on the contents of documents from a specified Firestore collection.

Adding a document will trigger a push notification built from the documents fields. The documents top level fields specify the device, devices, or topic that will recieve the notification. The documents field `notification` specifies the notification content the device will recieve.

Here's an exmaple:
```js
admin.firestore().collection('notification').add({
    topic: 'mytopic',
    notification: {
        title: 'New Notification',
        body: 'Hi from Firebase!'
    }
});
```

You can specify a topic or individual devices, not both. Check out the PREINSTALL file for more info on this restriction.

#### Additional Setup

Before installing this extension, your project must have a Firestore database and a Firebase Cloud Messaging instance with registered devices to recieve notifications.

#### Configuration Paramaters

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Push Notification document collection: The path to the collection that contains the documents used to send push notifications.

* Firebase Cloud Messaging Server Key: The server key for your Cloud Messaging instance, found in your project settings under the Cloud Messaging Tab.
