Use this extension to trigger push notifications from a Firestore collection document.

This extension listens to a Firestore for changes to the specified collection
`/${NOTIFICATION_COLLECTION}/{id}` and sends notifications to the Firebase Cloud Messaging instance.