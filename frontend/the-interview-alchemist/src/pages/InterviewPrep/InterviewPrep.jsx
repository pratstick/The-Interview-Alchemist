import React, { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence, motion, number } from 'framer-motion';
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu';
import SpinnerLoader from '../../components/loader/SpinnerLoader';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import QuestionCard from '../../components/Cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import RoleInfoHeader from './components/RoleInfoHeader'
import Drawer from '../../components/Drawer'

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = React.useState(null);
  
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = React.useState(false);
  const [explanation, setExplanation] = React.useState(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = React.useState(false);

  //Fetch session data by sessionId
  const fetchSessionDetailsbyId = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      } 
    }catch (error) {
        console.error("Error fetching session data:", error);
      }
  };

  //generate conceptual explanation
  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);

      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,{question}
      );

      if (response.data) {setExplanation(response.data);}

  } catch (error) {
    setExplanation(null);
    setErrorMsg("Error generating explanation");
    console.error("Error generating explanation:", error);
  } finally {
      setIsLoading(false);
    }
  };

const toggleQuestionPinStatus = async (questionId) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.QUESTION.PIN(questionId)
    );

    if (response.data && response.data.question) {
      const isPinned = response.data.question.isPinned;
      toast.success(isPinned ? "Question pinned!" : "Question unpinned!");
      fetchSessionDetailsbyId();
    }
  } catch (error) {
    console.error("Error pinning question:", error);
    toast.error("Error pinning question");
  }
};

  //Add more questions
  async function uploadMoreQuestions() {
    try {
      setIsUpdateLoader(true);
      //call AI ApI to generate more questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        }
      );
      //Should be an array of questions like [{question: "", answer: ""}]
      const generatedQuestions = aiResponse.data;
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId: sessionId,
          questions: generatedQuestions,
        }
      );
      if (response.data) {
        toast.success("Questions added successfully");
        fetchSessionDetailsbyId();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error uploading questions:", error.response.data);
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsbyId();
    }

    return () => {};
  },[]);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData?.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className='mx-auto pt-6 pb-8 px-6 md:px-0 max-w-5xl'>
        <h2 className='text-xl font-bold text-neutral-900 mb-2'>Interview Q&amp;A</h2>

        <div className='grid grid-cols-12 gap-6 mt-6 mb-12'>
          <div
            className={`col-span-12 ${openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-9"}`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => (
                <motion.div
                  key={data._id || index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 100,
                    delay: index * 0.1,
                    damping: 15,
                  }}
                  layout
                  layoutId={`question-${data._id || index}`}
                  className="mb-6"
                >
                  <>
                    <QuestionCard
                      question={data?.question || ""}
                      answer={data?.answer || ""}
                      onLearnMore={() => generateConceptExplanation(data.question)}
                      isPinned={data?.isPinned || false}
                      onTogglePin={() => {
                        toggleQuestionPinStatus(data._id);
                      }}
                    />
                  </>
                  {!isLoading && sessionData?.questions?.length === index + 1 && (
                    <div className='flex items-center justify-center mt-4'>
                      <button
                        className='flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-1 rounded text-nowrap border border-cyan-100 hover:border-cyan-200 hover:bg-cyan-100 cursor-pointer'
                        disabled={isUpdateLoader || isLoading}
                        onClick={uploadMoreQuestions}
                      >
                        {isUpdateLoader ? (
                          <SpinnerLoader />
                        ) : (
                          <>
                            <LuListCollapse />
                            <span className='hidden md:block'>Add More Questions</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer 
            isOpen={openLeanMoreDrawer}
            onClose={() => setOpenLeanMoreDrawer(false)}
            title={!isLoading && explanation?.title}>
              {errorMsg && (
                <p className='text-error-600 text-sm font-semibold mb-4 flex items-center'>
                  <LuCircleAlert className='inline-block mr-2 text-error-500' />
                  {errorMsg}
                </p>
              )}
              {isLoading && <SkeletonLoader />}
              {!isLoading && explanation && (
                <AIResponsePreview content={explanation?.explanation} />
              )}

            </Drawer>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InterviewPrep;