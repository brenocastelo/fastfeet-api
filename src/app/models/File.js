import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(connection) {
    super.init(
      {
        original_name: Sequelize.STRING,
        file_name: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.file_name}`;
          },
        },
      },
      {
        sequelize: connection,
      }
    );

    return this;
  }
}

export default File;
