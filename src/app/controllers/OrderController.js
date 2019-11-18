import Help_Order from '../models/Help_Order';
import Registration from '../models/Registration';

class OrderController {
  async index(_, res) {
    const helpOrder = await Help_Order.findAll({ where: { answer: null } });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const registrationExist = await Registration.findOne({
      where: { student_id: req.params.student_id },
    });

    if (!registrationExist) {
      return res
        .status(400)
        .json({ error: 'Student does not have enrollment' });
    }

    const { student_id } = req.params;
    const { question } = req.body;

    const newQuestion = await Help_Order.create({
      student_id,
      question,
      answer: null,
      answer_at: null,
    });

    return res.json(newQuestion);
  }
}

export default new OrderController();
