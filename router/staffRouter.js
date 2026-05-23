const router = require('express').Router()

const { createStaff, getAllStaff, getOneStaff, updateStaff, deleteStaff } = require('../controller/staffController');
const { checkAdmin } = require('../middleware/validation');

router.post('/create-staff', checkAdmin, createStaff);
router.get('/staffs', checkAdmin, getAllStaff);
router.get('/staffs/:id', checkAdmin, getOneStaff);
router.put('/staffs/:id', checkAdmin, updateStaff);
router.delete('/staffs/:id', checkAdmin, deleteStaff);

module.exports = router;