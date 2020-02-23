import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
  static init(connection) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize: connection,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });
  }
}

export default DeliveryProblem;
