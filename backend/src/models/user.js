const mongoose = require('mongoose');
const validator = require('validator'); // Import the validator package
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value); // Use the isEmail method from the validator package
      },
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: true,
  },

  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(user, ' user')
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('Invalid password');
  }

  return user;
};

 const User= mongoose.model('User', userSchema);
module.exports = User