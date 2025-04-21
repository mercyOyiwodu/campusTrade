const passport = require('../middlewares/passport');
const googleRouter = require('express').Router();
/**
 * @openapi
 * /api/v1/seller/google-authenticate:
 *   get:
 *     summary: Authenticate seller with Google
 *     tags:
 *       - Seller
 *     responses:
 *       '200':
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */
googleRouter.get('/google-authenticate', passport.authenticate('google', {scope: ['profile', 'email']}));

/**
 * @Swagger
 * /api/v1/seller/auth/google/login:
 *   get:
 *     summary: Handle Google login redirect
 *     tags:
 *       - Seller
 *     responses:
 *       '200':
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */

googleRouter.get('/auth/google/login', passport.authenticate('google'), async (req, res)=>{
    try{
        const token = await JWT.sign({sellerId: req.seller.id, isVerified: req.seller.isVerified},
            process.env.JWT_SECRET, {expiresIn: '1day'});
            const redirectUrl = `https://legacy-builder.vercel.app/callback/${token}/${req.seller.id}`;
    return res.redirect(redirectUrl);
    }catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error" 
        });

    }

    
   
})



module.exports = googleRouter;