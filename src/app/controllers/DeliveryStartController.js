import { Op } from 'sequelize';
import {
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  parseISO,
  setHours,
  setMinutes,
} from 'date-fns';

import DeliveryMan from '../models/DeliveryMan';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

const START_WORK = setMinutes(setHours(new Date(), '08'), '00');
const END_WORK = setMinutes(setHours(new Date(), '18'), '00');

class DeliveryStartController {
  async index(req, res) {
    const deliveryman = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found.' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
        },
      ],
    });

    return res.json(orders);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const date = parseISO(req.body.start_date);

    if (isAfter(date, new Date())) {
      return res.status(400).json({ error: "You can't set a future date" });
    }

    const { deliveryman_id } = req.body;

    const deliverymanCheckins = await Order.findAndCountAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [
            startOfDay(new Date().getTime()),
            endOfDay(new Date().getTime()),
          ],
        },
        end_date: null,
        canceled_at: null,
      },
    });

    if (deliverymanCheckins.count >= 5) {
      return res
        .status(400)
        .json({ error: 'you can only check in a maximum of 5 times a day' });
    }

    if (isBefore(date, START_WORK) || isAfter(date, END_WORK)) {
      return res.status(400).json({ error: 'Outside working hours.' });
    }

    order.start_date = date;
    await order.save();

    return res.json(order);
  }
}

export default new DeliveryStartController();
