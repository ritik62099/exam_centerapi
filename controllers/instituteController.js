const Institute = require("../models/Institute");

const createInstitute = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle logo upload
    if (req.file) {
      data.logo = req.file.path;
    }

    const institute = await Institute.create(data);

    res.status(201).json({
      success: true,
      data: institute,
      message: "Institute created successfully",
    });
  } catch (error) {
    console.error("Create institute error:", error);
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
    console.error("Get institutes error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      data: institute,
    });
  } catch (error) {
    console.error("Get institute by id error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInstitute = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle logo upload
    if (req.file) {
      data.logo = req.file.path;
    }

    const institute = await Institute.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      data: institute,
      message: "Institute updated successfully",
    });
  } catch (error) {
    console.error("Update institute error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndDelete(req.params.id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      message: "Institute deleted successfully",
    });
  } catch (error) {
    console.error("Delete institute error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInstitute,
  getInstitutes,
  getInstituteById,
  updateInstitute,
  deleteInstitute,
};