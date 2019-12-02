import * as Yup from 'yup';
import { Op } from 'sequelize';
import Students from '../models/Student';

class StudentsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const students = await Students.findAll({
      where: { name: { [Op.like]: `%${req.query.name}%` } },
      limit: 10,
      offset: (page - 1) * 10,
      order: ['name'],
    });

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const studentExists = await Students.findOne({ where: { email } });

    if (studentExists) {
      return res.status(401).json({ error: 'User already exists' });
    }

    const student = await Students.create(req.body);

    const { name, id } = student;

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const student = await Students.findOne({ where: { email } });

    if (!student) {
      return res.status(401).json({ error: 'User not exists' });
    }

    const { id, name, age, weight, height } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const studentExist = await Students.findOne({ where: { id } });

    if (!studentExist) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    await studentExist.destroy();

    return res.send();
  }
}

export default new StudentsController();
