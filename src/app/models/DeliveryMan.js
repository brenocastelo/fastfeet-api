import Sequelize, { Model } from 'sequelize';

class DeliveryMan extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize: connection,
        tableName: 'delivery_men',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default DeliveryMan;
