const router = require('express').Router();
const { createOrder, getAllOrders, getOneOrder, updateOrderStatus, deleteOrder } = require('../controller/orderController');
const { createSchedule, getAllSchedules, getOneSchedule, updateScheduleStatus, deleteSchedule, assignStaffToSchedule } = require('../controller/orderController');

const { checkAdmin } = require('../middleware/validation');

router.post('/create-order/:id', checkAdmin, createOrder);
router.get('/orders', checkAdmin, getAllOrders);
router.get('/orders/:id', checkAdmin, getOneOrder);
router.put('/order-status/:id', checkAdmin, updateOrderStatus);
router.delete('/orders/:id', checkAdmin, deleteOrder);


router.post('/create-schedule', createSchedule);
router.get('/schedules', checkAdmin, getAllSchedules);
router.put('/schedule-status/:id', checkAdmin, updateScheduleStatus);
router.put('/schedules/:id', checkAdmin, assignStaffToSchedule);

module.exports = router;