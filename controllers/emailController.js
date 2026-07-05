const { sendEmail } = require("../services/emailService");

const sendAdmitCardEmail = async (req, res) => {
  try {
    const { studentEmail, studentName, examTitle, rollNumber, pdfBase64 } = req.body;

    if (!studentEmail || !pdfBase64) {
      return res.status(400).json({
        success: false,
        message: "Email and PDF are required",
      });
    }

    const subject = `Admit Card - ${examTitle} | Roll No: ${rollNumber}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; background: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; color: #333;">📋 Admit Card</h2>
          <p style="margin: 5px 0 0; color: #666;">${examTitle}</p>
        </div>
        
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Dear <strong>${studentName}</strong>,</p>
          
          <p style="color: #555; line-height: 1.6;">
            Your admit card for the upcoming examination has been generated. 
            Please find the attached PDF file.
          </p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Important Instructions:</p>
            <ul style="color: #856404; margin: 10px 0 0 20px; padding: 0;">
              <li>Print this admit card and bring it to the exam centre.</li>
              <li>Report 30 minutes before the exam time.</li>
              <li>Bring a valid photo ID proof along with this admit card.</li>
            </ul>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 8px; background: #f8f9fa; font-weight: bold; border: 1px solid #ddd;">Roll Number</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${rollNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f8f9fa; font-weight: bold; border: 1px solid #ddd;">Exam</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${examTitle}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 0 0 8px 8px; color: #999; font-size: 12px;">
          <p style="margin: 0;">This is an auto-generated email. Please do not reply.</p>
          <p style="margin: 5px 0 0;">© Exam Portal</p>
        </div>
      </div>
    `;

    const result = await sendEmail({
      to: studentEmail,
      subject: subject,
      text: `Dear ${studentName}, your admit card for ${examTitle} is attached. Roll Number: ${rollNumber}`,
      html: html,
      attachments: [
        {
          filename: `AdmitCard_${studentName.replace(/\s+/g, "_")}_${rollNumber}.pdf`,
          content: Buffer.from(pdfBase64, "base64"),
          contentType: "application/pdf",
        },
      ],
    });

    if (result.success) {
      res.json({
        success: true,
        message: `Admit card sent to ${studentEmail}`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error || "Email send nahi ho paya",
      });
    }
  } catch (error) {
    console.error("Send admit card email error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Email send karne me error aaya",
    });
  }
};

// ✅ Bulk email bhejne ke liye
const sendBulkAdmitCardEmails = async (req, res) => {
  try {
    const { students, examTitle, pdfsBase64 } = req.body;
    // pdfsBase64: array of { studentId, pdfBase64 }

    if (!students || !pdfsBase64 || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Students and PDFs are required",
      });
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const pdfData = pdfsBase64.find((p) => p.studentId === student._id);

      if (!student.email) {
        results.push({
          studentId: student._id,
          name: student.name,
          status: "failed",
          reason: "Email not available",
        });
        failCount++;
        continue;
      }

      if (!pdfData || !pdfData.pdfBase64) {
        results.push({
          studentId: student._id,
          name: student.name,
          status: "failed",
          reason: "PDF not available",
        });
        failCount++;
        continue;
      }

      try {
        const subject = `Admit Card - ${examTitle} | Roll No: ${student.rollNumber}`;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; background: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; color: #333;">📋 Admit Card</h2>
              <p style="margin: 5px 0 0; color: #666;">${examTitle}</p>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px; color: #333;">Dear <strong>${student.name}</strong>,</p>
              <p style="color: #555;">Your admit card is attached. Roll Number: <strong>${student.rollNumber}</strong></p>
              <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Report 30 minutes before exam time with valid photo ID.</p>
              </div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 0 0 8px 8px; color: #999; font-size: 12px;">
              <p style="margin: 0;">Auto-generated email. Do not reply.</p>
            </div>
          </div>
        `;

        const result = await sendEmail({
          to: student.email,
          subject: subject,
          html: html,
          attachments: [
            {
              filename: `AdmitCard_${student.name.replace(/\s+/g, "_")}_${student.rollNumber}.pdf`,
              content: Buffer.from(pdfData.pdfBase64, "base64"),
              contentType: "application/pdf",
            },
          ],
        });

        if (result.success) {
          results.push({
            studentId: student._id,
            name: student.name,
            email: student.email,
            status: "sent",
          });
          successCount++;
        } else {
          results.push({
            studentId: student._id,
            name: student.name,
            email: student.email,
            status: "failed",
            reason: result.error,
          });
          failCount++;
        }
      } catch (err) {
        results.push({
          studentId: student._id,
          name: student.name,
          status: "failed",
          reason: err.message,
        });
        failCount++;
      }

      // ✅ Har email ke baad 1 second wait (rate limit avoid karne ke liye)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    res.json({
      success: true,
      message: `${successCount} sent, ${failCount} failed`,
      data: {
        total: students.length,
        successCount,
        failCount,
        results,
      },
    });
  } catch (error) {
    console.error("Bulk email error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Bulk email send karne me error aaya",
    });
  }
};

module.exports = {
  sendAdmitCardEmail,
  sendBulkAdmitCardEmails,
};