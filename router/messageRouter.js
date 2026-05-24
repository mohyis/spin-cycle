const router = require('express').Router();
const { createMessage, getAllMessages, getOneMessage, deleteMessage } = require('../controller/messageController');
const { checkAdmin } = require('../middleware/validation');

router.post('/message', createMessage);
router.get('/messages', checkAdmin, getAllMessages);
router.get('/messages/:id', checkAdmin, getOneMessage);
router.delete('/messages/:id', checkAdmin, deleteMessage);

module.exports = router;