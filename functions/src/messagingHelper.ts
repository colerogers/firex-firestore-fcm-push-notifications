import { NotificationDocument, MessageDocument } from './Interfaces';
const fetch = require('node-fetch');

// The FCM send endpoint
const FCM_ENDPOINT: string = 'https://fcm.googleapis.com/fcm/send';
// The FCM server key
// const FCM_SERVER_KEY = `key=${process.env.FCM_SERVER_KEY}`;

// TODO: add ts doc for this top level function
export function executeDocumentChange(change: any) {
    if (!change.after.exists) {
        return null;// no new data
    }

    const document = change.after.data() as NotificationDocument;
    const fcm_server_key = process.env.FCM_SERVER_KEY;

    if (!fcm_server_key) {
        return null;
    }

    const cloudMessagingHelper = new CloudMessagingHelper(FCM_ENDPOINT, fcm_server_key);
    try {
        // convert document to acceptable message
        const message = cloudMessagingHelper.convertDocumentToNotification(document);
        // send message
        cloudMessagingHelper.sendMessage(message);
    } catch (err) {
        throw (err);
    }

    return;
}

export class CloudMessagingHelper {
    private readonly fcm_auth_key: string;

    constructor(private fcm_endpoint: string, fcm_server_key: string) {
        this.fcm_auth_key = `key=${fcm_server_key}`;
    }

    private checkErrors(document: NotificationDocument): void {
        // must have title and body 
        if (!document.notification || 
            !document.notification.title || 
            !document.notification.body)
        {
            throw new Error(`Document does not have required 'notification' object with 'title' and 'body' fields.`);
        }

        if (!document.deviceTokens && !document.topic) {
            throw new Error(`Document must have a valid property: 'deviceTokens' or 'topic'.`);
        }

        if (document.deviceTokens && document.topic) {
            throw new Error(`Document must have only one valid property: 'deviceTokens' or 'topic', not both.`);
        }

        if (document.deviceTokens && document.deviceTokens.length <= 0) {
            throw new Error(`Document must have at least 1 device token in the 'deviceTokens' array.`);
        }
    }

    convertDocumentToNotification(document: NotificationDocument): MessageDocument {
        try {
            this.checkErrors(document);
        } catch (err) {
            throw (err);
        }
        
        const message: MessageDocument = {
            notification: document.notification,
            registration_ids: document.deviceTokens,
            to: '/topics/' + document.topic,
        };

        return message;
    }

    async sendMessage(message: MessageDocument): Promise<void> {
        try {
            const response = await fetch(this.fcm_endpoint, {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.fcm_auth_key,
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
}


