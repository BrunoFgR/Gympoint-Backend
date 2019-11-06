import Help_Order from '../schemas/Help_Order';

class HelpStudentController {
  async store(req, res) {
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
