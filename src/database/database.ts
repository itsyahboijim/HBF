import { Collection, MongoClient } from 'mongodb';

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
                email: "ndh@gmail.com",
                password: "ndhpass",
                name: "Naic Doctors Hospital",
                location: "Naic",
                contactNum: "***********",
                maxBeds: 50,
                availableBeds: 5
            },
            {
                email: "slrh@gmail.com",
                password: "slrhpass",
                name: "San Lorenzo Ruiz Hospital",
                location: "Naic",
                contactNum: "***********",
                maxBeds: 25,
                availableBeds: 10
            },
            {
                email: "kpfh@gmail.com",
                password: "kpfhpass",
                name: "Korean Philippines Friendship Hospital",
                location: "Trece",
                contactNum: "***********",
                maxBeds: 35,
                availableBeds: 12
            },
            {
                email: "geamh@gmail.com",
                password: "geamhpass",
                name: "Gen. Emilio Aguinaldo Memorial Hospital",
                location: "Trece",
                contactNum: "***********",
                maxBeds: 20,
                availableBeds: 17
            },
            {
                email: "tsmc@gmail.com",
                password: "tsmcpass",
                name: "Tanza Specialist Medical Center",
                location: "Tanza",
                contactNum: "***********",
                maxBeds: 33,
                availableBeds: 22
            },
            {
                email: "sndtmh@gmail.com",
                password: "sndtmhpass",
                name: "Sto. Nino De Tanza Medical Hospital",
                location: "Tanza",
                contactNum: "***********",
                maxBeds: 55,
                availableBeds: 25
            }
        ];

        const dataCheck = await this.collection.findOne();
        if (!dataCheck){
            await this.collection.insertMany(sampleData);
            console.log(`No data found in database. Injecting sample data.`);        
        }
    }
}