const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: true, // Remove required
  },
  lastName: {
    type: String,
    // required: true, // Remove required
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true, // Remove required
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    // required: true, // Remove required
  },
  admin: {
    type: Boolean,
    default: false,
  },
  favorites: {
    type: Array,
    default: null,
  },
  googleId: String,
  name: String,
}, { versionKey: false });

UserSchema.pre("save", function (next) {
  const user = this;

  if (user.password) {
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError);
        } else {
          bcrypt.hash(user.password, salt, function (hashError, hash) {
            if (hashError) {
              return next(hashError);
            }

            user.password = hash;
            next();
          });
        }
      });
    } else {
      return next();
    }
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;