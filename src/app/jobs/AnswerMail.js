import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student, findOrder } = data;

    await Mail.sendMail({
      to: `${student.name}<${student.email}>`,
      subject: 'Resposta Gympoint',
      template: 'answer',
      context: {
        student: student.name,
        question: findOrder.question,
        answer: findOrder.answer,
      },
    });
  }
}

export default new AnswerMail();
