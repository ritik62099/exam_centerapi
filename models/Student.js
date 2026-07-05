// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const studentSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     rollNumber: {
//       type: String,
//       required: true,
//     },
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     photo: {
//       type: String,
//       default: "",
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     mobileNumber: {
//       type: String,
//       required: true,
//     },
//     institute: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Institute",
//       required: true,
//     },
//     batch: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Batch",
//       required: true,
//     },
//     role: {
//       type: String,
//       default: "student",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// studentSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// studentSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("Student", studentSchema);




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      default: "",
    },
    motherName: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    dob: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS", ""],
      default: "General",
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
      default: "",
    },
    rollNumber: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);