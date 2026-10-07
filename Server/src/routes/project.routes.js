const express = require("express");

const auth = require("../middlewares/auth.middleware");

const { createProject,getProjects, getProjectById, updateProject, deleteProject, inviteMember, getProjectMembers, changeMembersRole, removeMember, leaveProject, transferOwnership, getProjectMessages, connectGithubRepository, getGithubRepository, getGithubBranches, getGithubFiles, getGithubFileContent} = require("../controllers/project.controller");

const router = express.Router();

router.post("/", auth, createProject);

router.get("/", auth, getProjects);

router.get("/:projectId/messages", auth, getProjectMessages);

router.post("/:projectId/github", auth, connectGithubRepository);

router.get("/:projectId", auth, getProjectById);

router.patch("/:projectId", auth, updateProject);

router.delete("/:projectId", auth, deleteProject);

router.post("/:projectId/invite", auth, inviteMember)

router.get("/:projectId/members", auth, getProjectMembers);

router.patch("/:projectId/members/:userId", auth, changeMembersRole)

router.delete("/:projectId/members/:userId", auth, removeMember)

router.delete("/:projectId/leave", auth, leaveProject)

router.patch("/:projectId/transfer-owner", auth, transferOwnership)

router.get("/:projectId/github", auth, getGithubRepository);

router.get("/:projectId/github/branches", auth, getGithubBranches);

router.get("/:projectId/github/files", auth, getGithubFiles);

router.get("/:projectId/github/file", auth, getGithubFileContent);

module.exports = router;