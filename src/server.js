const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`Task Tracker API running on http://localhost:${PORT}`);
});
