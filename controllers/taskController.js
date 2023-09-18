import Task from "../models/Task.js";
import Project from "../models/Project.js";

const addTask = async (req, res) => {
  const { project } = req.body;

  // check if the project exists
  const projectExists = await Project.findById(project);

  if (!projectExists) {
    return res.status(404).json({ message: "El proyecto no fue encontrado" });
  }

  // check if the user is the creator of the project
  if (projectExists.creator.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const task = await Task.create(req.body);
    // add the new task to the project
    projectExists.tasks.push(task._id);
    // save the project
    await projectExists.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;

  // check if the task exists and populate the project field with the project data
  const task = await Task.findById(id).populate("project");

  if (!task) {
    return res.status(404).json({ message: "La tarea no fue encontrada" });
  }

  // check if the user is the creator of the project
  if (task.project.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Acción no valida para usuario" });
  }

  res.json(task);
};

const updateTask = async (req, res) => {
  const { id } = req.params;

  // check if the task exists and populate the project field with the project data
  const task = await Task.findById(id).populate("project");

  if (!task) {
    return res.status(404).json({ message: "La tarea no fue encontrada" });
  }

  // check if the user is the creator of the project
  if (task.project.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Acción no valida para usuario" });
  }

  // update the task data with the new data from the request body (if there is any) and save it
  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.deliveryDate = req.body.deliveryDate || task.deliveryDate;

  try {
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  // check if the task exists and populate the project field with the project data
  const task = await Task.findById(id).populate("project");

  if (!task) {
    return res.status(404).json({ message: "La tarea no fue encontrada" });
  }

  // check if the user is the creator of the project
  if (task.project.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Acción no valida para usuario" });
  }

  try {
    const project = await Project.findById(task.project);
    // remove the task from the project
    project.tasks.pull(task._id);
    // save the project and delete the task (in parallel)
    await Promise.allSettled([await project.save(), await task.deleteOne()]);
    res.json({ message: "La tarea fue eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const changeTaskStatus = async (req, res) => {
  const { id } = req.params;

  // check if the task exists and populate the project field with the project data
  const task = await Task.findById(id).populate("project");

  if (!task) {
    return res.status(404).json({ message: "La tarea no fue encontrada" });
  }

  // check if the user is the creator of the project
  if (
    task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    return res.status(403).json({ message: "Acción no valida para usuario" });
  }

  // update the task status with the new status
  task.status = !task.status;
  task.completed = req.user._id;

  try {
    await task.save();
    const savedTask = await Task.findById(id)
      .populate("project")
      .populate("completed");
    res.json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

export { addTask, getTask, updateTask, deleteTask, changeTaskStatus };
