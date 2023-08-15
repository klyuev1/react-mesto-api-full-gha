// Подгружаем код
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login, logOut } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const InternalServerError = require('./errors/InternalServerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Создаем сервер, подключаемся к БД
const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cors({ origin: ['http://localhost:3000', 'https://klyuev-mesto.nomoreparties.co'], credentials: true })); // 1час, 1.40 как запушить изменения в бэке

// Создаем роуты
app.use(cookies());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,}\/?([^\s]*)$/),
  }),
}), createUser);

app.get('/logout', logOut);

app.use(auth, require('./routes/users'));
app.use(auth, require('./routes/cards'));

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// Запускаем порт
app.use(errorLogger);
app.use(errors());
app.use(InternalServerError);
app.listen(PORT, () => {
  console.log(`Server pushed on port ${PORT}`);
});
