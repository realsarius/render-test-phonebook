const mongoose = require('mongoose');

// if (process.argv.length < 3) {
//     console.log("give password as argument")
//     process.exit(1)
// } else if (process.argv.length < 4) {
//     console.log("give name as argument")
//     process.exit(1)
// } else if (process.argv.length < 5) {
//     console.log("give phone number as argument")
//     process.exit(1)
// }

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url =
    `mongodb+srv://berkansozer:${password}@cluster0.m2xdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const PhoneSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
})

const Phone = mongoose.model('Phone', PhoneSchema);

if (!name || !phoneNumber) {
    Phone.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(phone => {
            console.log(`${phone.name} ${phone.phoneNumber}`);
        })
        mongoose.connection.close();
    })
} else {
    const phone = new Phone({
        name: name,
        phoneNumber: phoneNumber
    })

    phone.save()
        .then(result => {
            console.log(`added ${name} number ${phoneNumber} to phonebook`);
            mongoose.connection.close();
        })
}

