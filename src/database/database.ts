import { Collection, Db, MongoClient } from 'mongodb';

export class Database{
    private readonly mongodbUrl: string = "mongodb://localhost:27017";
    private readonly client: MongoClient = new MongoClient(this.mongodbUrl);
    private readonly collectionName: string = "";
    // @ts-expect-error
    collection: Collection;

    constructor(collectionName: string){
        this.collectionName = collectionName;
        this.client.connect().then(() => {
            const db = this.client.db("hbfdb");
            this.collection = db.collection(this.collectionName);
            console.log(`DB Collection: ${this.collectionName} loaded.`);
        });
    }

    async injectSampleData(){
        const sampleData = [
            {
                name: "Naic Doctors Hospital",
                location: "Naic",
                bedCount: 5
            },
            {
                name: "San Lorenzo Ruiz Hospital",
                location: "Naic",
                bedCount: 10
            },
            {
                name: "Korean Philippines Friendship Hospital",
                location: "Trece",
                bedCount: 12
            },
            {
                name: "Gen. Emilio Aguinaldo Memorial Hospital",
                location: "Trece",
                bedCount: 17
            },
            {
                name: "Tanza Specialist Medical Center",
                location: "Tanza",
                bedCount: 22
            },
            {
                name: "Sto. Nino De Tanza Medical Hospital",
                location: "Tanza",
                bedCount: 25
            }
        ];

        const dataCheck = await this.collection.findOne();
        if (!dataCheck){
            await this.collection.insertMany(sampleData);
            console.log(`No data found in database. Injecting sample data.`);        
        }
    }
}