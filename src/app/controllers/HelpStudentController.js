import * as Yup from 'yup';
import Help_Order from '../models/Help_Order';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class HelpStudentController {
  async index(req, res) {
    const help_orders = await Help_Order.findAll({
      where: { student_id: req.params.id },
      limit: 20,
    });

    return res.json(help_orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const findOrder = await Help_Order.findOne({
      where: { id: req.params.id },
    });

    const answerHelp = await findOrder.update({
      ...findOrder,
      answer: req.body.answer,
      answer_at: new Date().getTime(),
    });

    const student = await Student.findByPk(findOrder.student_id);

    await Queue.add(AnswerMail.key, {
      student,
      answerHelp,
    });

    return res.json(answerHelp);
  }
}

export default new HelpStudentController();
