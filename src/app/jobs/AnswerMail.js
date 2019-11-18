import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student, answerHelp } = data;

    await Mail.sendMail({
      to: `${student.name}<${student.email}>`,
      subject: 'Resposta Gympoint',
      template: 'answer',
      context: {
        student: student.name,
        question: answerHelp.question,
        answer: answerHelp.answer,
      },
    });
  }
}

export default new AnswerMail();
