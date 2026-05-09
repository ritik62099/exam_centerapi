


exam-backend/
│
├── server.js
├── package.json
├── .env
│
├── config/
│   └── db.js
│
├── models/
│   ├── Admin.js
│   ├── Institute.js
│   ├── Batch.js
│   ├── Student.js
│   ├── Exam.js
│   ├── Submission.js
│   └── Result.js
│
├── controllers/
│   ├── adminController.js
│   ├── instituteController.js
│   ├── batchController.js
│   ├── studentController.js
│   ├── examController.js
│   ├── submissionController.js
│   └── resultController.js
│
├── routes/
│   ├── adminRoutes.js
│   ├── instituteRoutes.js
│   ├── batchRoutes.js
│   ├── studentRoutes.js
│   ├── examRoutes.js
│   ├── submissionRoutes.js
│   └── resultRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── uploadMiddleware.js
│   └── errorMiddleware.js
│
├── utils/
│   ├── generateToken.js
│   ├── calculateResult.js
│   └── generateResultPdf.js
│
├── uploads/
│   └── students/
│
└── seed/
    └── createAdmin.js