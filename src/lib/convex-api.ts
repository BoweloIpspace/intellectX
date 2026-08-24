import { makeFunctionReference } from "convex/server";

export const convexApi = {
  courses: {
    listCourses: makeFunctionReference<"query">("courses:listCourses"),
    getCourseBySlug: makeFunctionReference<"query">("courses:getCourseBySlug"),
    getCourseByStableId: makeFunctionReference<"query">("courses:getCourseByStableId"),
    listInstructorCourses: makeFunctionReference<"query">("courses:listInstructorCourses"),
    getInstructorCourseDraft: makeFunctionReference<"query">("courses:getInstructorCourseDraft"),
    createInstructorCourseDraft: makeFunctionReference<"mutation">("courses:createInstructorCourseDraft"),
    saveInstructorCourseDraft: makeFunctionReference<"mutation">("courses:saveInstructorCourseDraft"),
    submitCourseForReview: makeFunctionReference<"mutation">("courses:submitCourseForReview"),
    requestCourseChanges: makeFunctionReference<"mutation">("courses:requestCourseChanges"),
    approveCourse: makeFunctionReference<"mutation">("courses:approveCourse"),
    publishCourse: makeFunctionReference<"mutation">("courses:publishCourse"),
    unpublishCourse: makeFunctionReference<"mutation">("courses:unpublishCourse"),
    archiveCourse: makeFunctionReference<"mutation">("courses:archiveCourse"),
    unarchiveCourse: makeFunctionReference<"mutation">("courses:unarchiveCourse"),
  },
  adminCourses: {
    listAdminCourses: makeFunctionReference<"query">("adminCourses:listAdminCourses"),
    getAdminCourseReview: makeFunctionReference<"query">("adminCourses:getAdminCourseReview"),
  },
  adminPastPapers: {
    listAdminPastPaperCourses: makeFunctionReference<"query">("adminPastPapers:listAdminPastPaperCourses"),
    listAdminPastPapers: makeFunctionReference<"query">("adminPastPapers:listAdminPastPapers"),
    getAdminPastPaper: makeFunctionReference<"query">("adminPastPapers:getAdminPastPaper"),
    createPastPaper: makeFunctionReference<"mutation">("adminPastPapers:createPastPaper"),
    updatePastPaper: makeFunctionReference<"mutation">("adminPastPapers:updatePastPaper"),
    deletePastPaper: makeFunctionReference<"mutation">("adminPastPapers:deletePastPaper"),
    createPastPaperQuestion: makeFunctionReference<"mutation">("adminPastPapers:createPastPaperQuestion"),
    updatePastPaperQuestion: makeFunctionReference<"mutation">("adminPastPapers:updatePastPaperQuestion"),
    deletePastPaperQuestion: makeFunctionReference<"mutation">("adminPastPapers:deletePastPaperQuestion"),
  },
  staffMedia: {
    generateStaffMediaUploadUrl: makeFunctionReference<"mutation">("staffMedia:generateStaffMediaUploadUrl"),
    registerStaffMediaUpload: makeFunctionReference<"mutation">("staffMedia:registerStaffMediaUpload"),
    listInstructorLessonMedia: makeFunctionReference<"query">("staffMedia:listInstructorLessonMedia"),
    attachLessonMedia: makeFunctionReference<"mutation">("staffMedia:attachLessonMedia"),
    removeLessonMedia: makeFunctionReference<"mutation">("staffMedia:removeLessonMedia"),
  },
  courseSelections: {
    getCourseSelection: makeFunctionReference<"query">("courseSelections:getCourseSelection"),
    upsertCourseSelection: makeFunctionReference<"mutation">("courseSelections:upsertCourseSelection"),
  },
  academicProfiles: {
    getAcademicProfile: makeFunctionReference<"query">("academicProfiles:getAcademicProfile"),
    upsertAcademicProfile: makeFunctionReference<"mutation">("academicProfiles:upsertAcademicProfile"),
    clearAcademicProfile: makeFunctionReference<"mutation">("academicProfiles:clearAcademicProfile"),
  },
  lessons: {
    listLessons: makeFunctionReference<"query">("lessons:listLessons"),
    getLessonsByCourse: makeFunctionReference<"query">("lessons:getLessonsByCourse"),
    getLessonById: makeFunctionReference<"query">("lessons:getLessonById"),
    updateLessonProgress: makeFunctionReference<"mutation">("lessons:updateLessonProgress"),
  },
  studyStats: {
    updateStudyStats: makeFunctionReference<"mutation">("studyStats:updateStudyStats"),
  },
  progress: {
    getDashboardSummary: makeFunctionReference<"query">("progress:getDashboardSummary"),
    getProgressSummary: makeFunctionReference<"query">("progress:getProgressSummary"),
    getProfileLearningSummary: makeFunctionReference<"query">("progress:getProfileLearningSummary"),
  },
  quizzes: {
    listQuizzes: makeFunctionReference<"query">("quizzes:listQuizzes"),
    getQuizzesByCourse: makeFunctionReference<"query">("quizzes:getQuizzesByCourse"),
    getQuizById: makeFunctionReference<"query">("quizzes:getQuizById"),
    getQuizAttempts: makeFunctionReference<"query">("quizzes:getQuizAttempts"),
    checkQuizAnswer: makeFunctionReference<"mutation">("quizzes:checkQuizAnswer"),
    submitQuizAttempt: makeFunctionReference<"mutation">("quizzes:submitQuizAttempt"),
  },
  pastPapers: {
    listPastPaperCourseSummaries: makeFunctionReference<"query">("pastPapers:listPastPaperCourseSummaries"),
    listPastPaperCourseIds: makeFunctionReference<"query">("pastPapers:listPastPaperCourseIds"),
    getPastPapersByCourse: makeFunctionReference<"query">("pastPapers:getPastPapersByCourse"),
    getPastPaperById: makeFunctionReference<"query">("pastPapers:getPastPaperById"),
    getPastPaperAnswer: makeFunctionReference<"query">("pastPapers:getPastPaperAnswer"),
  },
  notes: {
    getLessonNote: makeFunctionReference<"query">("notes:getLessonNote"),
    upsertLessonNote: makeFunctionReference<"mutation">("notes:upsertLessonNote"),
  },
  learnerMigration: {
    migrateLocalLearnerDataToAuthenticatedAccount: makeFunctionReference<"mutation">(
      "learnerMigration:migrateLocalLearnerDataToAuthenticatedAccount",
    ),
  },
  entitlements: {
    getPaidAccessDecision: makeFunctionReference<"query">("entitlements:getPaidAccessDecision"),
  },
  aiTutor: {
    getLessonTutor: makeFunctionReference<"action">("aiTutor:getLessonTutor"),
  },
};
