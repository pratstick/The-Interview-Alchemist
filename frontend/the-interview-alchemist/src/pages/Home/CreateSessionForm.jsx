import React from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import SpinnerLoader from '../../components/loader/SpinnerLoader';

const CreateSessionForm = () => {
    const [formData, setFormData] = React.useState({
        role: "",
        topicsToFocus: "",
        experience: "",
        description: ""
    });

    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();

        const { role, topicsToFocus, experience } = formData;

        if (!role || !topicsToFocus || !experience) {
            setError("Please fill in all required fields");
            return;
        }

        setError("");
        setIsLoading(true);
        try {
            // Call AI Api to generate questions
            const aiResponse = await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS,
                {
                    role,
                    experience,
                    topicsToFocus,
                    numberOfQuestions: 10,
                }
            );

            // Should be an array like [{question,answer},...]
            const generatedQuestions = Array.isArray(aiResponse.data) ? aiResponse.data : [];
            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
                ...formData,
                questions: generatedQuestions,
            });

            if (response.data?.session?._id) {
                navigate(`/interview-prep/${response.data?.session?._id}`);
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred while creating the session");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-7 flex flex-col justify-center rounded-lg shadow">
            <h3 className="text-lg font-semibold text-black">
                Start a new Interview Journey
            </h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-3">
                Fill out a few quick details to get started and unlock the power of The Interview Alchemist
            </p>

            <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
                <Input
                    value={formData.role || ""}
                    onChange={e => handleChange("role", e.target.value)}
                    label="Target Role"
                    placeholder="e.g. Software Engineer, Data Scientist, Frontend Developer, Ui/UX Designer, etc."
                    type="text"
                />

                <Input
                    value={formData.topicsToFocus || ""}
                    onChange={e => handleChange("topicsToFocus", e.target.value)}
                    label="Topics to Focus"
                    placeholder="Comma Separated , e.g. Data Structures, Algorithms, System Design, etc."
                    type="text"
                />

                <Input
                    value={formData.experience || ""}
                    onChange={e => handleChange("experience", e.target.value)}
                    label="Years of Experience"
                    placeholder="e.g. 1 year, 2 years, 3 years, etc."
                    type="number"
                />

                <Input
                    value={formData.description || ""}
                    onChange={e => handleChange("description", e.target.value)}
                    label="Description"
                    placeholder="e.g. I am looking for a role in Software Engineering with a focus on Data Structures and Algorithms."
                    type="text"
                />

                {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
                <button
                    type="submit"
                    className="btn-primary w-full mt-2 flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                       <>
                       <SpinnerLoader className="w-4 h-4" />
                        <span className="ml-2">Creating...</span>
                      </>
                      ) : (
                         "Create Session"
                  )}
                </button>
            </form>
        </div>
    );
};

export default CreateSessionForm;