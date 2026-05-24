const router = require('express').Router()
const { createCustomer, getAllCustomers, getOneCustomer, updateCustomer, deleteCustomer } = require('../controller/customerController');

const { checkAdmin } = require('../middleware/validation');

router.post('/register', checkAdmin, createCustomer);
router.get('/customers', checkAdmin, getAllCustomers);
router.get('/customers/:id', checkAdmin, getOneCustomer);
router.put('/customers/:id', checkAdmin, updateCustomer);
router.delete('/customers/:id', checkAdmin, deleteCustomer);

module.exports = router;