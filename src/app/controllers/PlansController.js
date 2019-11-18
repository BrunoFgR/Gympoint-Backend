import Plans from '../models/Plan';

class PlansController {
  async index(req, res) {
    const plans = await Plans.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const planExists = await Plans.findOne({
      where: { duration: req.body.duration },
    });

    if (planExists) {
      return res
        .status(400)
        .json({ error: `The plan already exist: ${planExists.title}` });
    }

    const { id, title, duration, price } = await Plans.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const plan = await Plans.findOne({ where: { id } });

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plans.findOne({ where: { id } });

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    await plan.destroy();

    return res.send();
  }
}

export default new PlansController();
