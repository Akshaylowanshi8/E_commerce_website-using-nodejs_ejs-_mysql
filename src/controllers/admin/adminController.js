const { Admin } = require('../../models')
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await Admin.findOne({ where: { email } })
    if (!user) {
      return res.status(401).send('Invalid email or password')
    }
    if (user.password === password) {
      res.render('adminPages/adminDashboard')
    } else {
    throw new Error("Invalid password.");
    }
  } catch (error) {
    console.error('Error during login:', error)
}}

module.exports = {
  login
}
