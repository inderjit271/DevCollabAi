import api from "./api";

export const getProjects = async () => {
    const response = await api.get("/project");
    return response.data;
};

export const getProjectById = async (projectId) => {
    const response = await api.get(`/project/${projectId}`);
    return response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post("/project", projectData);
    return response.data;
};

export const updateProject = async (projectId, projectData) => {
    const response = await api.patch(
        `/project/${projectId}`,
        projectData
    );

    return response.data;
};

export const deleteProject = async (projectId) => {
    const response = await api.delete(`/project/${projectId}`);
    return response.data;
};

export const inviteMember = async (projectId, email) => {
    const response = await api.post(
        `/project/${projectId}/invite`,
        { email }
    );
    return response.data;
};

export const changeMemberRole = async (
    projectId,
    userId,
    role
) => {
    const response = await api.patch(
        `/project/${projectId}/members/${userId}`,
        { role }
    );

    return response.data;
};

export const removeMember = async (
    projectId,
    userId
) => {
    const response = await api.delete(
        `/project/${projectId}/members/${userId}`
    );

    return response.data;
};

export const leaveProject = async (projectId) => {
    const response = await api.delete(
        `/project/${projectId}/leave`
    );

    return response.data;
};

export const transferOwnership = async (
    projectId,
    userId
) => {
    const response = await api.patch(
        `/project/${projectId}/transfer-owner`,
        { userId }
    );

    return response.data;
};