const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');
const errorHandler = require('./middlewares/error');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', require('./modules/auth/routes'));
app.use('/users', require('./modules/users/routes'));
app.use('/projects', require('./modules/projects/routes'));
app.use('/tasks', require('./modules/tasks/routes'));
app.use('/comments', require('./modules/comments/routes'));

app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use(errorHandler);

module.exports = app;
