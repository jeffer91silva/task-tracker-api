const router = require('express').Router();
const auth = require('../../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', auth(), async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.create({ data: { name, description, ownerId: req.user.sub } });
    res.status(201).json(project);
  } catch (e) { next(e); }
});

router.get('/', auth(), async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { ownerId: req.user.sub };
    const list = await prisma.project.findMany({ where });
    res.json(list);
  } catch (e) { next(e); }
});

router.put('/:id', auth(), async (req, res, next) => {
  try {
    const p = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'ADMIN' && p.ownerId !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });
    const project = await prisma.project.update({ where: { id: p.id }, data: req.body });
    res.json(project);
  } catch (e) { next(e); }
});

router.delete('/:id', auth(), async (req, res, next) => {
  try {
    const p = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'ADMIN' && p.ownerId !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });
    await prisma.project.delete({ where: { id: p.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
