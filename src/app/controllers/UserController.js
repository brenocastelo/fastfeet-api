import User from '../models/User';

class UserControler {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, is_admin } = await User.create(req.body);

    return res.status(201).json({ id, name, email, is_admin });
  }
}

export default new UserControler();
