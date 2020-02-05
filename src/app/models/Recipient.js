import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        person_id: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zip_code: Sequelize.STRING,
      },
      {
        sequelize: connection,
      }
    );

    return this;
  }
}

export default Recipient;
