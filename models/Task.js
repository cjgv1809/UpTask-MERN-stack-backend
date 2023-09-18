import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    deliveryDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    priority: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    completed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
