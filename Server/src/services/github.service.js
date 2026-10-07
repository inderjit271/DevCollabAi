const axios = require("axios");

const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Accept: "application/vnd.github+json",
    },
});


// =========================
// EXTRACT OWNER & REPO
// =========================

const parseGithubUrl = (githubUrl) => {

    try {

        const url = new URL(githubUrl);

        if (url.hostname !== "github.com") {
            throw new Error("Invalid GitHub URL");
        }

        const parts =
            url.pathname
                .split("/")
                .filter(Boolean);

        if (parts.length < 2) {
            throw new Error("Invalid GitHub repository URL");
        }

        return {
            owner: parts[0],
            repo: parts[1].replace(".git", ""),
        };

    } catch (error) {

        throw new Error(
            "Invalid GitHub repository URL"
        );

    }

};


// =========================
// GET REPOSITORY
// =========================

const getRepository = async (githubUrl) => {

    const { owner, repo } =
        parseGithubUrl(githubUrl);

    const response =
        await githubApi.get(
            `/repos/${owner}/${repo}`
        );

    return response.data;

};


// =========================
// GET BRANCHES
// =========================

const getBranches = async (githubUrl) => {

    const { owner, repo } =
        parseGithubUrl(githubUrl);

    const response =
        await githubApi.get(
            `/repos/${owner}/${repo}/branches`
        );

    return response.data;

};


// =========================
// GET FILES
// =========================

const getFiles = async (
    githubUrl,
    path = ""
) => {

    const { owner, repo } =
        parseGithubUrl(githubUrl);

    console.log("GitHub owner:", owner);
    console.log("GitHub repo:", repo);
    console.log("GitHub path:", path);

    const endpoint = path
        ? `/repos/${owner}/${repo}/contents/${path}`
        : `/repos/${owner}/${repo}/contents`;

    console.log(
        "GitHub endpoint:",
        endpoint
    );

    const response = await githubApi.get(
        endpoint,
        {
            params: {
                ref: "master",
            },
        }
    );

    return response.data;
};

const getFileContent = async (githubUrl, path) => {

    const { owner, repo } =
        parseGithubUrl(githubUrl);

    const response = await githubApi.get(
        `/repos/${owner}/${repo}/contents/${path}`,
        {
            params: {
                ref: "master",
            },
        }
    );

    return response.data;
};

module.exports = {
    parseGithubUrl,
    getRepository,
    getBranches,
    getFiles,
    getFileContent,
};