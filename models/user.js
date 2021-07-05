const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line camelcase
const regex_link = /https?:\/\/[\w{1,s}\W{1,s}]#?/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { validator: (val) => regex_link.test(val) },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: validator.isEmail },
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
