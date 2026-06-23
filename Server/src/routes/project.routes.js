const express = require("express");

const auth = require("../middlewares/auth.middleware");

const { createProject,getProjects, getProjectById, updateProject, deleteProject, inviteMember, getProjectMembers, changeMembersRole, removeMember, leaveProject, transferOwnership} = require("../controllers/project.controller");

const router = express.Router();

router.post("/", auth, createProject);

router.get("/", auth, getProjects);

router.get("/:projectId", auth, getProjectById);

router.patch("/:projectId", auth, updateProject);

router.delete("/:projectId", auth, deleteProject);

router.post("/:projectId/invite", auth, inviteMember)

router.get("/:projectId/members", auth, getProjectMembers);

router.patch("/:projectId/members/:userId", auth, changeMembersRole)

router.delete("/:projectId/members/:userId", auth, removeMember)

router.delete("/:projectId/leave", auth, leaveProject)

router.patch("/:projectId/transfer-owner", auth, transferOwnership)

module.exports = router;