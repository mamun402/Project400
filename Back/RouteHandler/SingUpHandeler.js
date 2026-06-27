const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const userSchema = require("../Scheema/UserScheema");
const alumniScheema = require("../Scheema/AlumniScheema");
const DoctorSchema = require("../Scheema/DoctorScheema");
const User = new mongoose.model("User", userSchema);
const Alumni = new mongoose.model("Alumni", alumniScheema);
const jwt = require("jsonwebtoken");
const Doctor = new mongoose.model("Doctor", DoctorSchema);
const CheakLoginControler = require("../MiddleWears/CheakLoginControler");
const saltRounds = 10;
const path = require("path");
const fs = require("fs-extra");
const BooksSchema = require("../Scheema/BookScheema");
const RentBookScheema = require("../Scheema/RentBookScheema");
const Testimonial = require("../Scheema/testimonialSchema");
const Books = mongoose.model("book", BooksSchema); 
const RentBook = mongoose.model("RentBook", RentBookScheema); 
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { sendEmail } = require("../utils/mailer");
const { verifyEmailTemplate } = require("../utils/emailTemplates");
const DonationSchema = require("../Scheema/DonationSchema");
const Donation = mongoose.model("Donation", DonationSchema);
const MemberShipSchema = require("../Scheema/MemberShipSchema");
const MemberShip = mongoose.model("membership", MemberShipSchema);
const ActiveScheema= require("../Scheema/ActiveScheema");
const ActiveAccount = mongoose.model("activeaccount", ActiveScheema);
const DonationRSchema = require("../Scheema/DonationRSchema");
const DonationR = mongoose.model("donationdetails", DonationRSchema);
const { v4: uuidv4 } = require("uuid"); // Import UUID
const multer = require("multer");
const AlumniScheema = require("../Scheema/AlumniScheema");
const upload = multer({
  dest: "uploads/", // Folder where images will be saved
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
});

const phonePattern = /^\+(\d{1,4})(\d{4,14})$/;

