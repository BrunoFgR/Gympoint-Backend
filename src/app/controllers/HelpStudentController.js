import * as Yup from 'yup';
import Help_Order from '../schemas/Help_Order';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

class HelpStudentController {
  async index(req, res) {
    const help_orders = await Help_Order.find({
      student_id: req.params.id,
    }).limit(20);

    return res.json(help_orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const findOrder = await Help_Order.findOneAndUpdate(
      { _id: req.params.id },
      {
        answered: true,
        answer: req.body.answer,
        answerAt: new Date().getTime(),
      },
      { new: true }
    );

    const student = await Student.findByPk(findOrder.student_id);

    await Mail.sendMail({
      to: `${student.name}<${student.email}>`,
      subject: 'Resposta da acadêmia',
      text: 'Resposta da acadêmia',
    });

    return res.json(findOrder);
  }
}

export default new HelpStudentController();
