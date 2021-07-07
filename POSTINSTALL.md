# POSTINSTALL - Trigger Push Notifications

### See it in action

You can test out this extension right away!

1. Go to the Firebase console and navigate to your Firestore dashboard.

1.  If it doesn't already exist, create the collection you specified during installation: `${param:NOTIFICATION_COLLECTION}`.

1.  Add a document with a `notification` object with a `title` and `body` fields, and either a `deviceToken` or `topic` fields:

```js
{
    deviceTokens: ['deviceToken1', 'deviceToken2'],
    notification: {
        title: 'Order Update!',
        body: 'Your order has moved to processing.',
    }
}
```

or

```js
{
    topci: 'mytopic',
    notification: {
        title: 'Order Update!',
        body: 'Your order has moved to processing.',
    }
}
```


1.  In a few seconds, a notification will appear on the corresponding devices.

#### Using this extension

TODO: write about the fields