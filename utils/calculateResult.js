const calculateResult = (exam, answers) => {
  let obtainedMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let attemptedCount = 0;
  let unattemptedCount = 0;

  const checkedAnswers = exam.questions.map((question, index) => {
    const studentAnswer = answers.find(
      (ans) =>
        String(ans.questionId) === String(question._id) ||
        Number(ans.questionIndex) === index
    );

    if (!studentAnswer || studentAnswer.selectedAnswerIndex === null) {
      unattemptedCount++;

      return {
        questionId: question._id,
        selectedAnswerIndex: null,
        isCorrect: false,
        marksObtained: 0,
      };
    }

    attemptedCount++;

    const isCorrect =
      Number(studentAnswer.selectedAnswerIndex) ===
      Number(question.correctAnswerIndex);

    let marksObtained = 0;

    if (isCorrect) {
      correctCount++;
      marksObtained = Number(exam.marksPerQuestion || 1);
    } else {
      wrongCount++;
      marksObtained = -Number(exam.negativeMarking || 0);
    }

    obtainedMarks += marksObtained;

    return {
      questionId: question._id,
      selectedAnswerIndex: studentAnswer.selectedAnswerIndex,
      isCorrect,
      marksObtained,
    };
  });

  return {
    checkedAnswers,
    obtainedMarks,
    correctCount,
    wrongCount,
    attemptedCount,
    unattemptedCount,
  };
};

module.exports = calculateResult;