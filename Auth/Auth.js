const jwt = require("jsonwebtoken");

const Autherization = async (req, res, next) => {
  const token = req.headers.autherization;
console.log(typeof(token))
  if (token=='null' || !token ) {
    
    res.status(400).send({ err: "Unautherized" });
    
  }else{
    console.log("Token from auth page", token);

    const verify = await jwt.verify(token, process.env.secretKey);
    console.log("VERIFY", verify);
    res.user = verify.iat;
    res.id = verify.id;
    console.log(verify.id);
    next()
  }
};
module.exports = Autherization;
