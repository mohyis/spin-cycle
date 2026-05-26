const router = require('express').Router();
const { createOrder, getAllOrders, getOneOrder, updateOrderStatus, deleteOrder, getCompletedOrderSchedules } = require('../controller/orderController');
const { createSchedule, getAllCompletedOrders, getOneSchedule, deleteSchedule, assignStaffToSchedule } = require('../controller/orderController');
const { createScheduleValidator, updateOrderStatusValidator } = require('../middleware/joiValidation');
const {scheduleRateLimiter,} = require('../middleware/rateLimiter');

const { checkAdmin } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order and schedule management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The Order MongoDB ID
 *           example: 787674563782983746578439
 *         orderId:
 *           type: string
 *           description: The generated Order ID
 *           example: "#SC-1234567"
 *         adminId:
 *           type: string
 *           description: The admin who created the order
 *           example: 787674563782983746578439
 *         customerId:
 *           type: string
 *           description: The associated customer ID
 *           example: 787674563782983746578439
 *         firstName:
 *           type: string
 *           example: Jane
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: jane.doe@example.com
 *         address:
 *           type: string
 *           example: 12 Lekki Phase 1, Lagos
 *         phoneNumber:
 *           type: string
 *           example: "+2348029837465"
 *         pickUpDate:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *         pickUpTime:
 *           type: string
 *           example: "10:00 AM"
 *         deliveryMode:
 *           type: string
 *           example: delivery
 *         paymentMode:
 *           type: string
 *           example: online
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *           example: "2026-06-03T00:00:00.000Z"
 *         readyDate:
 *           type: string
 *           format: date-time
 *           example: "2026-06-03T00:00:00.000Z"
 *         bookingDate:
 *           type: string
 *           format: date-time
 *           example: "2026-05-24T00:00:00.000Z"
 *         item:
 *           type: string
 *           example: shirts
 *         specification:
 *           type: string
 *           example: dry clean only
 *         quantity:
 *           type: number
 *           example: 3
 *         amount:
 *           type: number
 *           example: 1500
 *         note:
 *           type: string
 *           example: Handle with care
 *         status:
 *           type: string
 *           example: new request
 *         staffName:
 *           type: string
 *           example: James Brown
 */

/**
 * @swagger
 * /api/order/create-order/{id}:
 *   post:
 *     tags:
 *       - Order
 *     summary: Create an order for an existing customer
 *     description: Admin creates an order for a walk-in or phone-booking customer by their customer MongoDB ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Customer MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickUpDate
 *               - pickUpTime
 *               - deliveryMode
 *               - paymentMode
 *               - quantity
 *               - amount
 *             properties:
 *               pickUpDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-01"
 *               pickUpTime:
 *                 type: string
 *                 example: "10:00 AM"
 *               deliveryMode:
 *                 type: string
 *                 example: delivery
 *               paymentMode:
 *                 type: string
 *                 example: online
 *               item:
 *                 type: string
 *                 example: shirts
 *               specification:
 *                 type: string
 *                 example: dry clean only
 *               quantity:
 *                 type: number
 *                 example: 3
 *               amount:
 *                 type: number
 *                 example: 1500
 *               address:
 *                 type: string
 *                 example: 12 Lekki Phase 1, Lagos
 *               note:
 *                 type: string
 *                 example: Handle with care
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 */
router.post('/create-order/:id', checkAdmin, createOrder);

/**
 * @swagger
 * /api/order/orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all orders
 *     description: Retrieves all orders. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Orders retrieved successfully
 *                 requiredOrders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 787674563782983746578439
 *                       orderId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       address:
 *                         type: string
 *                         example: 12 Lekki Phase 1, Lagos
 *                       amount:
 *                         type: number
 *                         example: 1500
 *                       paymentMode:
 *                         type: string
 *                         example: online
 *                       bookingDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T00:00:00.000Z"
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T00:00:00.000Z"
 *                       deliveryMode:
 *                         type: string
 *                         example: delivery
 *                       status:
 *                         type: string
 *                         example: new request
 */
