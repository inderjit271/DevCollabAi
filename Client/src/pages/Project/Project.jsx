import { useParams } from "react-router-dom";

function Project() {

    const { projectId } = useParams();

    return (
        <h1>
            Project : {projectId}
        </h1>
    );
}

export default Project;