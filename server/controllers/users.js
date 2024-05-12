const Users = require('./../models/Users');
const utils = require('./../commons/utils')

// POST /users
async function add(req, res) {
    const { role, firstName, lastName, identityNumber, phoneNumber, address, bloodType, height, weight, email } = req.body;
    const birthDate = utils.extractBirthdateFromIdentityNumber(identityNumber);
    const age = utils.extractAgeFromBirthdate(birthDate);
    const gender = utils.extractGenderFromIdentityNumber(identityNumber);
    const user = new Users({
        role: role,
        firstName: firstName,
        lastName: lastName,
        identityNumber: identityNumber,
        phoneNumber: "4" + phoneNumber,
        address: address,
        bloodType: bloodType,
        height: height,
        weight: weight,
        email: email,
        birthDate: birthDate,
        age: age,
        gender: gender
    })

    try {
        await user.save();
        res.status(200).json("User created successfully.");
    } catch(err) {
        console.log("Failed to create user: ", err);
        res.status(500).json("Failed to create user.");
    }

}

// GET /users/:userEmail
async function getByEmail(req, res) {
    const userEmail = req.params.userEmail;

    const user = await Users.findOne({ email: userEmail });
    if(user) {
        res.status(200).json(user);
    } else {
        res.status(404).json("User not found.");
    }
}

module.exports = { 
    add,
    getByEmail,
}