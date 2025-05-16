import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  // For focus management in Drawer
  const drawerCloseBtnRef = useRef(null);
  const lastLearnMoreBtnRef = useRef(null);

  // Fetch session data by sessionId
  const fetchSessionDetailsbyId = async () => {
    try {
      setLoadingSession(true);
      setErrorMsg(null);
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      } else {
        setErrorMsg("Session not found.");
      }
    } catch (error) {
      setErrorMsg("Error fetching session data.");
      console.error("Error fetching session data:", error);
    } finally {
      setLoadingSession(false);
    }
  };

  // Generate conceptual explanation
  const generateConceptExplanation = async (question, btnRef) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLeanMoreDrawer(true);
      if (btnRef) lastLearnMoreBtnRef.current = btnRef;

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION, { question }
      );

      if (response.data) setExplanation(response.data);

    } catch (error) {
      setExplanation(null);
      setErrorMsg("Error generating explanation");
      console.error("Error generating explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Focus management for Drawer
  useEffect(() => {
    if (openLeanMoreDrawer && drawerCloseBtnRef.current) {
      drawerCloseBtnRef.current.focus();
    }
    if (!openLeanMoreDrawer && lastLearnMoreBtnRef.current) {
      lastLearnMoreBtnRef.current.focus();
    }
  }, [openLeanMoreDrawer]);

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

  // Add more questions
  async function uploadMoreQuestions() {
    try {
      setIsUpdateLoader(true);
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        }
      );
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
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsbyId();
    }
  }, [sessionId]);

  // Sticky header for context on scroll
  const StickyRoleHeader = (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100">
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
    </div>
  );

  return (
    <DashboardLayout>
      {StickyRoleHeader}

      <main className='relative z-10 mx-auto pt-6 pb-8 px-4 md:px-0 max-w-5xl'>
        <h2 className='text-xl font-bold text-neutral-900 mb-2'>Interview Q&amp;A</h2>

        {/* Loader and empty/error state for session/questions */}
        {loadingSession ? (
          <section className="py-12 flex justify-center" aria-live="polite">
            <SpinnerLoader />
          </section>
        ) : errorMsg ? (
          <section className="flex flex-col items-center justify-center py-16" aria-live="polite">
            <LuCircleAlert className="text-4xl text-error-500 mb-2" />
            <p className="text-error-600 mb-2">{errorMsg}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded min-w-[120px]"
              onClick={fetchSessionDetailsbyId}
              aria-label="Retry loading session"
            >
              Retry
            </button>
          </section>
        ) : !sessionData?.questions?.length ? (
          <section className="flex flex-col items-center justify-center py-16" aria-live="polite">
            <img
              src="https://illustrations.popsy.co/amber/team-idea.svg"
              alt="No questions"
              className="w-40 mb-4"
            />
            <p className="text-gray-500 mb-2">No questions found for this session.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded min-w-[120px]"
              onClick={uploadMoreQuestions}
              aria-label="Generate Questions"
            >
              Generate Questions
            </button>
          </section>
        ) : (
          <section className='grid grid-cols-12 gap-4 sm:gap-6 mt-6 mb-12'>
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
                    tabIndex={0}
                  >
                    <div className="bg-white rounded-lg shadow p-3 md:p-3 transition hover:shadow-lg">
                      <QuestionCard
                        question={data?.question || ""}
                        answer={data?.answer || ""}
                        onLearnMore={e => generateConceptExplanation(data.question, e?.target)}
                        isPinned={data?.isPinned || false}
                        onTogglePin={() => {
                          toggleQuestionPinStatus(data._id);
                        }}
                      />
                    </div>
                    {!isLoading && sessionData?.questions?.length === index + 1 && (
                      <div className='flex items-center justify-center mt-4'>
                        <button
                          className='w-full sm:w-auto min-w-[120px] flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-2 rounded text-nowrap border border-cyan-100 hover:border-cyan-200 hover:bg-cyan-100 cursor-pointer'
                          disabled={isUpdateLoader || isLoading}
                          onClick={uploadMoreQuestions}
                          aria-label="Add More Questions"
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
          </section>
        )}

        {/* Drawer for AI explanation */}
        <Drawer 
          isOpen={openLeanMoreDrawer}
          onClose={() => setOpenLeanMoreDrawer(false)}
          title={isLoading ? <SkeletonLoader /> : (explanation?.title || "")}
          role="dialog"
          aria-modal="true"
        >
          {errorMsg && (
            <p className='text-error-600 text-sm font-semibold mb-4 flex items-center' aria-live="polite">
              <LuCircleAlert className='inline-block mr-2 text-error-500' />
              {errorMsg}
            </p>
          )}
          {isLoading && <SkeletonLoader />}
          {!isLoading && explanation && (
            <AIResponsePreview content={explanation?.explanation} />
          )}
          {/* Hidden close button for focus management */}
          <button
            ref={drawerCloseBtnRef}
            style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
            tabIndex={openLeanMoreDrawer ? 0 : -1}
            aria-label="Close Drawer"
            onClick={() => setOpenLeanMoreDrawer(false)}
          />
        </Drawer>
      </main>
    </DashboardLayout>
  );
}

export default InterviewPrep;