const getCountrySpecificPhoneValidationError = (countryCode, nationalDigits, label) => {
  switch (countryCode) {
    case "880":
      return /^1[3-9]\d{8}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Bangladesh number`;
    case "91":
      return /^[6-9]\d{9}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Indian number`;
    case "92":
      return /^3[0-9]\d{9}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Pakistan number`;
    case "1":
      return /^\d{10}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid US/Canada number`;
    case "44":
      return /^(7\d{9}|1\d{10}|2\d{8,9}|3\d{8,9}|4\d{8,9}|5\d{8,9}|6\d{8,9}|8\d{8,9}|9\d{8,9})$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid UK number`;
    case "60":
      return /^1\d{8,9}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Malaysian number`;
    case "971":
      return /^[5-9]\d{8}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid UAE number`;
    case "966":
      return /^[5-9]\d{8}$/.test(nationalDigits)
        ? ""
        : `${label} must be a valid Saudi Arabia number`;
    default:
      return nationalDigits.length >= 6 && nationalDigits.length <= 14
        ? ""
        : `${label} must be a valid international number`;
  }
};

const getPhoneValidationError = (value, label = "Mobile number", required = false) => {
  const phone = String(value || "").trim().replace(/\s+/g, "");
  if (!phone) return required ? `${label} is required` : "";

  const match = phone.match(phonePattern);
  if (!match) {
    return `${label} must begin with a country code and contain only numbers`;
  }

  const [, countryCode, nationalDigits] = match;
  return getCountrySpecificPhoneValidationError(countryCode, nationalDigits, label);
};

const validatePhoneFields = (body, options = {}) => {
  const errors = {};
  const mobileError = getPhoneValidationError(
    body.mobile,
    "Mobile number",
    options.mobileRequired
  );
  if (mobileError) errors.mobile = mobileError;

  const whatsappError = getPhoneValidationError(body.whatsapp, "WhatsApp number");
  if (whatsappError) errors.whatsapp = whatsappError;

  return errors;
};


function createEmailVerificationToken(user) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.emailVerificationToken = hashed;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return rawToken;
}

router.post("/rentBooks", async (req, res) => {
  const { bookId, UserId, date, status, bookname, username } = req.body;
  try {
    // Generate a unique rentId
    const rentId = uuidv4();

    // Check if the rentId already exists in the database
    const existingRent = await RentBook.findOne({ rentId });

    if (existingRent) {
      return res.status(400).json({ message: "Rent ID already exists, try again." });
    }

    // Create and save the new RentBook entry
    const rentBookEntry = new RentBook({
      rentId,
      bookId,
      userId:UserId,
      status,
      date,
      bookname,
      username,
    });

    await rentBookEntry.save();

    res.status(200).json({
      message: "Book rented successfully!",
      rentBook: rentBookEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while renting the book.",
    });
  }
});
router.get("/checkPendingRequest", async (req, res) => {
  const { UserId, bookId,get } = req.query;

  try {
    const pendingRequest = await RentBook.findOne({
      userId: UserId,
      bookId,
      status: { $ne: "readed" }, // Exclude documents where status is "readed"
    });



    if (pendingRequest) {
      // If the status is "pending", convert it to "reader"
      if (pendingRequest.status === "readed" &&get==="readed") {
        pendingRequest.status = "pending";
      }
      res.status(200).json({ pendingRequest });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking pending request:", error);
    res.status(500).json({
      error: "An error occurred while checking the pending request.",
    });
  }
});



router.put("/returnBook", async (req, res) => {
  const { bookId, userId,rentId } = req.body;
  try {
    const book = await RentBook.findOneAndUpdate(
      { bookId: bookId,  userId,rentId },
      { status: "Returned" },
      { new: true }
    );

    if (book) {
      res.status(200).json({ message: "Book returned successfully", book });
    } else {
      res.status(404).json({ error: "Book not found or unauthorized action" });
    }
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ error: "An error occurred while returning the book." });
  }
});
 
router.put("/recivedBook", async (req, res) => {
  const { bookId, userId, returnDayNumber,rentId } = req.body;

  try {
    // Calculate returnDay
    const today = new Date();
    const returnDay = new Date(today);
    returnDay.setDate(today.getDate() + returnDayNumber);


    const book = await RentBook.findOneAndUpdate(
      { bookId: bookId, userId,rentId },
      { 
        status: "Received",
        returnDay: returnDay // Add returnDay field
      },
      { new: true }
    );


    if (book) {
      res.status(200).json({ message: "Book returned successfully", book });
    } else {
      res.status(404).json({ error: "Book not found or unauthorized action" });
    }
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ error: "An error occurred while returning the book." });
  }
});

router.put("/cancelReturn", async (req, res) => {
  const { bookId, userId,rentId } = req.body;
  try {
    const book = await RentBook.findOneAndUpdate(
      { bookId: bookId,  userId,rentId },
      { status: "Received" },
      { new: true }
    );


    if (book) {
      res.status(200).json({ message: "Return canceled successfully", book });
    } else {
      res.status(404).json({ error: "Book not found or unauthorized action" });
    }
  } catch (error) {
    console.error("Error canceling return:", error);
    res.status(500).json({ error: "An error occurred while canceling the return." });
  }
});


router.post("/user", upload.single("profileImage"), async (req, res) => {
  try {
    // Generate hashed password
    const hashpassword = await bcrypt.hash(req.body.password, saltRounds);

    const requiredErrors = {};
    if (!req.body.fullName || !String(req.body.fullName).trim()) {
      requiredErrors.fullName = "Full name is required";
    }
    if (!req.body.email || !String(req.body.email).trim()) {
      requiredErrors.email = "Email is required";
    }
    if (!req.body.password) {
      requiredErrors.password = "Password is required";
    } else if (String(req.body.password).length < 8) {
      requiredErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(requiredErrors).length > 0) {
      return res.status(400).json({ errors: requiredErrors });
    }

    const phoneErrors = validatePhoneFields(req.body, { mobileRequired: true });
    if (Object.keys(phoneErrors).length > 0) {
      return res.status(400).json({ errors: phoneErrors });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already existed" });
    }

    // Generate a unique ID and check its uniqueness
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
      uniqueId = Math.floor(10000 + Math.random() * 90000); // 5-digit
      const existing = await User.findOne({ uniqueId });
      if (!existing) isUnique = true;
    }

    // Handle profile image upload
    const file = req.file;

    let imageUrl = null;
    if (file) {
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileExtension = path.extname(file.originalname).toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png"];
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
          msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
        });
      }

      const fileName = `${Date.now()}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      fs.renameSync(file.path, filePath);
      imageUrl = `http://localhost:5000/uploads/${fileName}`;
    }

    // Create user (emailVerified defaults to false, designation defaults to "unverified")
    const newUser = new User({
      uniqueId,
      name: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      permanentAddress: req.body.permanentAddress,
      currentAddress: req.body.currentAddress,
      linkedinId: req.body.linkedinId,
      facebook: req.body.facebook,
      whatsapp: req.body.whatsapp,
      batch: req.body.batch,
      id: req.body.id,
      password: hashpassword,
      image: imageUrl,
    });

    // Create verification token and save user
    const rawToken = createEmailVerificationToken(newUser);
    await newUser.save();

    // Send verification email (do not fail signup if email fails)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verifyUrl = `${clientUrl}/verify-email?token=${rawToken}&id=${newUser._id}`;

    sendEmail({
      to: newUser.email,
      subject: "Verify your email - MU CSE Society",
      html: verifyEmailTemplate({ name: newUser.name || "Member", verifyUrl }),
      text: `Verify your email: ${verifyUrl}`,
    }).catch((e) => console.error("Verification email send failed:", e.message || e));

    return res.status(200).json({
      message: "Signup was successful! Please verify your email.",
      needsEmailVerification: true,
      userId: uniqueId,
      imageUrl: imageUrl,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in signing up",
      error: error.message,
    });
  }
});

