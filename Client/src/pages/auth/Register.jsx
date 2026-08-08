import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { registerUser } from "../../services/auth.service";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password } = formData;

        if (!name || !email || !password) {
            return toast.error("Please fill all fields");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setLoading(true);

            await registerUser(formData);

            toast.success("Account created successfully");

            navigate("/", { replace: true });

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 text-white">

            <div className="flex min-h-screen items-center justify-center">

                <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

                    {/* Header */}

                    <div className="mb-8 text-center">

                        <h1 className="text-3xl font-bold text-cyan-400">
                            DevCollab AI
                        </h1>

                        <p className="mt-2 text-slate-400">
                            Create your account
                        </p>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}

                        <div>

                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                autoComplete="name"
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                            />

                        </div>

                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                            />

                        </div>

                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                autoComplete="new-password"
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                            />

                        </div>

                        {/* Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>

                    </form>

                    {/* Login Link */}

                    <p className="mt-6 text-center text-sm text-slate-400">

                        Already have an account?{" "}

                        <Link
                            to="/"
                            className="font-medium text-cyan-400 hover:text-cyan-300"
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;