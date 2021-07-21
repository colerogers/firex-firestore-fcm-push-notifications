interface Notification {
    title: string;
    body: string;
}

export interface NotificationDocument {
    notification: Notification;
    deviceTokens: string[] | undefined;
    topic: string | undefined;
}

export interface MessageDocument {
    notification: Notification;
    registration_ids: string[] | undefined;
    to: string;
}