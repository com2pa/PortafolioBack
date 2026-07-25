import * as projectService from '../services/project.service.js'
import { asyncHandler } from '../utils/helpers.js'

export const getProjects = asyncHandler(async (_req, res) => {
  const projects = await projectService.listProjects()
  res.json(projects)
})

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id)
  res.json(project)
})

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.files || [])
  res.status(201).json(project)
})

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.body,
    req.files || [],
  )
  res.json(project)
})

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await projectService.removeProject(req.params.id)
  res.json({ message: 'Proyecto eliminado.', id: project._id })
})
