const Users = require("./../../models/Users")
const { getRatingsOfDoctor } = require("./../../commons/aggregations/feedback")
const { getTotalVisitsPerDoctor } = require("./../../commons/aggregations/appointments")

async function getTopAppreciatedDoctors(top) {
    let ratingsPerDoctor = [];
    let doctors = await Users.find({role: 'doctor'});
    for(let doctor of doctors) {
        let ratings = await getRatingsOfDoctor(doctor.email);
        if(ratings.length > 0) {
            ratingsPerDoctor.push({
                doctorFirstName: doctor.firstName,
                doctorLastName: doctor.lastName,
                specialization: doctor.specialization,
                rating: ratings[0].averageRating
            })
        }
    }

    ratingsPerDoctor.sort((doc1, doc2) => {
        if(doc1.rating > doc2.rating)
            return -1;
        if(doc1.rating < doc2.rating)
            return 1;
        return 0;
    })

    return ratingsPerDoctor.slice(0, top);
}

async function getTopVisitedDoctors(top) {
    let totalVisitsPerDoctor = await getTotalVisitsPerDoctor();
    return totalVisitsPerDoctor.slice(0, top);
}

module.exports = {
    getTopAppreciatedDoctors,
    getTopVisitedDoctors
}