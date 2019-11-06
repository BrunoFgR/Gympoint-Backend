import Order from '../schemas/Help_Order';
import Student from '../models/Student';

class OrderController {
  async index(req, res) {
    const helpOrder = await Order.find().limit(20);

    const noAnswered = helpOrder.filter(o => o.answered === false);

    return res.json(noAnswered);
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
