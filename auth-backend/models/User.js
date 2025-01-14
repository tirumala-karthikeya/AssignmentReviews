const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User schema definition
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      validate: {
        validator: function(value) {
          // Password must contain at least one letter and one number
          return /[a-zA-Z]/.test(value) && /\d/.test(value);
        },
        message: 'Password must contain both letters and numbers'
      }
    },
    role: { type: String, enum: ['User', 'Admin'], default: 'User' }, // You can define roles
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Middleware to hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If password hasn't changed, no need to hash
  this.password = await bcrypt.hash(this.password, 10); // Hash password with bcrypt
  next();
});

// Method to compare passwords (useful for login)
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare entered password with the hashed one
};

module.exports = mongoose.model('User', UserSchema);
