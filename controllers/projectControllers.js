import express from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";

const router = express.Router();

export const createProject = async (req, res) => {
  const project = req.body;
  const newProject = new Project(project);
  try {
    await newProject.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.status(201).json(newProject);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ updatedAt: -1 });
  if (!projects?.length) {
    return res.status(400).json({ message: "No projects found" });
  }
  res.json(projects);
});

export const addTask = async (req, res) => {
  console.log(req.body);
  const task = req.body.task;
  const isAdmin = req.body.admin;
  const admin = req.body.username;
  const projectId = req.params.id;

  let newTask = {
    date: Date.now(),
    task: task,
  };
  if (req.body.admin) {
    newTask = {
      date: Date.now(),
      task: task,
      adminTask: true,
      adminName: admin,
    };
  }
  const project = await Project.findOne({ _id: projectId });
  project.tasks.push(newTask);

  project.save((error, project) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error adding task to project");
    } else {
      res.status(201).json(project);

      //   res.status(200).send(`Added task to project ${project?._id}`);
      console.log("task added successfully");
    }
  });
};

export const getEmployeeProjects = async (req, res) => {
  const employee_name = req.params.employeename;
  try {
    console.log(employee_name);
    const projects = await Project.find({ employee: employee_name }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
