const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const order = new Order({
      userId: req.userId,
      items,
      totalAmount,
      shippingAddress
    });
    await order.save();
    res.status(201).json({ message: 'Commande créée', order });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: 'Commande mise à jour', order });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    // Can only cancel pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: 'Cette commande ne peut pas être annulée' });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Commande annulée', order });
  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
};
