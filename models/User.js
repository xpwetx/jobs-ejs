const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    require: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid email addres."]
  },
password: {
  type: String,
  required: [true, "Password is required."],
  minlength: [6, "Password must be at least 6 characters."],
},
})

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return; 

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
