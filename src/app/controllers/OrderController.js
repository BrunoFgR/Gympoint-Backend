import Order from '../schemas/Help_Order';
import Student from '../models/Student';

class OrderController {
  async index(_, res) {
    const helpOrder = await Order.find({ answered: false }).limit(20);

    return res.json(helpOrder);
  }

  async store(req, res) {
    const studentExist = await Student.findByPk(req.params.student_id);

    if (!studentExist) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const { student_id } = req.params;
    const { question } = req.body;

    const newQuestion = await Order.create({
      student_id,
      question,
    });

    return res.json(newQuestion);
  }
}

export default new OrderController();
