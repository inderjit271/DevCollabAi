const mongoose = require('mongoose')
const Project = require("../models/project.model");
const User = require("../models/user.model")

const createProject = async (req, res) => {
  try {

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: [
        {
          user : req.user._id,
          role : "owner"
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: "Project Created Successfully",
      project,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProjects = async (req, res) => {
  try {

    const projects = await Project.find({
      "members.user": req.user.id,
    }).populate("owner", "name email");

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if projectId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }

    // Find project and ensure the user is a member
    const project = await Project.findOne({
      _id: projectId,
      "members.user": req.user._id,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;

    // Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }

    // Find Project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only owner can update
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this project.",
      });
    }

    // Update only provided fields
    if (title) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }

    // Find Project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project.",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    // Find project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only owner can invite
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only owner can invite members",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already a member
    const isMember = project.members.find(
      (member) => member.user._id.toString() === user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member",
      });
    }

    // Add member
    project.members.push({
      user: user._id,
      role: "member",
    });

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      project,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProjectMembers = async (req, res) => {
    try {

        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate("members.user", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Only members can view members list
        const isMember = project.members.find(
            member => member.user._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        return res.status(200).json({
            success: true,
            members: project.members,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

const changeMembersRole = async (req,res) => {
 
try{
const {projectId,userId} = req.params;
const {role} = req.body;

const project = await Project.findById(projectId);
 if(!project) {
  return res.status(404).json({
    success: false,
    message: "project do not exist"
  })
 }

 if(project.owner.toString() !== req.user._id.toString()) {
  return res.status(403).json({
    success: false,
    message: "you are not authorized to change role"
  })
 }

 const isMember = project.members.find(
  member => member.user.toString() === userId
 );

 if (isMember.role === role) {
    return res.status(400).json({
        success: false,
        message: "Member already has this role"
    });
}

 if(!isMember) {
  return res.status(404).json({
    success: false,
    message: "Member not found"
  })
 }
 const roles = ["admin", "member"]

 if(!roles.includes(role)) {
 return res.status(400).json({
  success: false,
  message:"Invalid role"
 })
 }
 if(isMember.role === "owner") {
  return res.status(400).json({
    success: false,
    message:"owner can't be change"
  })
 }
 isMember.role = role;
 
 await project.save()
 
 return res.status(200).json({
  success: true,
  message:"role updated successfully",
  members: project.members
  });

} catch(error) {
  console.log(error)

  return res.status(500).json({
    success: false,
    message: "Internal Server Error"
  })
}
};

const removeMember = async (req,res) => {
  try{
    const {projectId,userId} = req.params
    
    const project = await Project.findById(projectId);
 if(!project) {
  return res.status(404).json({
    success: false,
    message: "project do not exist"
  })
 }
 
 if(project.owner.toString() !== req.user._id.toString()) {
  return res.status(403).json({
    success: false,
    message: "only owner can remove member"
  })
 }
const memberIndex = project.members.findIndex(
  (member) => member.user.toString() === userId
);
if (memberIndex === -1) {
    return res.status(404).json({
        success: false,
        message: "Member not found",
    });
}
const member = project.members[memberIndex];
 if(member.role === "owner") {
  return res.status(400).json({
    success:false,
    message:"Owner can't be removed"
  })
 }

 project.members.splice(memberIndex,1);
 await project.save()
 return res.status(200).json({
  success:true,
  message:"Member removed successfully",
  members:project.members
 })
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message:"Internal Server Error"
    })
  }
};

const leaveProject = async (req,res) => {
  try{
    const {projectId} = req.params;
     const project = await Project.findById(projectId);
 if(!project) {
  return res.status(404).json({
    success: false,
    message: "Project Not Found"
  })
 }
const memberIndex = project.members.findIndex(
  (member) => member.user.toString() === req.user._id.toString()
);
if (memberIndex === -1) {
    return res.status(404).json({
        success: false,
        message: "User is not a member",
    });
}
const member = project.members[memberIndex];
if(member.role === "owner") {
  return res.status(400).json({
    success:false,
    message:"Owner can't leave project must transfer ownership first"
  })
 }
 project.members.splice(memberIndex,1);
 await project.save()
 return res.status(200).json({
  success:true,
  message:"You left the project successfully",
  members:project.members
 })
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

const transferOwnership = async (req,res) => {
try {
const {projectId} = req.params;
const {userId} = req.body;
 const project = await Project.findById(projectId);
 if(!project) {
  return res.status(404).json({
    success: false,
    message: "Project Not Found"
  })
 }
 if (!userId) {
    return res.status(400).json({
        success: false,
        message: "User ID is required"
    });
}
 const currOwner = project.members.find(
  member => member.user.toString() === req.user._id.toString()
 );
  if(!currOwner) {
    return res.status(404).json({
      success:false,
      message:"log in User is not a member"
    })
  }
if(currOwner.role !== "owner") {
  return res.status(403).json({
   success:false,
   message:"Only owner can transfer ownership"
  })
}
 const member = project.members.find(
  member => member.user.toString() === userId
 )
if(!member) {
    return res.status(404).json({
      success:false,
      message:"member not found"
    })
  }
  if(member.role === "owner") {
    return res.status(400).json({
      success:false,
      message:"User is already the owner"
    })
  }
  currOwner.role = "admin";
  member.role = "owner";
  project.owner = userId;
  await project.save()
  return res.status(200).json({
    success:true,
    message:"ownership transferred successfully"
  })
}catch(err) {
  console.log(err);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
  })
}
}
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  inviteMember,
  getProjectMembers,
  changeMembersRole,
  removeMember,
  leaveProject,
  transferOwnership
};
