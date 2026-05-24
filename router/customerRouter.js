const router = require('express').Router()
const { createCustomer, getAllCustomers, getOneCustomer, updateCustomer, deleteCustomer } = require('../controller/customerController');

const { checkAdmin } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer management (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The Customer MongoDB ID
 *           example: 787674563782983746578439
 *         customerId:
 *           type: string
 *           description: The generated Customer ID
 *           example: "#SCC-AB1234-42"
 *         adminId:
 *           type: string
 *           description: The ID of the admin who created the customer
 *           example: 787674563782983746578439
 *         firstName:
 *           type: string
 *           description: Customer first name
 *           example: Jane
 *         lastName:
 *           type: string
 *           description: Customer last name
 *           example: Doe
 *         address:
 *           type: string
 *           description: Customer address
 *           example: 12 Lekki Phase 1, Lagos
 *         email:
 *           type: string
 *           description: Customer email
 *           example: jane.doe@example.com
 *         phoneNumber:
 *           type: string
 *           description: Customer phone number
 *           example: +2348029837465
 *         pickUpTime:
 *           type: string
 *           description: Customer preferred pick-up time
 *           example: "10:00 AM"
 */

/**
 * @swagger
 * /api/v1/customer/register:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Create a new customer
 *     description: Admin creates a new customer record. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - address
 *               - phoneNumber
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               address:
 *                 type: string
 *                 example: 12 Lekki Phase 1, Lagos
 *               email:
 *                 type: string
 *                 example: jane.doe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer created successfully
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Customer already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer already exist
 */
router.post('/register', checkAdmin, createCustomer);

/**
 * @swagger
 * /api/v1/customer/customers:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get all customers
 *     description: Retrieves a list of all customers. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customers retrieved successfully
 *                 customers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 */
router.get('/customers', checkAdmin, getAllCustomers);

/**
 * @swagger
 * /api/v1/customer/customers/{id}:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get a single customer
 *     description: Retrieves a customer by their MongoDB ID. Requires admin authentication.
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
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer retrieved successfully
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer not found
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update a customer
 *     description: Updates a customer's details by MongoDB ID. Requires admin authentication.
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
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               address:
 *                 type: string
 *                 example: 12 Lekki Phase 1, Lagos
 *               email:
 *                 type: string
 *                 example: jane.doe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               pickUpTime:
 *                 type: string
 *                 example: "10:00 AM"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer updated successfully
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer not found
 *   delete:
 *     tags:
 *       - Customer
 *     summary: Delete a customer
 *     description: Deletes a customer record by MongoDB ID. Requires admin authentication.
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
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer deleted successfully
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer not found
 */
router.get('/customers/:id', checkAdmin, getOneCustomer);
router.put('/customers/:id', checkAdmin, updateCustomer);
router.delete('/customers/:id', checkAdmin, deleteCustomer);


module.exports = router;

