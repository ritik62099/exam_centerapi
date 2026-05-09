const PDFDocument = require("pdfkit");

const safe = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  return String(value);
};

const normalize = (value) => {
  return safe(value).trim().toLowerCase();
};

const getSubmissionAnswers = (result) => {
  return (
    result?.submission?.answers ||
    result?.submission?.submittedAnswers ||
    result?.answers ||
    result?.submittedAnswers ||
    []
  );
};

const getQuestionId = (question) => {
  return question?._id?.toString?.() || question?.id?.toString?.();
};

const getAnswerQuestionId = (answer) => {
  return (
    answer?.questionId?.toString?.() ||
    answer?.question?._id?.toString?.() ||
    answer?.question?.toString?.()
  );
};

const getCorrectAnswerRaw = (question) => {
  return (
    question?.correctAnswerIndex ??
    question?.correctOptionIndex ??
    question?.answerIndex ??
    question?.correctAnswer ??
    question?.correctOption
  );
};

const getStudentAnswerRaw = (result, question, questionIndex) => {
  const answers = getSubmissionAnswers(result);
  const questionId = getQuestionId(question);

  const answer = answers.find((item) => {
    const answerQuestionId = getAnswerQuestionId(item);

    return (
      answerQuestionId === questionId ||
      Number(item?.questionIndex) === Number(questionIndex) ||
      Number(item?.qIndex) === Number(questionIndex) ||
      Number(item?.index) === Number(questionIndex)
    );
  });

  if (!answer) return undefined;

  return (
    answer?.selectedAnswerIndex ??
    answer?.selectedOptionIndex ??
    answer?.optionIndex ??
    answer?.answerIndex ??
    answer?.selectedAnswer ??
    answer?.selectedOption ??
    answer?.answer
  );
};

const isEmpty = (value) => {
  return value === undefined || value === null || value === "";
};

const getOptionTextByRawValue = (question, rawValue) => {
  const options = question?.options || [];

  if (isEmpty(rawValue)) return "";

  const numberValue = Number(rawValue);

  if (!Number.isNaN(numberValue) && options[numberValue] !== undefined) {
    return safe(options[numberValue]);
  }

  return safe(rawValue);
};

const isCorrectAnswer = (question, selectedRaw) => {
  if (isEmpty(selectedRaw)) return false;

  const correctRaw = getCorrectAnswerRaw(question);

  const selectedNumber = Number(selectedRaw);
  const correctNumber = Number(correctRaw);

  if (!Number.isNaN(selectedNumber) && !Number.isNaN(correctNumber)) {
    return selectedNumber === correctNumber;
  }

  const selectedText = normalize(getOptionTextByRawValue(question, selectedRaw));
  const correctText = normalize(getOptionTextByRawValue(question, correctRaw));

  return selectedText === correctText;
};

const isOptionSelected = (option, optionIndex, selectedRaw) => {
  if (isEmpty(selectedRaw)) return false;

  return (
    Number(selectedRaw) === Number(optionIndex) ||
    normalize(selectedRaw) === normalize(option)
  );
};

const isOptionCorrect = (question, option, optionIndex) => {
  const correctRaw = getCorrectAnswerRaw(question);

  return (
    Number(correctRaw) === Number(optionIndex) ||
    normalize(correctRaw) === normalize(option)
  );
};

const addBorder = (doc) => {
  doc.save();
  doc.lineWidth(1).strokeColor("#B45309").rect(25, 25, 545, 792).stroke();
  doc.restore();
};

const addPageNumber = (doc, current, total) => {
  doc.save();

  doc.circle(520, 55, 22).fill("#B91C1C");

  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(`${current}/${total}`, 498, 49, {
      width: 44,
      align: "center",
    });

  doc.restore();
};

