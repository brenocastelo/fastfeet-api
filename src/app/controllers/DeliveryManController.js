import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async store(req, res) {
    const deliveryMan = await DeliveryMan.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (deliveryMan) {
      return res.status(400).json({ error: 'Delivery man already exists' });
    }

    const { id, name, email } = await DeliveryMan.create(req.body);

    return res.json({ id, name, email });
  }

  async index(req, res) {
    const deliveryMen = await DeliveryMan.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['original_name', 'file_name', 'url'],
        },
      ],
    });

    return res.json(deliveryMen);
  }

  async update(req, res) {
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    const { email } = req.body;

    if (!deliveryMan) {
      return res.status(404).json({ error: 'Delivery man not found.' });
    }

    if (email && email !== deliveryMan.email) {
      const deliveryManExists = await DeliveryMan.findOne({
        where: { email },
      });

      if (deliveryManExists) {
        return res.status(400).json({ error: 'This email already exists.' });
      }
    }
    const { id, name } = await deliveryMan.update(req.body);

    return res.json({ id, name, email });
  }

  async destroy(req, res) {
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryMan) {
      return res.status(404).json({ error: 'Delivery man not found.' });
    }

    await deliveryMan.destroy();

    return res.json({ message: 'Delivery man deleted.' });
  }
}

export default new DeliveryManController();
