const { expect } = require("chai");
const admin = require("firebase-admin");

// Initialize the firebase-functions-test SDK using environment variables.
// These variables are automatically set by firebase emulators:exec
//
// This configuration will be used to initialize the Firebase Admin SDK, so
// when we use the Admin SDK in the tests below we can be confident it will
// communicate with the emulators, not production.
const test = require("firebase-functions-test")({
    projectId: process.env.GCLOUD_PROJECT,
});

// Import the exported function definitions from our functions/index.js file
const myFunctions = require("../helper");

describe("Unit tests", () => {
    after(() => {
      test.cleanup();
    });

    it("should throw Error empty data", async () => {
        expect(() => myFunctions.generateNotification({})).to.throw("Document does not have required 'notification' object with 'title' and 'body' fields.");
    });

    it("should throw Error no title or body", async () => {
        const data = { notification: {} };
        expect(() => myFunctions.generateNotification(data)).to.throw("Document does not have required 'notification' object with 'title' and 'body' fields.");
    });

    it("should throw Error no title", async () => {
        const data = { notification: { body: 'body' } };
        expect(() => myFunctions.generateNotification(data)).to.throw("Document does not have required 'notification' object with 'title' and 'body' fields.");
    });

    it("should throw Error no body", async () => {
        const data = { notification: { title: 'title' } };
        expect(() => myFunctions.generateNotification(data)).to.throw("Document does not have required 'notification' object with 'title' and 'body' fields.");
    });

    it("should throw Error title invalid type", async () => {
        const data = { notification: { title: 42, body: 'body' } };
        expect(() => myFunctions.generateNotification(data)).to.throw("Document does not have required 'notification' object with 'title' and 'body' fields.");
    });

    it("should throw Error body invalid type", async () => {
        const data = { notification: { title: 'title', body: 42 } };
        expect(() => myFunctions.generateNotification(data)).to.throw("Document does not have required 'notification' object with 'title' and 'body' fields.");
    });

    it("should throw Error no tokens or topic", async () => {
        const data = { notification: { title: 'title', body: 'body' } };
        expect(() => myFunctions.generateNotification(data)).to.throw("Document must have a valid property: 'deviceTokens' or 'topic'.");
    });

    it("should throw Error has tokens and topic", async () => {
        const data = { 
            notification: { title: 'title', body: 'body' },
            deviceTokens: [ 'token' ],
            topic: 'topic'
        };
        expect(() => myFunctions.generateNotification(data)).to.throw("Document must have only one valid property: 'deviceTokens' or 'topic', not both.");
    });

    it("should not have tokens, not an array", async () => {
        const data = { 
            notification: { title: 'title', body: 'body' },
            deviceTokens: { token: 'token' },
            topic: 'topic'
        };
        const res = myFunctions.generateNotification(data);
        expect(res.registration_ids).to.eq(undefined);
        expect(res.to).to.eq('/topics/topic');
    });

    it("should not have tokens, array length 0", async () => {
        const data = { 
            notification: { title: 'title', body: 'body' },
            deviceTokens: [],
            topic: 'topic'
        };
        const res = myFunctions.generateNotification(data);
        expect(res.registration_ids).to.eq(undefined);
        expect(res.to).to.eq('/topics/topic');
    });

    it("should not have tokens, array of ints", async () => {
        const data = { 
            notification: { title: 'title', body: 'body' },
            deviceTokens: [1, 2, 3],
            topic: 'topic'
        };
        const res = myFunctions.generateNotification(data);
        expect(res.registration_ids).to.eq(undefined);
        expect(res.to).to.eq('/topics/topic');
    });

    it("should have tokens, valid message", async () => {
        const data = { 
            notification: { title: 'title', body: 'body' },
            deviceTokens: ['t1','t2']
        };
        const res = myFunctions.generateNotification(data);
        expect(res.to).to.eq(undefined);
        expect(res.registration_ids.length).to.eq(2);
        expect(res.registration_ids[0]).to.eq('t1');
        expect(res.registration_ids[1]).to.eq('t2');
    });

    it("should have topic, valid message", async () => {
        const data = { 
            notification: { title: 'title', body: 'body' },
            topic: 'topic'
        };
        const res = myFunctions.generateNotification(data);
        expect(res.registration_ids).to.eq(undefined);
        expect(res.to).to.eq('/topics/topic');
    });
});