router.put("/editProfile/:uniqueId", upload.single("profileImage"), async (req, res) => {
  try {
    const { uniqueId } = req.params;

    const user = await User.findOne({ uniqueId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle password update (if provided)
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      user.password = hashedPassword;
    }

    // Update other fields
    user.name = req.body.fullName || user.name;
    user.email = req.body.email || user.email;
    const phoneErrors = validatePhoneFields(req.body);
    if (Object.keys(phoneErrors).length > 0) {
      return res.status(400).json({ errors: phoneErrors });
    }
    user.mobile = req.body.mobile || user.mobile;
    user.permanentAddress = req.body.permanentAddress || user.permanentAddress;
    user.currentAddress = req.body.currentAddress || user.currentAddress;
    user.linkedinId = req.body.linkedinId || user.linkedinId;
    user.facebook = req.body.facebook || user.facebook;
    user.whatsapp = req.body.whatsapp || user.whatsapp;
    user.batch = req.body.batch || user.batch;
    user.id = req.body.id || user.id;
    user.designation = req.body.designation || user.designation;
    user.startDate = req.body.startDate || user.startDate;
    user.endDate = req.body.endDate || user.endDate;

    // Handle new profile image upload
    const file = req.file;
    if (file) {
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(file.originalname).toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png"];
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: "Invalid file format" });
      }

      const fileName = `${Date.now()}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      fs.renameSync(file.path, filePath);
      const imageUrl = `http://localhost:5000/uploads/${fileName}`;

      user.image = imageUrl; // Update image URL
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      userId: uniqueId,
      updatedUser: user,
    });

  } catch (error) {
    return res.status(400).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
});
router.post("/addalumni", upload.single("profileImage"), async (req, res) => {
  try {
    const {
      fullName = "",
      email = "",
      mobile = "",
      whatsapp = "",
      linkedin = "",
      designation = "",
      currentEmployer = "",
      facebook = "",
    } = req.body;

    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const requiredErrors = {};
    if (!trimmedName) requiredErrors.fullName = "Full name is required.";
    if (!normalizedEmail) requiredErrors.email = "Email is required.";
    if (!req.body.designation || !String(req.body.designation).trim()) {
      requiredErrors.designation = "Designation is required.";
    }
    if (!req.body.mobile || !String(req.body.mobile).trim()) {
      requiredErrors.mobile = "Mobile number is required.";
    }
    if (!req.file) requiredErrors.profileImage = "Profile image is required.";

    if (Object.keys(requiredErrors).length > 0) {
      return res.status(400).json({ errors: requiredErrors });
    }

    const phoneErrors = validatePhoneFields(req.body, { mobileRequired: true });
    if (Object.keys(phoneErrors).length > 0) {
      return res.status(400).json({ errors: phoneErrors });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const existingAlumni = await Alumni.findOne({ email: normalizedEmail });
    if (existingAlumni) {
      return res.status(409).json({ message: "An alumni with this email already exists." });
    }

    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
      uniqueId = Math.floor(10000 + Math.random() * 90000);
      const existingAlumniId = await Alumni.findOne({ uniqueId });
      if (!existingAlumniId) isUnique = true;
    }

    let imageUrl = "";
    const file = req.file;
    if (file) {
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(file.originalname).toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png"];
      if (!validExtensions.includes(fileExtension)) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({
          message: "Invalid file format. Only .jpg, .jpeg, and .png are allowed.",
        });
      }

      const fileName = `${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);
      fs.renameSync(file.path, filePath);
      imageUrl = `http://localhost:5000/uploads/${fileName}`;
    }

    const newAlumni = new Alumni({
      uniqueId,
      name: trimmedName,
      email: normalizedEmail,
      mobile: mobile.trim(),
      whatsapp: whatsapp.trim(),
      linkedin: linkedin.trim(),
      designation: designation.trim(),
      currentEmployer: currentEmployer.trim(),
      facebook: facebook.trim(),
      image: imageUrl,
    });

    await newAlumni.save();

    return res.status(201).json({
      message: "Alumni added successfully",
      alumni: newAlumni,
      userId: uniqueId,
      imageUrl,
    });
  } catch (error) {
    const status = error?.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: "Error adding alumni",
      error: error.message,
    });
  }
});



