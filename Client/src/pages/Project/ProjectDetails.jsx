import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { toast } from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import {
    getProjectById,
    inviteMember,
    changeMemberRole,
    removeMember,
    leaveProject,
    transferOwnership,
    updateProject,
    deleteProject,
} from "../../services/project.service";


function ProjectDetails() {

    const { projectId } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();


    // =========================
    // PROJECT STATES
    // =========================

    const [project, setProject] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // =========================
    // INVITE STATES
    // =========================

    const [isInviteModalOpen, setIsInviteModalOpen] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [inviting, setInviting] =
        useState(false);


    // =========================
    // TRANSFER STATES
    // =========================

    const [isTransferModalOpen, setIsTransferModalOpen] =
        useState(false);

    const [selectedOwnerId, setSelectedOwnerId] =
        useState("");

    const [transferring, setTransferring] =
        useState(false);


    // =========================
    // EDIT PROJECT STATES
    // =========================

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false);

    const [editTitle, setEditTitle] =
        useState("");

    const [editDescription, setEditDescription] =
        useState("");

    const [updating, setUpdating] =
        useState(false);


    // =========================
    // FETCH PROJECT
    // =========================

    const fetchProject = async () => {

        try {

            setLoading(true);

            const data =
                await getProjectById(projectId);

            setProject(data.project);

        } catch (error) {

            const status =
                error.response?.status;

            const message =
                error.response?.data?.message ||
                "Failed to load project";

            toast.error(message);

            if (status === 404) {

                navigate("/dashboard", {
                    replace: true,
                });

            }

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = () => {

        setEditTitle(
            project.title || ""
        );

        setEditDescription(
            project.description || ""
        );

        setIsEditModalOpen(true);

    };


    // =========================
    // UPDATE PROJECT
    // =========================

    const handleUpdateProject = async (e) => {

        e.preventDefault();


        const title =
            editTitle.trim();

        const description =
            editDescription.trim();


        if (!title) {

            return toast.error(
                "Project title is required"
            );

        }


        try {

            setUpdating(true);


            const data =
                await updateProject(
                    projectId,
                    {
                        title,
                        description,
                    }
                );


            toast.success(
                data.message ||
                "Project updated successfully"
            );


            setIsEditModalOpen(false);


            await fetchProject();

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to update project";

            toast.error(message);

        } finally {

            setUpdating(false);

        }

    };


    // =========================
    // DELETE PROJECT
    // =========================

    const handleDeleteProject = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this project? This action cannot be undone."
            );


        if (!confirmed) {
            return;
        }


        try {

            const data =
                await deleteProject(
                    projectId
                );


            toast.success(
                data.message ||
                "Project deleted successfully"
            );


            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to delete project";

            toast.error(message);

        }

    };


    // =========================
    // INVITE MEMBER
    // =========================

    const handleInviteMember = async (e) => {

        e.preventDefault();

        const trimmedEmail =
            email.trim().toLowerCase();


        if (!trimmedEmail) {

            return toast.error(
                "Email is required"
            );

        }


        try {

            setInviting(true);

            const data =
                await inviteMember(
                    projectId,
                    trimmedEmail
                );


            toast.success(
                data.message ||
                "Member added successfully"
            );


            setEmail("");

            setIsInviteModalOpen(false);


            await fetchProject();

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to invite member";

            toast.error(message);

        } finally {

            setInviting(false);

        }

    };


    // =========================
    // CHANGE MEMBER ROLE
    // =========================

    const handleChangeRole = async (
        userId,
        role
    ) => {

        try {

            const data =
                await changeMemberRole(
                    projectId,
                    userId,
                    role
                );


            toast.success(
                data.message ||
                "Member role updated"
            );


            await fetchProject();

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to update member role";

            toast.error(message);

        }

    };


    // =========================
    // REMOVE MEMBER
    // =========================

    const handleRemoveMember = async (
        userId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to remove this member?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const data =
                await removeMember(
                    projectId,
                    userId
                );


            toast.success(
                data.message ||
                "Member removed successfully"
            );


            await fetchProject();

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to remove member";

            toast.error(message);

        }

    };


    // =========================
    // LEAVE PROJECT
    // =========================

    const handleLeaveProject = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to leave this project?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const data =
                await leaveProject(
                    projectId
                );


            toast.success(
                data.message ||
                "You left the project"
            );


            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to leave project";

            toast.error(message);

        }

    };


    // =========================
    // TRANSFER OWNERSHIP
    // =========================

    const handleTransferOwnership = async () => {

        if (!selectedOwnerId) {

            return toast.error(
                "Please select a member"
            );

        }


        const confirmed =
            window.confirm(
                "Are you sure you want to transfer ownership? You will become an admin."
            );


        if (!confirmed) {
            return;
        }


        try {

            setTransferring(true);


            const data =
                await transferOwnership(
                    projectId,
                    selectedOwnerId
                );


            toast.success(
                data.message ||
                "Ownership transferred successfully"
            );


            setSelectedOwnerId("");

            setIsTransferModalOpen(false);


            await fetchProject();

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to transfer ownership";

            toast.error(message);

        } finally {

            setTransferring(false);

        }

    };


    // =========================
    // LOAD PROJECT
    // =========================

    useEffect(() => {

        fetchProject();

    }, [projectId]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

                <p className="text-slate-400">
                    Loading project...
                </p>

            </div>
        );

    }


    if (!project) {
        return null;
    }


    // =========================
    // OWNER CHECK
    // =========================

    const ownerId =
        project.owner?._id ||
        project.owner;


    const currentUserId =
        user?._id ||
        user?.id;


    const isOwner =
        ownerId?.toString() ===
        currentUserId?.toString();


    // =========================
    // UI
    // =========================

    return (

        <div className="min-h-screen bg-slate-950 text-white">


            {/* =========================
                HEADER
            ========================= */}

            <header className="border-b border-slate-800">

                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">


                    <div className="flex items-center gap-4">

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                        >
                            ← Back
                        </button>


                        <div>

                            <h1 className="text-2xl font-bold text-cyan-400">
                                {project.title}
                            </h1>

                            <p className="text-sm text-slate-400">
                                Project Workspace
                            </p>

                        </div>

                    </div>


                    {/* OWNER ACTIONS */}

                    {isOwner && (

                        <div className="flex items-center gap-3">

                            {/* EDIT */}

                            <button
                                onClick={
                                    openEditModal
                                }
                                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                            >
                                ✏️ Edit
                            </button>


                            {/* TRANSFER */}

                            <button
                                onClick={() =>
                                    setIsTransferModalOpen(
                                        true
                                    )
                                }
                                className="rounded-lg border border-yellow-500/30 px-4 py-2 text-sm font-medium text-yellow-400 transition hover:bg-yellow-500/10"
                            >
                                Transfer Ownership
                            </button>


                            {/* DELETE */}

                            <button
                                onClick={
                                    handleDeleteProject
                                }
                                className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                            >
                                🗑️ Delete
                            </button>

                        </div>

                    )}

                </div>

            </header>


            {/* =========================
                MAIN
            ========================= */}

            <main className="mx-auto max-w-6xl px-6 py-8">


                {/* PROJECT INFO */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="text-xl font-semibold">
                        About Project
                    </h2>


                    <p className="mt-3 leading-7 text-slate-400">

                        {project.description ||
                            "No description available."}

                    </p>

                </section>


                {/* MEMBERS */}

                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">


                    {/* MEMBERS HEADER */}

                    <div className="mb-5 flex items-center justify-between">


                        <div>

                            <h2 className="text-xl font-semibold">
                                Members
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">

                                {project.members?.length ||
                                    0}{" "}
                                members

                            </p>

                        </div>


                        {/* INVITE */}

                        {isOwner && (

                            <button
                                onClick={() =>
                                    setIsInviteModalOpen(
                                        true
                                    )
                                }
                                className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
                            >
                                + Invite Member
                            </button>

                        )}

                    </div>


                    {/* MEMBER LIST */}

                    <div className="space-y-3">


                        {project.members?.map(
                            (member) => {

                                const memberUserId =
                                    member.user?._id ||
                                    member.user;


                                const isMemberOwner =
                                    memberUserId
                                        ?.toString() ===
                                    ownerId
                                        ?.toString();


                                return (

                                    <div
                                        key={memberUserId}
                                        className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >


                                        {/* USER INFO */}

                                        <div>

                                            <p className="font-medium">

                                                {member.user?.name ||
                                                    "Unknown User"}

                                            </p>


                                            <p className="text-sm text-slate-500">

                                                {member.user?.email ||
                                                    ""}

                                            </p>

                                        </div>


                                        {/* MEMBER ACTIONS */}

                                        <div className="flex items-center gap-3">


                                            {/* OWNER */}

                                            {isMemberOwner ? (

                                                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                                                    Owner
                                                </span>

                                            ) : isOwner ? (

                                                <>

                                                    {/* ROLE */}

                                                    <select
                                                        value={
                                                            member.role
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeRole(
                                                                memberUserId,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                                                    >

                                                        <option value="member">
                                                            Member
                                                        </option>

                                                        <option value="admin">
                                                            Admin
                                                        </option>

                                                    </select>


                                                    {/* REMOVE */}

                                                    <button
                                                        onClick={() =>
                                                            handleRemoveMember(
                                                                memberUserId
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                                                    >
                                                        Remove
                                                    </button>

                                                </>

                                            ) : (

                                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium capitalize text-cyan-400">

                                                    {member.role}

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>


                    {/* LEAVE PROJECT */}

                    {!isOwner && (

                        <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">

                            <button
                                onClick={
                                    handleLeaveProject
                                }
                                className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                            >
                                Leave Project
                            </button>

                        </div>

                    )}

                </section>

            </main>


            {/* =========================
                EDIT PROJECT MODAL
            ========================= */}

            {isEditModalOpen && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                    onMouseDown={() => {

                        if (!updating) {
                            setIsEditModalOpen(
                                false
                            );
                        }

                    }}
                >

                    <div
                        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <div className="mb-6">

                            <h2 className="text-xl font-semibold">
                                Edit Project
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Update your project information.
                            </p>

                        </div>


                        <form
                            onSubmit={
                                handleUpdateProject
                            }
                            className="space-y-5"
                        >


                            {/* TITLE */}

                            <div>

                                <label
                                    htmlFor="edit-title"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Project Title
                                </label>


                                <input
                                    id="edit-title"
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(
                                            e.target.value
                                        )
                                    }
                                    disabled={updating}
                                    required
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 disabled:opacity-60"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label
                                    htmlFor="edit-description"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Description
                                </label>


                                <textarea
                                    id="edit-description"
                                    rows="4"
                                    value={
                                        editDescription
                                    }
                                    onChange={(e) =>
                                        setEditDescription(
                                            e.target.value
                                        )
                                    }
                                    disabled={updating}
                                    placeholder="Describe your project..."
                                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 disabled:opacity-60"
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsEditModalOpen(
                                            false
                                        )
                                    }
                                    disabled={updating}
                                    className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {updating
                                        ? "Updating..."
                                        : "Save Changes"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================
                INVITE MODAL
            ========================= */}

            {isInviteModalOpen && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                    onMouseDown={() => {

                        if (!inviting) {
                            setIsInviteModalOpen(
                                false
                            );
                        }

                    }}
                >

                    <div
                        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-semibold">
                                    Invite Member
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Add a user using their registered email.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setIsInviteModalOpen(
                                        false
                                    )
                                }
                                disabled={inviting}
                                className="text-2xl text-slate-400 hover:text-white disabled:opacity-50"
                            >
                                &times;
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleInviteMember
                            }
                            className="space-y-5"
                        >

                            <div>

                                <label
                                    htmlFor="member-email"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Email Address
                                </label>


                                <input
                                    id="member-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="user@example.com"
                                    disabled={inviting}
                                    required
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 disabled:opacity-60"
                                />

                            </div>


                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => {

                                        setEmail("");

                                        setIsInviteModalOpen(
                                            false
                                        );

                                    }}
                                    disabled={inviting}
                                    className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={inviting}
                                    className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {inviting
                                        ? "Adding..."
                                        : "Add Member"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================
                TRANSFER OWNERSHIP MODAL
            ========================= */}

            {isTransferModalOpen && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                    onMouseDown={() => {

                        if (!transferring) {
                            setIsTransferModalOpen(
                                false
                            );
                        }

                    }}
                >

                    <div
                        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <div className="mb-6">

                            <h2 className="text-xl font-semibold text-yellow-400">
                                Transfer Ownership
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-400">

                                Select a member to become
                                the new owner. You will
                                become an admin.

                            </p>

                        </div>


                        <div>

                            <label
                                htmlFor="new-owner"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                New Owner
                            </label>


                            <select
                                id="new-owner"
                                value={selectedOwnerId}
                                onChange={(e) =>
                                    setSelectedOwnerId(
                                        e.target.value
                                    )
                                }
                                disabled={transferring}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-yellow-400 disabled:opacity-60"
                            >

                                <option value="">
                                    Select a member
                                </option>


                                {project.members
                                    ?.filter(
                                        (member) => {

                                            const memberId =
                                                member.user?._id ||
                                                member.user;

                                            return (
                                                memberId
                                                    ?.toString() !==
                                                ownerId
                                                    ?.toString()
                                            );

                                        }
                                    )
                                    .map((member) => {

                                        const memberId =
                                            member.user?._id ||
                                            member.user;


                                        return (

                                            <option
                                                key={memberId}
                                                value={memberId}
                                            >

                                                {member.user?.name ||
                                                    member.user?.email ||
                                                    "Unknown User"}

                                            </option>

                                        );

                                    })}

                            </select>

                        </div>


                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => {

                                    setSelectedOwnerId("");

                                    setIsTransferModalOpen(
                                        false
                                    );

                                }}
                                disabled={transferring}
                                className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleTransferOwnership
                                }
                                disabled={
                                    transferring ||
                                    !selectedOwnerId
                                }
                                className="rounded-lg bg-yellow-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {transferring
                                    ? "Transferring..."
                                    : "Transfer Ownership"}

                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
export default ProjectDetails;