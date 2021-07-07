# POSTINSTALL - Trigger Push Notifications

### See it in action

You can test out this extension right away!

1. Go to the Firebase console and navigate to your Firestore dashboard.

1.  If it doesn't already exist, create the collection you specified during installation: `${param:NOTIFICATION_COLLECTION}`.

1.  Add a document that has a `notification` top level field with `title` and `body` inner fields, and either a `deviceTokens` or `topic` top level field:

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
    topic: 'mytopic',
    notification: {
        title: 'Update our App!',
        body: 'A new version of our App is availiable.',
    }
}
```


1.  In a few seconds, a notification will appear on the corresponding devices.

### Using this extension

#### Notification field

The `notification` is a top level field that determines what content your notification payload will have. It has two required inner fields:
* **title** The title of the notification that will be displayed on your devices platform
* **body** The body or main content of the notification.

#### Device Tokens field

The `deviceTokens` field is a top level field that is an array of strings that contain the device tokens of each device where you want the notification to be sent to. If you only want a single device to recieve a notification, then you would only have one element in the array. This field cannot be used with the `topic` field.

#### Topic field

The `topic` field is a top level field that is the name of a topic in your Firebase Cloud Messaging instance that has registered devices. You can only put one topic in this field, if you wish to send to multiple topics, you must create multiple documents in the collection. This field cannot be used with the `deviceTokens` field.