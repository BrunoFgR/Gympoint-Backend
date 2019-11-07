import { eachDayOfInterval, addDays, startOfWeek } from 'date-fns';
import formatDate from '../../utils/formatDate';

import Checkin from '../models/Checkin';
import Registration from '../models/Registration';

class CheckinsController {
  async index(req, res) {
    const student = await Checkin.findAll({
      where: { student_id: req.params.student_id },
    });

    const dayOfWeek = eachDayOfInterval({
      start: startOfWeek(new Date().getTime(), { weekStartsOn: 1 }),
      end: startOfWeek(addDays(new Date().getTime(), 6)),
    });

    const limitCheckin = dayOfWeek
      .map(day => {
        const listDay = formatDate(day);

        const checkDate = student.find(
          s => formatDate(s.createdAt) === listDay
        );

        return checkDate;
      })
      .filter(d => d != null);

    return res.json(limitCheckin);
  }

  async store(req, res) {
    const RegistrationExists = await Registration.findOne({
      where: { student_id: req.params.student_id },
    });

    if (!RegistrationExists) {
      return res.status(400).json({ error: 'student did not enroll' });
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
        const listDay = formatDate(day);

        const checkDate = student.find(
          s => formatDate(s.createdAt) === listDay
        );

        return checkDate;
      })
      .filter(d => d != null);

    if (limitCheckin.length === 5) {
      return res
        .status(400)
        .json({ error: 'Student has a limit of 5 checkins' });
    }

    const compareDate = formatDate(new Date());

    const checkinDay = student.find(
      c => formatDate(c.createdAt) === compareDate
    );

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
