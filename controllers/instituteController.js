const Institute = require("../models/Institute");

const createInstitute = async (req, res) => {
  try {
    const institute = await Institute.create(req.body);

    res.status(201).json({
      success: true,
      data: institute,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: institutes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      data: institute,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteInstitute = async (req, res) => {
  try {
    await Institute.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Institute deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInstitute,
  getInstitutes,
  updateInstitute,
  deleteInstitute,
};