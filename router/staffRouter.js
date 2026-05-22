const { createStaff, getAllStaff, getOneStaff } = require('../controller/staff')

const router = require('express').Router()

router.post('/create-staff', createStaff);
router.get('/staffs', getAllStaff);
router.get('/staffs/:id', getOneStaff);

module.exports = router;