const router = require('express').Router();
const auth = require('../../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', auth(), async (req, res, next) => {
  try {
    const { projectId, title, description, assigneeId, dueDate } = req.body;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (req.user.role !== 'ADMIN' && project.ownerId !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });
    const task = await prisma.task.create({ data: { projectId, title, description, assigneeId, dueDate: dueDate ? new Date(dueDate) : null } });
    res.status(201).json(task);
  } catch (e) { next(e); }
});

router.get('/', auth(), async (req, res, next) => {
  try {
    const { status, assigneeId, projectId, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (projectId) where.projectId = projectId;
    const take = Math.min(parseInt(limit), 100);
    const skip = (parseInt(page) - 1) * take;
    const items = await prisma.task.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } });
    const total = await prisma.task.count({ where });
    res.json({ items, total, page: parseInt(page), limit: take });
  } catch (e) { next(e); }
});

router.put('/:id', auth(), async (req, res, next) => {
  try {
    const t = await prisma.task.findUnique({ where: { id: req.params.id }, include: { project: true } });
    if (!t) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'ADMIN' && t.project.ownerId !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });
    const upd = await prisma.task.update({ where: { id: t.id }, data: req.body });
    res.json(upd);
  } catch (e) { next(e); }
});

router.delete('/:id', auth(), async (req, res, next) => {
  try {
    const t = await prisma.task.findUnique({ where: { id: req.params.id }, include: { project: true } });
    if (!t) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'ADMIN' && t.project.ownerId !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });
    await prisma.task.delete({ where: { id: t.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
