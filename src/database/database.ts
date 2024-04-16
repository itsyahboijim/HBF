import { Collection, MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const saltRounds = 10;

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

            if (this.collectionName == "hospitals"){
                this.collection.createIndex({name: "text"});
            }
            console.log(`DB Collection: ${this.collectionName} loaded.`);
        });
    }

    async injectSampleData(){
        if (this.collectionName != "hospitals"){
            return;   
        }
        const defaultImagePath = "/images/default.jpeg";

        const sampleData = [
            {
                email: "ndh@gmail.com",
                password: "ndhpass",
                name: "Naic Doctors Hospital",
                location: "Makina Rd., Naic, Cavite",
                contactNum: "(046) 412-1443",
                maxBeds: 50,
                availableBeds: 5,
                validated: true,
                image: defaultImagePath,
                active: true,
            },
            {
                email: "slrh@gmail.com",
                password: "slrhpass",
                name: "San Lorenzo Ruiz Hospital",
                location: "Governors Drive, Brgy. San Roque, Naic, Cavite 4110",
                contactNum: "(046) 412-1411",
                maxBeds: 25,
                availableBeds: 10,
                validated: true,
                image: defaultImagePath,
                active: true,
            },
            {
                email: "kpfh@gmail.com",
                password: "kpfhpass",
                name: "Korean Philippines Friendship Hospital",
                location: "Trece-Indang Road, Brgy. Luciano, 4109 Trece Martirez",
                contactNum: "(046) 419-1713",
                maxBeds: 35,
                availableBeds: 12,
                validated: true,
                image: defaultImagePath,
                active: true,
            },
            {
                email: "geamh@gmail.com",
                password: "geamhpass",
                name: "Gen. Emilio Aguinaldo Memorial Hospital",
                location: "Brgy. Luciano, Trece Martirez City, Cavite",
                contactNum: "(046) 419-2209",
                maxBeds: 20,
                availableBeds: 17,
                validated: true,
                image: defaultImagePath,
                active: true,
            },
            {
                email: "tsmc@gmail.com",
                password: "tsmcpass",
                name: "Tanza Specialist Medical Center",
                location: "Brgy Daang Amaya III, Tanza, Cavite",
                contactNum: "(046) 484-7777",
                maxBeds: 33,
                availableBeds: 22,
                validated: false,
                image: defaultImagePath,
                active: true,
            },
            {
                email: "sndtmh@gmail.com",
                password: "sndtmhpass",
                name: "Sto. Nino De Tanza Medical Hospital",
                location: "De Roman Subdivision, Daang Amaya, Tanza, Cavite",
                contactNum: "(046) 505-5046",
                maxBeds: 55,
                availableBeds: 25,
                validated: false,
                image: defaultImagePath,
                active: false,
            }
        ];

        const dataCheck = await this.collection.findOne();
        if (!dataCheck){
            for (const hospital of sampleData) {
                hospital.password = await new Promise((resolve, reject) => {
                    bcrypt.hash(hospital.password, saltRounds, (err, hash) => {
                        if (err) reject(err);
                        resolve(hash);
                    });
                });
                await this.collection.insertOne(hospital);
            }
            console.log(`No data found in "hospitals" collection. Injecting sample data.`);
        }
    }

    async injectSampleValidatedEmails(){
        if (this.collectionName != "emailRegister"){
            return;   
        }

        const sampleData = [
            {
                email: "ndh@gmail.com",
                validatedOn: Date.now(),
            },
            {
                email: "slrh@gmail.com",
                validatedOn: Date.now(),
            },
            {
                email: "kpfh@gmail.com",
                validatedOn: Date.now(),
            },
            {
                email: "geamh@gmail.com",
                validatedOn: Date.now(),
            }
        ];

        const dataCheck = await this.collection.findOne();
        if (!dataCheck){
            await this.collection.insertMany(sampleData);
            console.log(`No data found in "emailRegister" collection. Injecting sample data.`);        
        }
    }
}