const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, getOrdersByUserId, getOrdersByStatus, addOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const csrfProtection = require('csurf')({ cookie: true });

router.route('/').get(getAllOrders);
router.route('/:id').get(getOrderById);
router.route('/user/:id').get(getOrdersByUserId);
router.route('/status/:status').get(getOrdersByStatus);
router.route('/').post(csrfProtection, addOrder);
router.route('/:id').put(updateOrder);
router.route('/:id').delete(deleteOrder);

module.exports = router;