router.get("/Profile", CheakLoginControler, async (req, res) => {
  try {
    const user = await User.find({ email: req.query.email });
    if (user && user.length > 0) {
      res.send(user);
    }
  } catch (error) {
    res.status(200).json({
      error: "Wrong Username and password",
    });
  }
});
router.get("/singleUser", async (req, res) => {
 
  try {
    const user = await User.find({ uniqueId: req.query.id });
   
    if (user && user.length > 0) {
      res.send(user);
    }
  } catch (error) {
    res.status(200).json({
      error: "Wrong Username and password",
    });
  }
});
router.get("/viewProfile", async (req, res) => {

  try {
    const user = await User.find({ uniqueId: req.query.id });
    if (user && user.length > 0) {
      res.send(user);
    }
  } catch (error) {
    res.status(200).json({
      error: "Wrong Username and password",
    });
  }
});
router.get("/top-readers", async (req, res) => {
  try {
    const topReaders = await RentBook.aggregate([
      { $match: { status: "readed" } }, // Filter only books with status "readed"
      { $group: { _id: "$userId", totalBooksRead: { $sum: 1 } } }, // Count books read by each user
      { $sort: { totalBooksRead: -1 } }, // Sort by the highest read count
      { $limit: 10 } // Get top 5 readers
    ]);

    if (topReaders.length === 0) {
      return res.status(404).json({ message: "No readers found with 'Readed' status." });
    }

    // Find user details and assign ranks
    const users = await Promise.all(
      topReaders.map(async (reader, index) => {
        const user = await User.findOne({ uniqueId: reader._id });

        const rankNames = ["1st", "2nd", "3rd", "4th", "5th"];

        return user
          ? { 
              userId: reader._id,
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              image: user.image,
              currentAddress: user.currentAddress,
              totalBooksRead: reader.totalBooksRead,
              rank: rankNames[index] || `${index + 1}th` // Assign rank dynamically
            }
          : null;
      })
    );

    res.status(200).json({
      message: "Top readers retrieved successfully!",
      readers: users.filter(user => user !== null) // Remove null values if any user is not found
    });
  } catch (error) {
    console.error("Error fetching top readers:", error);
    res.status(500).json({ error: "An error occurred while fetching the top readers." });
  }
});


