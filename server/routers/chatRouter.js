const router = require('express').Router();
const { chatController } = require('../controllers');

router.get('/getMessages', chatController.getMessages);
router.post('/sendMessages', chatController.sendMessage);
router.delete('/clearMessages', chatController.clearMessages);

module.exports = router;
