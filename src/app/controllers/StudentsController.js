import Students from '../models/Students';
import User from '../models/User';

class StudentsController {
  async store(req, res) {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User is not an administrator' });
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
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User is not an administrator' });
    }

    const { email } = req.body;

    const student = await Students.findOne({ where: { email } });

    if (!student) {
      return res.status(401).json({ error: 'User not exists' });
    }

    const { name, age, weight, height } = await student.update(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentsController();
