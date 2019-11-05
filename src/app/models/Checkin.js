import Sequelize, { Model } from 'sequelize';

import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {
        checkin: {
          type: Sequelize.VIRTUAL,
          get() {
            return format(new Date(), 'yyyy-MM-dd', { locale: pt });
          },
        },
      },
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
