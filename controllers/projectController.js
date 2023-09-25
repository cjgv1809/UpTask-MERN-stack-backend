import Project from "../models/Project.js";
import User from "../models/User.js";

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { collaborators: { $in: req.user } },
        { creator: { $in: req.user } },
      ],
    }).select("-tasks");
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const newProject = async (req, res) => {
  const { name, description, deliveryDate, client } = req.body;

  try {
    const project = new Project({
      name,
      description,
      deliveryDate,
      client,
      creator: req.user._id,
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id)
    .populate({
      path: "tasks",
      populate: { path: "completed", select: "name email" }, // only return the name and email of the user who completed the task
    })
    .populate("collaborators", "name email"); // only return the name and email of the collaborators

  if (!project) {
    return res.status(404).json({ message: "El proyecto no fue encontrado" });
  }

  // check if the user is the creator of the project
  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    return res.status(401).json({ message: "No autorizado" });
  }

  res.json(project);
};

const updateProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ message: "El proyecto no fue encontrado" });
  }

  // check if the user is the creator of the project
  if (project.creator.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "No autorizado" });
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
  project.client = req.body.client || project.client;

  try {
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ message: "El proyecto no fue encontrado" });
  }

  // check if the user is the creator of the project
  if (project.creator.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    await project.deleteOne();
    res.json({ message: "Proyecto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const searchCollaborator = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "-password -token -confirmed -__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // do not search for the creator of the project
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "El creador del proyecto no puede ser colaborador",
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const addCollaborator = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const project = await Project.findById(id);
  const user = await User.findOne({ email }).select(
    "-password -token -confirmed -__v -createdAt -updatedAt"
  );

  if (!project) {
    return res.status(404).json({ message: "El proyecto no fue encontrado" });
  }

  // check if the user is the creator of the project
  if (project.creator.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Accion no valida para usuario" });
  }

  // check if the user exists
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // check if the user is already a collaborator
  if (project.collaborators.includes(user._id)) {
    return res.status(400).json({ message: "El usuario ya es colaborador" });
  }

  // check if the user is the creator of the project
  if (project.creator.toString() === user._id.toString()) {
    return res
      .status(400)
      .json({ message: "El creador del proyecto no puede ser colaborador" });
  }

  try {
    project.collaborators.push(user._id);
    await project.save();
    res.json({
      message: "El usuario fue agregado como colaborador correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

const deleteCollaborator = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ message: "El proyecto no fue encontrado" });
  }

  // check if the user is the creator of the project
  if (project.creator.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Accion no valida para usuario" });
  }

  try {
    project.collaborators.pull(req.body.id);
    await project.save();
    res.json({
      message: "El usuario fue eliminado como colaborador correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error de servidor" });
  }
};

export {
  getProjects,
  newProject,
  getProject,
  updateProject,
  deleteProject,
  searchCollaborator,
  addCollaborator,
  deleteCollaborator,
};
