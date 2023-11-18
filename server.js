const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNGANDLER REJECTION! Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

//console.log(process.env);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on Post ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNGANDLER REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
