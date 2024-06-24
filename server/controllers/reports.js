const { getReportDataForUser } = require("../commons/aggregations/reports")

// GET /users/:userEmail/report
async function getMany(req, res) {
    const userEmail = req.params.userEmail;
    const typeOfReport = req.query.type;
    const reportData = await getReportDataForUser(userEmail, typeOfReport);

    for(let data of reportData) {
        let totalPerMonth = data.totalPerMonth;
        
        let existingMonths = new Set(totalPerMonth.map(item => item.month));

        for(let i = 0; i < 12; i++) { 
            if(!existingMonths.has(i)) {
                totalPerMonth.push({ month: i, totalAmount: 0 });
            }
        }
        totalPerMonth.sort((a, b) => a.month - b.month);
    }

    if(reportData.length > 0) {
        res.status(200).json(reportData);
    } else {
        res.status(404).json({ message: "Data not found." });
    }
}

module.exports = {
    getMany,
}