const drawHeader = (doc, result) => {
  const exam = result?.exam || {};
  const student = result?.student || {};
  const institute = exam?.institute || {};
  const batch = exam?.batch || {};

  addBorder(doc);

  doc
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(safe(institute?.name || "INSTITUTE NAME"), 35, 38, {
      width: 520,
      align: "center",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#1F2937")
    .text("ONLINE EXAMINATION RESULT", 35, 60, {
      width: 520,
      align: "center",
    });

  doc
    .moveTo(35, 82)
    .lineTo(560, 82)
    .strokeColor("#92400E")
    .lineWidth(0.8)
    .stroke();

  const y = 96;
  const rowH = 18;

  const rows = [
    ["Student Name", student?.name, "Roll No", student?.rollNumber],
    ["Registration No", student?.registrationNumber, "Mobile", student?.mobileNumber],
    ["Exam Name", exam?.title, "Batch", batch?.name || batch?.courseName],
    ["Institute Code", institute?.code, "Total Marks", exam?.totalMarks],
  ];

  rows.forEach((row, index) => {
    const rowY = y + index * rowH;

    doc.rect(35, rowY, 115, rowH).stroke("#9CA3AF");
    doc.rect(150, rowY, 170, rowH).stroke("#9CA3AF");
    doc.rect(320, rowY, 100, rowH).stroke("#9CA3AF");
    doc.rect(420, rowY, 140, rowH).stroke("#9CA3AF");

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#111827")
      .text(row[0], 40, rowY + 5, { width: 105 });

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#111827")
      .text(safe(row[1]), 155, rowY + 5, { width: 160 });

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#111827")
      .text(row[2], 325, rowY + 5, { width: 90 });

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#111827")
      .text(safe(row[3]), 425, rowY + 5, { width: 130 });
  });

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor("#374151")
    .text(
      "Correct answer is marked as [Correct Answer]. Student selected answer is marked as [Your Answer].",
      35,
      178,
      { width: 520 }
    );

  doc.y = 200;
};

const drawSectionBar = (doc, title) => {
  doc.save();

  doc.rect(35, doc.y, 525, 23).fill("#9CA3AF");

  doc
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(title, 45, doc.y + 7, { width: 500 });

  doc.restore();

  doc.y += 34;
};

const addPageIfNeeded = (doc, result, requiredSpace = 120) => {
  if (doc.y + requiredSpace > 760) {
    doc.addPage();
    drawHeader(doc, result);
  }
};

const generateResultPdf = (res, result) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 25,
    bufferPages: true,
  });

  const exam = result?.exam || {};
  const student = result?.student || {};
  const questions = exam?.questions || [];

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=result-${student?.rollNumber || "student"}.pdf`
  );

  doc.pipe(res);

  drawHeader(doc, result);

  drawSectionBar(
    doc,
    safe(exam?.section || exam?.subject || "Question & Answer Details")
  );

  if (questions.length === 0) {
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#DC2626")
      .text("No questions found in this exam.", 45, doc.y);
  }

  questions.forEach((question, qIndex) => {
    addPageIfNeeded(doc, result, 130);

    const selectedRaw = getStudentAnswerRaw(result, question, qIndex);
    const notAnswered = isEmpty(selectedRaw);
    const correct = isCorrectAnswer(question, selectedRaw);

    const questionText =
      question?.questionText ||
      question?.question ||
      question?.title ||
      `Question ${qIndex + 1}`;

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#111827")
      .text(`Q.${qIndex + 1} ${safe(questionText)}`, 45, doc.y, {
        width: 500,
      });

    doc.moveDown(0.4);

    const options = question?.options || [];

    options.forEach((option, optIndex) => {
      addPageIfNeeded(doc, result, 30);

      const selectedOption = isOptionSelected(option, optIndex, selectedRaw);
      const correctOption = isOptionCorrect(question, option, optIndex);

      let color = "#111827";
      let prefix = `${optIndex + 1}.`;
      let label = "";

      if (correctOption) {
        color = "#15803D";
        prefix = `[Correct] ${optIndex + 1}.`;
        label += "  [Correct Answer]";
      }

      if (selectedOption) {
        label += "  [Your Answer]";
      }

      if (selectedOption && !correctOption) {
        color = "#DC2626";
        prefix = `[Wrong] ${optIndex + 1}.`;
      }

      doc
        .font(correctOption || selectedOption ? "Helvetica-Bold" : "Helvetica")
        .fontSize(8.5)
        .fillColor(color)
        .text(`${prefix} ${safe(option)}${label}`, 70, doc.y, {
          width: 470,
        });

      doc.moveDown(0.35);
    });

    doc.moveDown(0.2);

    const selectedAnswerText = notAnswered
      ? "Not Answered"
      : getOptionTextByRawValue(question, selectedRaw);

    const correctAnswerText = getOptionTextByRawValue(
      question,
      getCorrectAnswerRaw(question)
    );

   

    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .fillColor("#15803D")
      .text(`Correct Answer: ${safe(correctAnswerText)}`, 70, doc.y, {
        width: 470,
      });

    doc.moveDown(0.25);

    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .fillColor(notAnswered ? "#B45309" : correct ? "#15803D" : "#DC2626")
      

    doc.moveDown(0.7);

    doc
      .strokeColor("#D1D5DB")
      .lineWidth(0.6)
      .moveTo(35, doc.y)
      .lineTo(560, doc.y)
      .stroke();

    doc.moveDown(0.8);
  });

  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    addPageNumber(doc, i + 1, range.count);

    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor("#6B7280")
      .text("Computer Generated Result", 35, 800, {
        width: 520,
        align: "center",
      });
  }

  doc.end();
};

module.exports = generateResultPdf;