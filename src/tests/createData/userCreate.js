const User = require("../../models/User")

const userCreate = async () => {
    const userBody = {
        firstName: "Sergio",
        lastName: "Riatiga",
        email:"sergio@gmail.com",
        password:"sergio1234",
        phone:"+593993994519"
    }
    await User.create(userBody)
}

module.exports = userCreate
