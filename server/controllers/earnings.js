const { getEarningsForDoctor } = require("../commons/aggregations/earnings")

// GET /users/:userEmail/earnings
async function getMany(req, res) {
    const userEmail = req.params.userEmail;
    const earnings = await getEarningsForDoctor(userEmail);

    for(let earning of earnings) {
        let totalPerMonth = earning.totalPerMonth;
        
        let existingMonths = new Set(totalPerMonth.map(item => item.month));

        for(let i = 0; i < 12; i++) { 
            if(!existingMonths.has(i)) {
                totalPerMonth.push({ month: i, totalAmount: 0 });
            }
        }
        totalPerMonth.sort((a, b) => a.month - b.month);
    }

    res.status(200).json(earnings);
}

module.exports = {
    getMany,
}