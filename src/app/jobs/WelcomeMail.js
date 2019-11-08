import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';
import formatPrice from '../../utils/formatPrice';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { student, planExist, end_date, data: Data } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Seja bem-vindo a Gympoint',
      template: 'welcome',
      context: {
        student: student.name,
        plan: planExist.title,
        registration: format(parseISO(end_date), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        price: formatPrice(Data.price),
      },
    });
  }
}

export default new WelcomeMail();
