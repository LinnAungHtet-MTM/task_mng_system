import employeeDB from "../models/employeeModel";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import randomstring from "randomstring";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail";
import jwt from "jsonwebtoken";

const getAllEmployeeServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await employeeDB.find();
    res.status(200).json({ success: true, message: "All Employee List", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to get all employee" });
  }
};

const getEmployeeIdService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await employeeDB.findById(req.params.id);
    if (data) {
      return res
        .status(201)
        .json({ success: true, message: "Get employee by id", data });
    } else {
      res.json({ success: false, message: "No employee with this id" });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Employee not found" });
  }
};

const createEmployeeService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employeeData = {
      employeeName: req.body.employeeName,
      email: req.body.email,
      profile: req.body.profile,
      address: req.body.address ? req.body.address : "",
      phone: req.body.phone ? req.body.phone : "",
      DOB: req.body.DOB ? req.body.DOB : "",
      position: req.body.position,
    };

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file?.path || "");
      employeeData.profile = upload.secure_url;
    } else {
      employeeData.profile =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsf_0pUDPlKJNpqfEG_XdAlEqXl0ARhJ82BMEHJDA8bPTV_J_b70U_QSG6wQETB4kvVgM&usqp=CAU";
    }
    const email = req.body.email;

    const findEmployee = await employeeDB.findOne({ email });
    if (findEmployee) {
      res.status(400).json({ message: "Employee already exist" });
    } else {
      const randomPassword = randomstring.generate(8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: "1D",
      });

      const data = await new employeeDB({
        ...employeeData,
        password: hashedPassword,
        token,
        verified: false,
      }).save();

      const verifyLink = `https://task-mng-sys.vercel.app/verify?token=${token}`;
      const text = `Hello,\n\n Your Email is: ${email} \n\n Your random password is: ${randomPassword}\n\n You can use this password to log in.\n\n Please Click the following link to verify your account! \n\n ${verifyLink}`;

      sendEmail(email, "Your Randomly Generated Password", text);

      res
        .status(201)
        .json({ success: true, message: "New Employee Added", data });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to create employee" });
  }
};

const updateEmployeeService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employeeData = {
      employeeName: req.body.employeeName,
      email: req.body.email,
      profile: req.body.profile,
      address: req.body.address ? req.body.address : "",
      phone: req.body.phone ? req.body.phone : "",
      DOB: req.body.DOB ? req.body.DOB : "",
      position: req.body.position,
    };

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file?.path || "");
      employeeData.profile = upload.secure_url;
    } else if (employeeData.profile === "null") {
      employeeData.profile =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsf_0pUDPlKJNpqfEG_XdAlEqXl0ARhJ82BMEHJDA8bPTV_J_b70U_QSG6wQETB4kvVgM&usqp=CAU";
    }

    const email = req.body.email;

    const findEmployee = await employeeDB.findOne({
      email,
      _id: { $ne: req.params.id },
    });
    if (findEmployee) {
      return res.status(400).json({ message: "Employee already exist" });
    }

    const data = await employeeDB.findById(req.params.id);
    if (data) {
      await employeeDB.findByIdAndUpdate(data._id, employeeData);
      const updateEmployee = await employeeDB.findById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Employee Updated Successfully",
        data: updateEmployee,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to update employee" });
  }
};

const dropEmployeeService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await employeeDB.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Employee Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to delete employee" });
  }
};

export {
  getAllEmployeeServices,
  getEmployeeIdService,
  createEmployeeService,
  updateEmployeeService,
  dropEmployeeService,
};
