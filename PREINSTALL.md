# PREINSTALL - Trigger Push Notifications
Use this extension to trigger push notifications from a Firestore collection document.

This extension listens to a Firestore for changes to the specified collection `/${NOTIFICATION_COLLECTION}/{id}` and sends notifications to the Firebase Cloud Messaging instance that is located in your Firebase project.

In order to correctly send a notification, this extension relies on a specific document structure. For all notifications, the document must have a top level field `notification` with two string properties `title` and `body`. You must also include another top level field `deviceTokens` or `topic` that determines where the notification goes

Here's an example of using `deviceTokens`:

```js
admin.firestore().collection('notification').add({
  deviceTokens: ['deviceToken1', 'deviceToken2'],
  notification: {
    title: 'Order Update!',
    body: 'Your order has moved to processing.',
  },
});
```

Here's an example of using `topic`:

```js
admin.firestore().collection('notification').add({
  topic: 'us-based-devices',
  notification: {
    title: 'Update our App!',
    body: 'A new version of our App is availiable.',
  },
});
```

**Important -** The document cannot have both a `topic` and `deviceTokens` fields, the extension will throw an error if both are found.

### Additional Setup

Before installing this extension, your project must have a Firestore database and a Firebase Cloud Messaging instance with registered devices to recieve notifications.