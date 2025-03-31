const userModel = require ('../models/user')
const jwt = require('jsonwebtoken');
 


exports.authenticate = async (req, res, next)=>{
    try {
        const auth = req.header('Authorization')
        if (auth == undefined) {
            return res.status(401).json({
                message: 'token not found'
            })
        }
        const token = auth.split(' ')[1]
        if (token == undefined) {
            return res.status(401).json({
                message: 'token not found'
            })
        }
       const decodedToken = jwt.verify(token, process.env.SECRET)
console.log(decodedToken)
       const user = await userModel.findById(decodedToken.userId)
       if (user == null) {
        return res.status(404).json({
            message: 'authentication failed: user not found'
        })
       }
    //    if (!user.isAdmin) {
    //     return res.status(404).json({
    //         message: 'authentication failed: user not found'
    //     })
    //    }
       req.user = decodedToken

       next()

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError){
            return res.status(401).json({
                message: 'session timed out'
            })
        }
       console.log(error.message) 
       res.status(401).json({
        message: 'internal server error'
       })
    }
}

exports.adminAuth = async (req, res, next)=>{
try {
    if (req.user.isAdmin == true ){
     next()   
    }else{
        res.status(403).json({
            message:"unauthorized: not an admin"
        })
    }
} catch (error) {
    console.log(error.message)
   res.status(500).json({
    message:'internal server error'
   }) 
}
}
