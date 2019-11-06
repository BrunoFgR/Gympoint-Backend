import Sequelize, { Model } from 'sequelize';

import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
  }
}

export default Checkin;