router.delete("/deleteProfile", async (req, res) => {
  try {
    const id = req.query.id; // Accepts ID from the query parameter

    if (!id) {
      return res.status(400).json({ error: "Unique ID is required" });
    }

    const result = await User.deleteOne({ uniqueId: id });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "User profile deleted successfully" });
    } else {
      res.status(404).json({ error: "User profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the profile" });
  }
});


router.get("/Allbooks", async (req, res) => {
  try {
    const books = await Books.find({});
    if (books && books.length > 0) {
      res.send(books);
    }
  } catch (error) {
    res.status(200).json({
      error: "there is no books",
    });
  }
});
router.get("/SpecificBook" , async (req, res) => {
  try {
    const user = await Books.find({ uniqueId: req.query.id });
    if (user && user.length > 0) {
      res.send(user);
    }
  } catch (error) {
    res.status(200).json({
      error: "Wrong Username and password",
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user && user.length > 0) {
      const isvalidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isvalidPassword) {
        // generate token

        if (!user[0].emailVerified) {
          return res.status(403).json({
            error: "Please verify your email first. Check your inbox for the verification link.",
            code: "EMAIL_NOT_VERIFIED",
          });
        }

        const designation = (user[0].designation || "").toLowerCase();
        if (designation === "pending" || designation === "unverified") {
          return res.status(403).json({
            error: "Your account is pending admin approval. Please wait for approval to log in.",
            code: "PENDING_ADMIN_APPROVAL",
          });
        }

const token = jwt.sign(
          {
            username: user[0].username,

            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          access_token: token,
          message: "Login successful!",
        });
      } else {
        res.status(200).json({
          error: "Wrong Username and password",
        });
      }
    } else {
      res.status(200).json({
        error: "email address not found",
      });
    }
  } catch (error) {
    res.status(200).json({
      error: "Wrong Username and password",
    });
  }
});
router.put("/UpdateUserProfile/:id", async (req, res) => {
  const result = User.findByIdAndUpdate(
    { _id: ObjectId(req.params.id) },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        mobile: req.body.mobie,
        address: req.body.address,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          message: "Todo was updated successfully!",
        });
      }
    }
  );

});

router.get("/Profile", CheakLoginControler, async (req, res) => {
  try {
    const user = await User.find({ email: req.query.email });
    if (user && user.length > 0) {
      res.send(user);
    }
  } catch (error) {
    res.status(200).json({
      error: "Wrong Username and password",
    });
  }
});
router.get("/Alluserprofile", async (req, res) => {
  try {
    const user = await User.find({});

    if (user && user.length > 0) {
      res.send(user);
    }
  } catch (error) {
    res.status(200).json({
      error: "Wrong Username and password",
    });
  }
});

router.get("/allalumni", async (req, res) => {
  try {
    const user = await Alumni.find({});
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({
      error: "Unable to fetch alumni",
    });
  }
});

router.get("/checkApprovedPendingRequest", async (req, res) => {
  const { userId } = req.query;

  try {
    // Fetch requests with specific statuses for the given user
    const pendingRequest = await RentBook.find({
     userId,
      status: { $in: ["approved", "Received", "Returned"] },
    });

    // Send successful response with the fetched data
    res.status(200).json({ pendingRequest });
  } catch (error) {
    // Handle errors gracefully
    console.error("Error checking pending request:", error);
    res.status(500).json({ error: "An error occurred while checking the pending request." });
  }
});

