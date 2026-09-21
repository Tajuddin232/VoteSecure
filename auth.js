const User = require('./models/user');

const authenticateUser = async (req,res,next) =>{

    const user = await User.findOne({aadharCardNumber});

    if(!user)
        res.status(401).json({error : "no user"});

    const isMatch = await user.comparePassword(password);

    if(!isMatch)
        return null;

    return user;
};

module.exports = authenticateUser;
