import { addMonths, parseISO } from 'date-fns';
import * as Yup from 'yup';

import Registration from '../models/Registration';
import User from '../models/User';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Mail from '../../lib/Mail';

class RegistrationController {
  async index(req, res) {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User is not an administrator' });
    }

    const registrations = await Registration.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
      ],
      order: ['id'],
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User is not an administrator' });
    }

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const registrationExists = await Registration.findOne({
      where: { student_id },
    });

    if (registrationExists) {
      return res
        .status(400)
        .json({ error: 'The student has already been enrolled' });
    }

    const planExist = await Plan.findByPk(plan_id);

    if (!planExist) {
      return res.status(400).json({ error: 'Plan not already exist' });
    }

    const { price, duration } = planExist;

    const end_date = addMonths(parseISO(start_date), duration);

    const data = { ...req.body, end_date, price: price * duration };

    await Registration.create(data);

    const student = await Student.findByPk(student_id);

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Seja bem-vindo a Gympoint',
      text: 'Email de boas vindas',
    });

    return res.json(data);
  }

  async update(req, res) {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User is not an administrator' });
    }

    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(401).json({ error: 'Registration does not exists' });
    }

    const planExist = await Plan.findByPk(req.body.plan_id);

    if (!planExist) {
      return res.status(400).json({ error: 'Plan not already exist' });
    }

    const { price, duration } = planExist;

    const { student_id, start_date, end_date } = registration;

    const data = {
      id,
      student_id,
      start_date,
      end_date,
      price: price * duration,
    };

    const teste = await registration.update(data);

    return res.json(teste);
  }

  async delete(req, res) {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User is not an administrator' });
    }

    const RegistrationExist = await Registration.findByPk(req.params.id);

    if (!RegistrationExist) {
      return res.status(401).json({ error: 'Registration not already exists' });
    }

    await RegistrationExist.destroy();

    return res.send();
  }
}

export default new RegistrationController();
