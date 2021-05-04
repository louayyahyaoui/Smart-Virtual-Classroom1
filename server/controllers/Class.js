const ClassModel = require("../models/Class.js");
const StudentModel= require("../models/auth.model.js");
const mongoose = require("mongoose");
module.exports = {
  
  getClass: async (req, res) => {
    try {
      res
        .status(200)
        .json(
          await ClassModel.find({})
            .populate("classOwner")
            .populate("classUsers")
        );
    } catch (error) {
      res.status(404).json({ statue: false, message: error.message });
    }
  },
  getClassById: async (req, res) => {
    try {
      res
        .status(200)
        .json(
          await ClassModel.findOne({ _id: req.params._id })
            .populate("classOwner")
            .populate("classUsers")
        );
    } catch (error) {
      res.status(404).json({ statue: false, message: error.message });
    }
  },
  ClassByDateYear: async (req, res) => {
    try {
      res.status(200).json(
        await ClassModel.aggregate([
          {
            $match: {
              $or: [ {classUsers: { $in: [mongoose.Types.ObjectId(req.params.id)] }},{classOwner: { $in: [mongoose.Types.ObjectId(req.params.id)] }} ],
            },
          },
          {
            $unwind: "$className",
          },
          {
            $group: {
              _id: {  $year: "$classDatePost"  },
              classObjet: {
                $push: {
                  className: "$className",
                  classDescription: "$classDescription",
                  classSection: "$classSection",
                  classDatePost: "$classDatePost",
                  classOwner: "$classOwner",
                  classUsers: "$classUsers",
                  classLevel: "$classLevel",
                  _id: "$_id",
                },
              },
            },
          },

          {
            $sort: {
              year: -1,
            },
          },
        ])
      );
    } catch (error) {
      res.status(404).json({ statue: false, message: error.message });
    }
  },
  ClassByLevel: async (req, res) => {
    try {
      let newLevel = await ClassModel.aggregate([
        {
          $match: {
            $or: [ {classUsers: { $in: [mongoose.Types.ObjectId(req.params.id)] }},{classOwner: { $in: [mongoose.Types.ObjectId(req.params.id)] }} ],
          },
        },
        {
          $unwind: "$classLevel",
        },
        {
          $group: {
            _id: "$classLevel",
            classObjet: {
              $push: {
                className: "$className",
                classDescription: "$classDescription",
                classSection: "$classSection",
                classDatePost: "$classDatePost",
                classOwner: "$classOwner",
                classUsers: "$classUsers",
                classLevel: "$classLevel",
                _id: "$_id",
              },
            },
          },
        },
        {
          $sort: {
            classLevel: -1,
          },
        },
      ]);
      res
        .status(200)
        .json(
          await ClassModel.populate(newLevel, {
            path: "classOwner",
            model: "Student",
          })
        );
    } catch (error) {
      res.status(404).json({ statue: false, message: error.message });
    }
  },
  addClass: async (req, res) => {
    const newClass = new ClassModel(req.body);
    try {
      const data = await newClass.save();
      res.status(201).json({
        statue: true,
        message: "Class Added Succefully",
        result: data,
      });
    } catch (error) {
      res.status(400).json({ statue: false, message: error.message });
    }
  },
  updateClass: async (req, res) => {
    try {
     // const updateClass = new ClassModel(req.body);
      const data = await ClassModel.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.params.id),
        req.body
      );
      res.status(201).json({
        statue: true,
        message: " Class Updated Succefully",
        result: data,
      });
    } catch (error) {
      res.status(400).json({ statue: false, message: error.message });
    }
  },

  deleteClass: async (req, res) => {
    try {
      const data = await ClassModel.findByIdAndRemove(req.params.id);
      res.status(201).json({
        statue: true,
        message: "Class Deleted Succefully",
        result: data,
      });
    } catch (error) {
      res.status(400).json({ statue: false, message: error.message });
    }
  },
  deleteAllClass: async (req, res) => {
    try {
      const data = await ClassModel.remove({});
      res.status(201).json({
        statue: true,
        message: "Class Deleted Succefully",
        result: data,
      });
    } catch (error) {
      res.status(400).json({ statue: false, message: error.message });
    }
  },
  addUserToClass: async (req, res) => {
    try {
      const dataFind = await StudentModel.findOne({ email: req.params.email });
      const dataUpdate = await ClassModel.updateOne(
        { _id: req.params.id },
        { $push: { classUsers: [dataFind] } }
      );
      res.status(201).json({
        statue: true,
        message: "Class Updated Succefully",
        result: dataUpdate,
      });
    } catch (error) {
      res.status(400).json({ statue: false, message: error.message });
    }
  },
  removeUserFromClass: async (req, res) => {
    try {
      const dataFind = await StudentModel.findOne({ email: req.params.email });
      console.log(req.params.email);
      const dataUpdate = await ClassModel.update(
        { _id: req.params.id },
        { $pullAll: { classUsers: [dataFind] } },
        { safe: true }
      );
      res.status(201).json({
        statue: true,
        message: "Class Updated Succefully User Removed",
        result: dataUpdate,
      });
    } catch (error) {
      res.status(400).json({ statue: false, message: error.message });
    }
  },
  getUserByEmail: async (req, res) => {
    try {
      const dataFind = await StudentModel.findOne({ email: req.params.email });
      res.status(201).json(dataFind);
    } catch (error) {
      res.status(400).json({ statue: false, message: error.message });
    }
  },
};