router.get("/readedSingleBook", async (req, res) => {
  const { id } = req.query; // Extract 'id' from query parameters

  if (!id) {
    return res.status(400).json({ error: "Book ID is required." });
  }

  try {
    // Fetch books with matching id and specific statuses
    const readBooks = await RentBook.find({
      bookId: id,
      status: { $in: ["Received", "Returned", "readed"] },
    });

    // Include the length of readBooks in the response
    res.status(200).json({
 
      total: readBooks.length, // Add the length of the array
    });
  } catch (error) {
    console.error("Error fetching read books:", error);
    res.status(500).json({ error: "An error occurred while fetching the read books." });
  }
});

router.get("/checkTotalReadBookUser", async (req, res) => {
  try {
    const userId = req.query.userId; // Retrieve userId from the query parameter
  
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch books for the given user with specific statuses and ensure they have a valid date
    const readBooks = await RentBook.find({
      userId, // Filter by userId
      status: { $in: [ "Received", "Returned","readed"] },
      date: { $exists: true }, // Ensure the date field exists
    });

    res.status(200).json({ readBooks });
  } catch (error) {
    console.error("Error fetching read books:", error);
    res.status(500).json({ error: "An error occurred while fetching the read books." });
  }
});
router.post("/forgetpassword", async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "No account found with this email address.",
      });
    }

    // Generate a password reset token (this token will expire in 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Use environment variable for JWT secret
      { expiresIn: "1h" }
    );

    // Encode email and password to handle special characters
    const encodedEmail = encodeURIComponent(user.email);
    const encodedPassword = encodeURIComponent(user.password);

    // Create the reset link
    const resetLink = `http://localhost:5173/reset-password/${encodedEmail}/${encodedPassword}`;

    // Configure the email transporter
 

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: user.email, // List of recipients
      subject: "Password Reset Request", // Subject line
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`, // HTML message body
    };

    // Send the email
    await sendEmail({
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
    });

    // If email sent successfully, respond to the user
    return res.status(200).json({
      message: "Password reset link has been sent to your email.",
    });

  } catch (error) {
    console.error("Error in forgetpassword route: ", error);
    res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
});


router.post("/reset-password", async (req, res) => {
  const { email, token, password } = req.body;


  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
   
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Verify if the token matches the user's stored token


    const encodedPassword = encodeURIComponent(token);
    const encodedPasswordd = encodeURIComponent(user.password);
   
    if (encodedPassword !== encodedPasswordd) { // Ensure `resetPasswordToken` exists in your schema
      return res.status(400).json({ error: "Invalid token or email mismatch." });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
  
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Reset token has expired." });
    }
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post('/donate', async (req, res) => {
  try {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
      uniqueId = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
      const existingUser = await Donation.findOne({ userId: uniqueId }); // Check if it exists
      if (!existingUser) {
        isUnique = true; // Break loop if unique
      }
    }
    const donationData = req.body;
   
    donationData.userId = uniqueId;

    // Save the donation data to the database
    const donation = new Donation(donationData);

    await donation.save();

    // Send success response
    res.status(201).json({
      message: 'Donation data saved successfully',
      donation,
    });
  } catch (error) {
    console.error('Error saving donation:', error);
    res.status(500).json({
      message: 'Error saving donation data',
      error,
    });
  }
});

router.post('/membership', async (req, res) => {
  try {
    const donationData = req.body;
    // Save donation data to the database
    const membership = new MemberShip(donationData);
    await membership.save();

    // Send success response
    res.status(201).json({ message: 'Donation data saved successfully' });
  } catch (error) {
    console.error('Error saving donation:', error);
    res.status(500).json({ message: 'Error saving donation data', error });
  }
});
router.get('/requestmemberships', async (req, res) => {
 
  try {
    // Retrieve all membership data from the database
    const memberships = await MemberShip.find();

    // Send the retrieved data as the response
    res.status(200).json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ message: 'Error fetching memberships', error });
  }
});
router.get("/requestmembershipSignle", async (req, res) => {
  const userId = req.query.userId; // Retrieve userId from query parameters
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Retrieve membership data based on userId
    const memberships = await MemberShip.find({ userId });

    res.status(200).json(memberships);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    res.status(500).json({ message: "Error fetching memberships", error });
  }
});
router.get("/requestmemberactiveSignle", async (req, res) => {
  const userId = req.query.userId; // Retrieve userId from query parameters
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Retrieve membership data based on userId
    const memberships = await ActiveAccount.find({ userId });
    res.status(200).json(memberships);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    res.status(500).json({ message: "Error fetching memberships", error });
  }
});
router.post('/activeAccount', async (req, res) => {
  try {
    const { id } = req.body; // Extract `id` from the request body
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    // Check if the membership exists
    const memberships = await MemberShip.find({ userId: id });
    if (memberships.length === 0) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Prepare the data to save
    const membershipData = {
      userId: id,
      Status: 'active', // Ensure field name is consistent
    };

    // Save to the ActiveAccount collection
    const membership = new ActiveAccount(membershipData);
    await membership.save();

    // Delete data from MemberShip collection
    await MemberShip.deleteMany({ userId: id });

    // Send success response
    res.status(201).json({ message: 'Account activated and membership data deleted successfully' });
  } catch (error) {
    console.error('Error activating account:', error);
    res.status(500).json({ message: 'Internal server error while activating account', error: error.message });
  }
});

router.put('/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
   

    if (!id) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    // Delete the member from the database
    const result = await MemberShip.deleteOne({ userId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ message: 'Member rejected and deleted successfully' });
  } catch (error) {
    console.error('Error rejecting member:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.put('/rejectDonation/:id', async (req, res) => {
  try {
    const { id } = req.params;   
    if (!id) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    // Delete the member from the database
    const result = await Donation.deleteOne({ userId: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ message: 'Member rejected and deleted successfully' });
  } catch (error) {
    console.error('Error rejecting member:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/requestDonation', async (req, res) => {

  try {
    // Retrieve all membership data from the database
    const memberships = await Donation.find();

    // Send the retrieved data as the response
    res.status(200).json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ message: 'Error fetching memberships', error });
  }
});

router.post('/activeDonation', async (req, res) => {
  try {
    const { id, ammount, email } = req.body;

    if (!id || !email || !ammount) {
      return res.status(400).json({ message: 'User ID, email, and amount are required' });
    }

    // Find donation using findOne (faster than find)
    const membership = await Donation.findOne({ userId: id });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Create new donation record for DonationR
    const donationData = new DonationR({ userId: id, ammount });

    // Prepare email
    const mailOptions = {
            to: email,
      subject: 'আপনার ডোনেশন আমরা রিসিভ করেছি',
      text: `আসসালামু আলাইকুম,\n\nজাযাকাল্লাহু খাইরান! আপনি আমাদের ${ammount} টাকা ডোনেট করেছেন।\n\nআমরা আপনার টাকা রিসিভ করেছি।\n\nধন্যবাদ,\nবইয়ের পাতা`,
    };

    // Perform all async operations in parallel for faster execution
    await Promise.all([
      donationData.save(), // Save donation to DonationR
      Donation.deleteOne({ userId: id }), // Delete from Donation (faster than deleteMany if only one entry)
      sendEmail({ to: mailOptions.to, subject: mailOptions.subject, text: mailOptions.text }), // Send email
    ]);

    res.status(201).json({ message: 'Donation activated, record updated, and confirmation email sent successfully.' });

  } catch (error) {
    console.error('Error activating donation:', error);
    res.status(500).json({ message: 'Internal server error while activating donation', error: error.message });
  }
});
router.delete("/deleteActivation", async (req, res) => {
  try {
    const id = req.query.id; // Accepts ID from the query parameter

    if (!id) {
      return res.status(400).json({ error: "Unique ID is required" });
    }

    const result = await ActiveAccount.deleteOne({ userId: id });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "User profile deleted successfully" });
    } else {
      res.status(404).json({ error: "User profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the profile" });
  }
});

router.get("/readBooks", async (req, res) => {
  const { userId } = req.query; // Get userId from request query
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch all rented books that the user has read
    const readBooks = await RentBook.find({
      status: "readed", // Ensure status matches correctly
      userId, // Filter by userId
    });
    if (!readBooks.length) {
      return res.status(200).json({ readBooks: [] });
    }

    // Extract book IDs from readBooks collection
    const bookIds = readBooks.map((book) => book.bookId);

    // Fetch book details from the Book collection
    const books = await Books.find({ uniqueId: { $in: bookIds } });
    res.status(200).json({ readBooks: books });
  } catch (error) {
    console.error("Error fetching read books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching read books." });
  }
});

// Get user by ID
router.get("/getUser/:id", async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.params.id });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

// Update user profile
router.put("/update/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, mobile, permanentAddress, currentAddress, password } = req.body;
   

    let user = await User.findOne({ uniqueId: req.params.id });

    if (!user) {
      console.error("Error: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.permanentAddress = permanentAddress || user.permanentAddress;
    user.currentAddress = currentAddress || user.currentAddress;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Handle profile image upload
    if (req.file) {
      const uploadDir = path.join(__dirname, "uploads");

      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png"];

      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: "Invalid file format. Only .jpg, .jpeg, .png allowed." });
      }

      // Rename and move file
      const fileName = `${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);
      fs.renameSync(req.file.path, filePath);

      const imageUrl = `http://localhost:5000/uploads/${fileName}`; // Update with your hosting URL
     
      user.image = imageUrl;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully!",
      user,
     
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

