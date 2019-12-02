import { addMonths, parseISO } from 'date-fns';

import * as Yup from 'yup';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import WelcomeMail from '../jobs/WelcomeMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
        'active',
      ],
      order: ['id'],
      limit: 10,
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const planExist = await Plan.findByPk(plan_id);

    if (!planExist) {
      return res.status(400).json({ error: 'Plan not already exist' });
    }

    const registrationExists = await Registration.findOne({
      where: { student_id },
    });

    if (registrationExists) {
      return res
        .status(400)
        .json({ error: 'The student has already been enrolled' });
    }

    const { price, duration } = planExist;

    const end_date = addMonths(parseISO(start_date), duration);

    const data = { ...req.body, end_date, price: price * duration };

    const registration = await Registration.create(data);

    const { id } = registration;

    const student = await Student.findByPk(student_id);

    await Queue.add(WelcomeMail.key, {
      student,
      planExist,
      data,
      end_date,
    });

    return res.json({ ...data, id });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;

    const planExist = await Plan.findByPk(req.body.plan_id);

    if (!planExist) {
      return res.status(400).json({ error: 'Plan not already exist' });
    }

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(401).json({ error: 'Registration does not exists' });
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
    const RegistrationExist = await Registration.findByPk(req.params.id);

    if (!RegistrationExist) {
      return res.status(401).json({ error: 'Registration not already exists' });
    }

    await RegistrationExist.destroy();

    return res.send();
  }
}

export default new RegistrationController();
