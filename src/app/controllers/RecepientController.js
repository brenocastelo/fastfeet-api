import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      person_id: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      neighborhood: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail.' });
    }

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
    const schema = Yup.object().shape({
      name: Yup.string(),
      person_id: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      neighborhood: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail.' });
    }

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
