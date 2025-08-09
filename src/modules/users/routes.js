const router = require('express').Router();
const auth = require('../../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/me', auth(), async (req, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.user.sub }, select: { id: true, name: true, email: true, role: true } });
  res.json(me);
});

module.exports = router;