router.get('/orders', checkAdmin, getAllOrders);
router.get('/schedules/completed', checkAdmin, getAllCompletedOrders);

/**
 * @swagger
 * /api/order/orders/{id}:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get a single order
 *     description: Retrieves a single order by its MongoDB ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Order MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order retrieved successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 */
router.get('/orders/:id', checkAdmin, getOneOrder);

/**
 * @swagger
 * /api/order/order-status/{id}:
 *   put:
 *     tags:
 *       - Order
 *     summary: Update order status
 *     description: Updates the status of an order matching the given orderId and admin. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Order ID (orderId field, e.g. #SC-1234567)
 *         schema:
 *           type: string
 *           example: "#SC-1234567"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new order status
 *                 enum: [new request, in-progress, completed, cancelled]
 *                 example: in-progress
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order status updated successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 */
router.put('/order-status/:id', updateOrderStatusValidator ,checkAdmin, updateOrderStatus);


router.delete('/orders/:id', checkAdmin, deleteOrder);


/**
 * @swagger
 * /api/order/create-schedule:
 *   post:
 *     tags:
 *       - Order
 *     summary: Create a laundry schedule
 *     description: Allows customers or admins to book a laundry pickup/delivery schedule. No authentication required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - pickUpDate
 *               - pickUpTime
 *               - email
 *               - address
 *               - phoneNumber
 *               - deliveryMode
 *               - paymentMode
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               pickUpDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-01"
 *               pickUpTime:
 *                 type: string
 *                 example: "10:00 AM"
 *               email:
 *                 type: string
 *                 example: jane.doe@example.com
 *               address:
 *                 type: string
 *                 example: 12 Lekki Phase 1, Lagos
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               deliveryMode:
 *                 type: string
 *                 example: delivery
 *               paymentMode:
 *                 type: string
 *                 example: online
 *               item:
 *                 type: string
 *                 example: shirts
 *               specification:
 *                 type: string
 *                 example: dry clean only
 *               quantity:
 *                 type: number
 *                 example: 3
 *               amount:
 *                 type: number
 *                 example: 1500
 *               note:
 *                 type: string
 *                 example: Handle with care
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schedule created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please fill in all required fields
 */
router.post('/create-schedule', createScheduleValidator, scheduleRateLimiter, createSchedule);

/**
 * @swagger
 * /api/order/schedules/completed:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get completed orders without staff assigned
 *     description: Retrieves all completed orders that have not yet been assigned to a staff member for delivery or pickup. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Completed orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Completed Orders retrieved successfully
 *                 requiredSchedules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 787674563782983746578439
 *                       orderId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       address:
 *                         type: string
 *                         example: 12 Lekki Phase 1, Lagos
 *                       deliveryMode:
 *                         type: string
 *                         example: delivery
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T00:00:00.000Z"
 *                       deliveryTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T10:00:00.000Z"
 *                       status:
 *                         type: string
 *                         example: completed
 *                       staffName:
 *                         type: string
 *                         example: Not assigned yet
 */
router.post('/completed-schedule', checkAdmin, getCompletedOrderSchedules)


/**
 * @swagger
 * /api/order/schedules/{id}:
 *   put:
 *     tags:
 *       - Order
 *     summary: Assign staff to a completed order
 *     description: Assigns a staff member to a completed order for delivery or pickup. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Order MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idStaff
 *               - vehicleType
 *               - duty
 *             properties:
 *               idStaff:
 *                 type: string
 *                 description: The generated staff ID (e.g. #SCS-AB1234-42)
 *                 example: "#SCS-AB1234-42"
 *               staffName:
 *                 type: string
 *                 description: Optional override for staff name
 *                 example: James Brown
 *               vehicleType:
 *                 type: string
 *                 example: motorcycle
 *               duty:
 *                 type: string
 *                 example: delivery
 *     responses:
 *       200:
 *         description: Staff assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff assigned successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Order is not completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Only completed orders can be assigned to staff
 *       404:
 *         description: Staff or schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff not found
 */
router.put('/schedules/:id', checkAdmin, assignStaffToSchedule);

module.exports = router;

