import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import {
    getProjects,
    createProject,
} from "../../services/project.service";

import Modal from "../../components/ui/Modal";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [creatingProject, setCreatingProject] = useState(false);

    const [projectForm, setProjectForm] = useState({
        title : "",
        description: "",
    });

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const data = await getProjects();

            setProjects(data.projects || []);

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to load projects";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleLogout = async () => {
        await logout();

        toast.success("Logged out successfully");

        navigate("/", { replace: true });
    };

    const handleProjectChange = (e) => {
        const { name, value } = e.target;

        setProjectForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();

        const title = projectForm.title.trim();
        const description = projectForm.description.trim();

        if (!title) {
            return toast.error("Project name is required");
        }

        try {
            setCreatingProject(true);

            const data = await createProject({
                title,
                description,
            });

            toast.success(
                data.message || "Project created successfully"
            );

            setProjects((prev) => [
                data.project,
                ...prev,
            ]);

            setProjectForm({
                title : "",
                description: "",
            });

            setIsCreateModalOpen(false);

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to create project";

            toast.error(message);

        } finally {
            setCreatingProject(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Navbar */}

            <header className="border-b border-slate-800">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <div>
                        <h1 className="text-2xl font-bold text-cyan-400">
                            DevCollab AI
                        </h1>

                        <p className="text-sm text-slate-400">
                            Welcome, {user?.name}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-red-500 px-4 py-2 font-medium transition hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* Main */}

            <main className="mx-auto max-w-7xl px-6 py-8">

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-3xl font-bold">
                            Your Projects
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Manage and collaborate on your projects.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                        + New Project
                    </button>

                </div>

                {/* Loading */}

                {loading && (
                    <div className="py-20 text-center">
                        <p className="text-slate-400">
                            Loading projects...
                        </p>
                    </div>
                )}

                {/* Empty State */}

                {!loading && projects.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">

                        <h3 className="text-xl font-semibold">
                            No projects yet
                        </h3>

                        <p className="mt-2 text-slate-400">
                            Create your first project and start collaborating.
                        </p>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-6 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
                        >
                            Create Project
                        </button>

                    </div>
                )}

                {/* Projects */}

                {!loading && projects.length > 0 && (

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {projects.map((project) => (

                            <div
                                key={project._id}
                                onClick={() =>
                                    navigate(`/project/${project._id}`)
                                }
                                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-500"
                            >

                                <h3 className="text-xl font-semibold">
                                    {project.title}
                                </h3>

                                <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                                    {project.description ||
                                        "No description available."}
                                </p>

                                <div className="mt-5 flex items-center justify-between text-sm text-slate-500">

                                    <span>
                                        {project.members?.length || 0} members
                                    </span>

                                    <span className="text-cyan-400">
                                        Open →
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

            {/* Create Project Modal */}

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    if (!creatingProject) {
                        setIsCreateModalOpen(false);
                    }
                }}
                title="Create New Project"
            >

                <form
                    onSubmit={handleCreateProject}
                    className="space-y-5"
                >

                    {/* Project Name */}

                    <div>

                        <label
                            htmlFor="project-name"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Project Name
                        </label>

                        <input
                            id="project-name"
                            name="title"
                            type="text"
                            value={projectForm.title}
                            onChange={handleProjectChange}
                            placeholder="Enter project title"
                            disabled={creatingProject}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 disabled:opacity-60"
                        />

                    </div>

                    {/* Description */}

                    <div>

                        <label
                            htmlFor="project-description"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Description
                        </label>

                        <textarea
                            id="project-description"
                            name="description"
                            value={projectForm.description}
                            onChange={handleProjectChange}
                            placeholder="Describe your project"
                            rows={4}
                            disabled={creatingProject}
                            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 disabled:opacity-60"
                        />

                    </div>

                    {/* Actions */}

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            disabled={creatingProject}
                            className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={creatingProject}
                            className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {creatingProject
                                ? "Creating..."
                                : "Create Project"}
                        </button>

                    </div>

                </form>

            </Modal>

        </div>
    );
}

export default Dashboard;