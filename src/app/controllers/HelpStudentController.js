import * as Yup from 'yup';
import Help_Order from '../schemas/Help_Order';

class HelpStudentController {
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
        answer: req.body.answer,
        answerAt: new Date().getTime(),
      },
      { new: true }
    );

    return res.json(findOrder);
  }
}

export default new HelpStudentController();
