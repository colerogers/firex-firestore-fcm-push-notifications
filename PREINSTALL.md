# PREINSTALL - Trigger Push Notifications
Use this extension to trigger push notifications from a Firestore collection document.

This extension listens to a Firestore for changes to the specified collection
`/${NOTIFICATION_COLLECTION}/{id}` and sends notifications to the Firebase Cloud Messaging instance
that is located in your Firebase project.

In order to correctly send a notification, this extension relies on a specific document 
structure. For all notifications, the document must have an object called `notification` with
two string properties `title` and `body`. You must also include either a property `deviceTokens`
that is a string array or a property `topic` of type string outside of the notification object.

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
    title: 'Order Update!',
    body: 'Your order has moved to processing.',
  },
});
```

