import { Op } from 'sequelize';
import { isAfter, parseISO } from 'date-fns';

import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryEndController {
  async index(req, res) {
    const deliveryman = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ eror: 'Deliveryman not found.' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: {
          [Op.ne]: null,
        },
      },
      include: [
        { model: Recipient, as: 'recipient' },
        { model: File, as: 'signature' },
      ],
    });

    return res.json(orders);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (order.end_date) {
      return res
        .status(400)
        .json({ error: 'This order already was delivered' });
    }

    const date = parseISO(req.body.end_date);

    if (isAfter(date, new Date())) {
      return res.status(400).json({ error: "You can't set a future date" });
    }

    const { signature_id } = req.body;

    if (!signature_id) {
      return res
        .status(400)
        .json({ error: "You must send a image with recipient's signature" });
    }

    const newOrder = await order.update(req.body);

    return res.json(newOrder);
  }
}

export default new DeliveryEndController();
