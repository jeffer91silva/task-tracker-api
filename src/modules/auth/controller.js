const service = require('./service');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await service.register({ name, email, password });
    res.status(201).json(user);
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const out = await service.login({ email, password });
    res.json(out);
  } catch (e) { next(e); }
};
