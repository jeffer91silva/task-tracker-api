const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');

async function register({ name, email, password }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw Object.assign(new Error('Email already registered'), { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, role: 'USER' } });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return { token };
}

module.exports = { register, login };
