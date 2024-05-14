const Users = require('./../models/Users');
const utils = require('./../commons/utils')
const { getPatientUsersOfDoctor } = require('../commons/aggregations/users')

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
    } catch (err) {
        console.log("Failed to create user: ", err);
        res.status(500).json("Failed to create user.");
    }

}

// GET /users?role=[doctor, patient]
async function getMany(req, res) {
    const role = req.query.role;
    const doctorEmail = req.query.doctorEmail;

    let users;
    if (role) {
        let projection = {
            _id: 1,
            firstName: 1,
            lastName: 1,
            profilePhotoUrl: 1,
            phoneNumber: 1,
            role: 1,
        };

        if (role == "doctor") {
            projection.professionalDegree = 1
            projection.specialization = 1

            users = await Users.find({ role: role }, projection);
        } else if (role == "patient") {
            projection.identityNumber = 1

            users = await getPatientUsersOfDoctor(doctorEmail);
        }

    }
    else
    // TODO: this should be changed if there will be admins
        users = await Users.find({});

    if (users.length > 0) {
        res.status(200).json(users);
    } else {
        res.status(404).json("Users not found.");
    }
}

// GET /users/:userInfo
async function getOne(req, res) {
    const userInfo = req.params.userInfo;
    const property = req.query.property;

    const user = await Users.findOne({ [property]: userInfo });
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json("User not found.");
    }
}

module.exports = {
    add,
    getMany,
    getOne,
}