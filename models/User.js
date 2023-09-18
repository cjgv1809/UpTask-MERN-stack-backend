import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// middleware to hash password
userSchema.pre("save", async function (next) {
  // if the password has not been modified, continue
  if (!this.isModified("password")) {
    next();
  }

  // generate salt
  const salt = await bcrypt.genSalt(10);

  // hash the password
  const hash = await bcrypt.hash(this.password, salt);

  // reassign the password
  this.password = hash;

  next();
});

// method to compare passwords
userSchema.methods.matchPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

// define the User model with the userSchema
const User = mongoose.model("User", userSchema);

export default User;
