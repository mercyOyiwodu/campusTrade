const adminRouter = require('express').Router();
const {verifySeller, createAdmin, loginAdmin, makeSuperAdmin} = require('../controller/adminController');
const { authenticateAdmin, isSuperAdmin, adminAuth } = require('../middlewares/adminAuth');

// Authentication routes
adminRouter.patch('/make-admin/:id', authenticateAdmin, isSuperAdmin, createAdmin);

adminRouter.patch('/make-super/:id', authenticateAdmin, makeSuperAdmin);
adminRouter.post('/login', loginAdmin);
// router.get('/pending', authenticateAdmin, adminAuth, getPendingSellers)

adminRouter.patch('/sellers/:sellerId/verify', authenticateAdmin, adminAuth, verifySeller);

// Export router
module.exports = adminRouter ;