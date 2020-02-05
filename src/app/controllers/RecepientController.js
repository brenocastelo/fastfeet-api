import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const recipientExists = await Recipient.findOne({
      where: { person_id: req.body.person_id },
    });

    if (recipientExists) {
      return res.status(401).json({ error: 'Recipient already exists.' });
    }

    const recipient = await Recipient.create(req.body);

    return res.status(201).json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;
    const { person_id } = req.body;

    const recipient = await Recipient.findByPk(id);

    if (person_id && person_id !== recipient.person_id) {
      const recipientExists = await Recipient.findOne({ where: { person_id } });

      if (recipientExists) {
        return res.status(401).json({ error: 'Person ID already exists.' });
      }
    }

    const { name } = await recipient.update(req.body);

    return res.json({ id, name, person_id });
  }
}

export default new RecipientController();
