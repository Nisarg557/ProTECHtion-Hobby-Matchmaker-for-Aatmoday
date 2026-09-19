// app.js
import { db, collection, addDoc } from './firebase.js';

async function uploadEventsFromJson() {
    try {
        // 1. Read the local event.json file
        const response = await fetch('./event.json'); 
        const eventsData = await response.json();

        console.log(`Found ${eventsData.length} events. Starting upload...`);

        // 2. Loop through and upload to the "events" collection
        for (const ev of eventsData) {
            await addDoc(collection(db, "events"), ev);
            console.log(`✅ Uploaded: ${ev.eventName}`);
        }

        console.log("🎉 All events uploaded successfully! Check your Firebase dashboard.");
    } catch (error) {
        console.error("❌ Error uploading events: ", error);
    }
}

// 3. Trigger the upload
uploadEventsFromJson();