router.post("/adminAddUser", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, password, mobile, permanentAddress, currentAddress } = req.body;
    
    if (!fullName || !email || !password ) {
      return res.status(400).json({ message: "Name, email, password, and userId are required" });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    let imageUrl = null;
    const file = req.file;
    if (file) {
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(file.originalname).toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png"];
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: "Invalid file format. Only .jpg, .jpeg, .png allowed." });
      }

      const fileName = `${Date.now()}.jpg`;
      const filePath = path.join(uploadDir, fileName);
      fs.renameSync(file.path, filePath);
      imageUrl = `http://localhost:5000/uploads/${fileName}`;
    }
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
      uniqueId = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
      const existingUser = await User.findOne({ uniqueId }); // Check uniqueness
      if (!existingUser) {
        isUnique = true;
      }
    }
    const newUser = new User({
      uniqueId,
      name: fullName,
      email,
      mobile,
      permanentAddress,
      currentAddress,
      password: hashPassword,
      image: imageUrl,
    });
    await newUser.save();

    const activeMembership = new ActiveAccount({
      userId: uniqueId,
      Status: "active",
    });
    await activeMembership.save();


    res.status(200).json({
      message: "User created successfully and account activated",
      uniqueId,
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while adding user",
      error: error.message,
    });
  }
});
// POST /api/testimonial/addtestimonial
router.post("/addtestimonial", async (req, res) => {
  try {
    const { name, designation, image, testimonial } = req.body;

    // Validate required fields.
    if (!name || !designation || !testimonial) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Use findOneAndUpdate to update the testimonial if it exists or create a new one.
    const updatedTestimonial = await Testimonial.findOneAndUpdate(
      { name: name }, // In production, use a unique identifier (e.g. user ID or email).
      { $set: { designation, image: image || "", testimonial } },
      { new: true, upsert: true } // new returns the updated document; upsert creates if none exists.
    );

    return res.status(200).json({
      msg: "Testimonial added successfully",
      testimonial: updatedTestimonial
    });
  } catch (error) {
    console.error("Error adding testimonial:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
router.get("/gettestimonials", async (req, res) => {
  try {
    // Fetch all testimonials from the database.
    const testimonials = await Testimonial.find();

    if (!testimonials || testimonials.length === 0) {
      return res.status(404).json({ msg: "No testimonials found" });
    }

    return res.status(200).json({
      msg: "Testimonials retrieved successfully",
      testimonials
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
