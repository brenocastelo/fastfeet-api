import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';

import Mail from '../../lib/Mail';

class OrderController {
  async store(req, res) {
    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    const deliveryman = await DeliveryMan.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    const order = await Order.create(req.body);

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Cadastro de encomenda',
      text: `Você foi alocado para realizar a entraga de encomenda de ID ${order.id}`,
    });

    return res.json(order);
  }

  async index(req, res) {
    const order = await Order.findAll({
      attributes: [
        'id',
        'product',
        'recipient_id',
        'deliveryman_id',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'person_id'],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(order);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'The recipient was not found.' });
    }

    const deliveryman = await DeliveryMan.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'The deliveryman was not found' });
    }

    const { id, product } = await order.update(req.body);

    return res.json({ id, product, recipient_id, deliveryman_id });
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'person_id'],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: 'Order was not found' });
    }

    order.canceled_at = new Date();
    await order.save();

    return res.json(order);
  }
}

export default new OrderController();
