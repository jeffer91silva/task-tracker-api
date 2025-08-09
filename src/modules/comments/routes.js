const router = require('express').Router();
const auth = require('../../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/:taskId', auth(), async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.taskId }, include: { project: true } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const allowed = req.user.role === 'ADMIN' || task.project.ownerId === req.user.sub || task.assigneeId === req.user.sub;
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
    const c = await prisma.comment.create({ data: { taskId: task.id, authorId: req.user.sub, content: req.body.content } });
    res.status(201).json(c);
  } catch (e) { next(e); }
});

router.get('/:taskId', auth(), async (req, res, next) => {
  try {
    const list = await prisma.comment.findMany({ where: { taskId: req.params.taskId }, orderBy: { createdAt: 'desc' } });
    res.json(list);
  } catch (e) { next(e); }
});

module.exports = router;
