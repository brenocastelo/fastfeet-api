import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryMan from '../models/DeliveryMan';

import Mail from '../../lib/Mail';

class DeliveryProblemController {
  async store(req, res) {
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: {
        id: orderId,
        end_date: null,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const problem = await DeliveryProblem.create({
      order_id: orderId,
      ...req.body,
    });

    return res.json(problem);
  }

  async index(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const problems = await DeliveryProblem.findOne({
      where: {
        order_id: req.params.id,
      },
    });

    return res.json(problems);
  }

  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.id);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const order = await Order.findOne({
      where: {
        id: problem.order_id,
      },
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: {
        model: DeliveryMan,
        as: 'deliveryman',
        attributes: ['id', 'name', 'email'],
      },
    });

    order.canceled_at = new Date();

    await order.save();

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Cancelameto de pedido',
      template: 'order-cancellation',
      context: {
        deliveryman: order.deliveryman.name,
        product: order.product,
      },
    });

    return res.json(order);
  }
}

export default new DeliveryProblemController();
