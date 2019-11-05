import { eachDayOfInterval, addDays, startOfWeek, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import Checkin from '../models/Checkin';

class CheckinsController {
  async index(req, res) {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User is not an administrator' });
    }

    const student = await Checkin.findAll({
      where: { student_id: req.params.student_id },
    });

    const dayOfWeek = eachDayOfInterval({
      start: startOfWeek(new Date().getTime(), { weekStartsOn: 1 }),
      end: startOfWeek(addDays(new Date().getTime(), 6)),
    });

    const limitCheckin = dayOfWeek
      .map(day => {
        const listDay = format(day, 'yyyy-MM-dd', { locale: pt });

        const checkDate = student.find(s => s.checkin === listDay);

        return checkDate;
      })
      .filter(d => d != null);

    return res.json(limitCheckin);
  }

  async store(req, res) {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User is not an administrator' });
    }

    const student = await Checkin.findAll({
      where: { student_id: req.params.student_id },
    });

    const dayOfWeek = eachDayOfInterval({
      start: startOfWeek(new Date().getTime(), { weekStartsOn: 1 }),
      end: startOfWeek(addDays(new Date().getTime(), 6)),
    });

    const limitCheckin = dayOfWeek
      .map(day => {
        const listDay = format(day, 'yyyy-MM-dd', { locale: pt });

        const checkDate = student.find(s => s.checkin === listDay);

        return checkDate;
      })
      .filter(d => d != null);

    if (limitCheckin.length > 5) {
      return res
        .status(400)
        .json({ error: 'Student has a limit of 5 checkins' });
    }

    const compareDate = format(new Date(), 'yyyy-MM-dd', { locale: pt });

    const checkinDay = student.find(c => c.checkin === compareDate);

    if (checkinDay) {
      return res.status(400).json({ error: 'Student already check in' });
    }

    const createCheckin = await Checkin.create({
      student_id: req.params.student_id,
    });

    return res.json(createCheckin);
  }
}

export default new CheckinsController();
