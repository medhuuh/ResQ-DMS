const { MongoClient } = require('mongodb');

const localUri = "mongodb://127.0.0.1:27017/resq-dms";
const atlasUri = "mongodb+srv://medhuuh:a!123456!a@midhunsha.pdcjefk.mongodb.net/resq-dms?appName=MidhunSha";

async function migrate() {
    let localClient, atlasClient;
    try {
        console.log("Connecting to local DB...");
        localClient = new MongoClient(localUri);
        await localClient.connect();
        const localDb = localClient.db();

        console.log("Connecting to Atlas DB...");
        atlasClient = new MongoClient(atlasUri);
        await atlasClient.connect();
        const atlasDb = atlasClient.db();

        const collections = await localDb.listCollections().toArray();

        for (const colInfo of collections) {
            const colName = colInfo.name;
            if (colName.startsWith("system.")) continue;

            console.log(`Reading collection: ${colName}`);
            const data = await localDb.collection(colName).find({}).toArray();

            if (data.length > 0) {
                console.log(`Found ${data.length} documents. Copying to Atlas...`);
                // Optional: clear existing remote collection to prevent duplicates
                await atlasDb.collection(colName).deleteMany({});
                await atlasDb.collection(colName).insertMany(data);
                console.log(`Successfully copied ${colName} ✅`);
            } else {
                console.log(`Collection ${colName} is empty, skipping ⏭️`);
            }
        }

        console.log("\n🎉 Migration complete! All your local data is now live on the internet.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        if (localClient) await localClient.close();
        if (atlasClient) await atlasClient.close();
    }
}

migrate();
