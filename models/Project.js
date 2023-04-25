import mongoose from "mongoose";
const projectSchema = mongoose.Schema(
  {
    projectName: { type: String },
    projectId: { type: String },
    employee: { type: String },
    tasks: [
      {
        date: { type: Date, default: Date.now },
        task: { type: String },
        adminTask: { type: Boolean, default: false },
        adminName: { type: String, default: "admin" },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

var Project = mongoose.model("Project", projectSchema);

export default Project;
