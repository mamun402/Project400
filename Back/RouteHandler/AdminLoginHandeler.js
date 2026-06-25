const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminSchema = require("../Scheema/AdminSceema");
const Admin = mongoose.model("singupadmin", AdminSchema); // Corrected model name
const BooksSchema = require("../Scheema/BookScheema");
const Books = mongoose.model("book", BooksSchema); // Corrected model name
const BlogSchema = require("../Scheema/BlogSchema");
const Blogs = mongoose.model("blogs", BlogSchema);
const FaqSchema = require("../Scheema/FaqScheema");
const newFAQ = mongoose.model("faqs", FaqSchema);
const CheakLoginControler = require("../MiddleWears/CheakLoginControler");
const RentBookScheema = require("../Scheema/RentBookScheema");
const RentBook = mongoose.model("RentBook", RentBookScheema);
const RolePermission = require("../Scheema/RolePermissionSchema");
const ReadedBook = mongoose.model("ReadBook", RentBookScheema);

const userSchema = require("../Scheema/UserScheema");
const User = new mongoose.model("User", userSchema);
const NoticeSchema = require("../Scheema/NoticeSchema");
const Notice = new mongoose.model("Notice", NoticeSchema);
const DonationRSchema = require("../Scheema/DonationRSchema");
const DonationR = mongoose.model("donationdetails", DonationRSchema);
const GalleryScheema = require("../Scheema/GalleryScheema");
const Gallery = mongoose.model("gallery", GalleryScheema);
const TeamScheema = require("../Scheema/TeamScheema");
const TeamMember = mongoose.model("team", TeamScheema);
const MissionSchema = require("../Scheema/MissonScheema"); // Ensure the file name is correctly referenced
const Mission = mongoose.model("mission", MissionSchema); // Corrected model name
const EventSchema = require("../Scheema/EventScheema");
const Event = mongoose.model("event", EventSchema);
const saltRounds = 10;
const axios = require("axios");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../utils/mailer");
const { noticeEmailTemplate } = require("../utils/emailTemplates");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const sharp = require("sharp"); // Add sharp for image processing
const path = require("path");
const fs = require("fs-extra");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid"); // Import UUID

// const upload = multer({ storage: storage });
const upload = multer({
  dest: "uploads/", // Folder where images will be saved
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
});
const uploads = multer({
  dest: "uploads/", // Folder where images will be saved
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      return cb(
        new Error("Invalid file format. Only .jpg, .jpeg, .png allowed.")
      );
    }
    cb(null, true);
  },
});
// Function to generate a unique 6-digit book ID
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Admin with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    // Save admin to the database
    await newAdmin.save();

    // Optionally, generate a token upon signup
    const token = jwt.sign(
      {
        userId: newAdmin._id,
        email: newAdmin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Admin created successfully!",
      access_token: token,
    });
  } catch (error) {
    console.error("Error during admin signup:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
});

router.post("/user", upload.single("profileImage"), async (req, res) => {
  try {
    // Generate hashed password
    const hashpassword = await bcrypt.hash(req.body.password, saltRounds);
    // Validate required fields
  
    if (!req.body.fullName || !req.body.email || !req.body.password) {
      return res.status(400).json({ msg: "Name, email, and password are required" });
    }
    // Generate a unique ID and check its uniqueness
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
      uniqueId = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
      const existingUser = await User.findOne({ uniqueId }); // Check uniqueness
      if (!existingUser) {
        isUnique = true;
      }
    }
    // Handle profile image upload
    const file = req.file; // Uploaded file from `upload.single()`
    if (file) {
      const uploadDir = path.join(__dirname, "uploads"); // Define the correct target folder path
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
      }
      const fileExtension = path.extname(file.originalname).toLowerCase(); // Get original file extension
      const validExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image formats
      // Check if the file extension is valid
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
          msg: "Invalid file format. Only .jpg, .jpeg, .png allowed."
       
        });
      }
      // Rename the file with a timestamp and ensure it has a .jpg extension
      const fileName = `${Date.now()}.jpg`; // Save file as .jpg format
      const filePath = path.join(uploadDir, fileName); // Correct target file path
      // Move the file to the server's directory with the new name
      fs.renameSync(file.path, filePath);
      // Generate image URL for frontend
      const imageUrl = `http://localhost:5000/uploads/${fileName}`; // Update with your hosting URL
      // Save user with profile image URL
      const newUser = new User({
        uniqueId, // Unique ID
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
        emailVerified: true,
        designation: req.body.designation,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        image: imageUrl, // Save image URL
      });

      await newUser.save();

      return res.status(200).json({
        message: "Signup was successful!",
        userId: uniqueId,
        imageUrl: imageUrl, // Return image URL
      });
    } else {
      // If no file is uploaded, create user without image
      const newUser = new User({
        uniqueId, // Unique ID
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
        designation: req.body.designation,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        emailVerified: true,
       
      });

      await newUser.save();

      return res.status(200).json({
        message: "Signup was successful without a profile image",
        userId: uniqueId,
        imageUrl: null, // No image URL
      });
    }

  } catch (error) {
    res.status(400).json({
      message: "Error in signing up",
      error: error.message,
    });
  }
});


router.get("/userId", async (req, res) => {
  try {
    const user = await User.find({ uniqueId: req.query.uniqueId });
    if (user && user.length > 0) {
      res.send(user);
    }
  } catch (error) {
    res.status(200).json({
      error: "Wrong Username and password",
    });
  }
});
// POST route for logging in
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Check if user exists in the database
    const user = await Admin.findOne({ email }); // Ensure 'email' matches correctly
    if (!user) {
      return res.status(401).json({ error: "Wrong username or password." });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Wrong username or password." });
    }

    // Generate token if email and password are valid
    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      access_token: token,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
});

// POST route for adding a book with an image and unique book ID
const generateUniqueId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 6-digit number
    uniqueId = Math.floor(100000 + Math.random() * 900000);
    // Check if the ID already exists in the database
    const existingRecord = await Books.findOne({ uniqueId });
    if (!existingRecord) {
      isUnique = true; // ID is unique
    }
  }

  return uniqueId;
};
const generateEventUniqueId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 6-digit number
    uniqueId = Math.floor(100000 + Math.random() * 900000);
    // Check if the ID already exists in the database
    const existingRecord = await Event.findOne({ uniqueId });
    if (!existingRecord) {
      isUnique = true; // ID is unique
    }
  }

  return uniqueId;
};
const generateUniqueIdForNotice = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 6-digit number
    uniqueId = Math.floor(100000 + Math.random() * 900000);
    // Check if the ID already exists in the database
    const existingRecord = await Notice.findOne({ uniqueId });
    if (!existingRecord) {
      isUnique = true; // ID is unique
    }
  }

  return uniqueId;
};
const generateUniqueIdForBlogs = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 6-digit number
    uniqueId = Math.floor(100000 + Math.random() * 900000);
    // Check if the ID already exists in the database
    const existingRecord = await Blogs.findOne({ uniqueId });
    if (!existingRecord) {
      isUnique = true; // ID is unique
    }
  }

  return uniqueId;
};
const generateUniqueIdForGallery = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 6-digit number
    uniqueId = Math.floor(100000 + Math.random() * 900000);
    // Check if the ID already exists in the database
    const existingRecord = await Gallery.findOne({ uniqueId });
    if (!existingRecord) {
      isUnique = true; // ID is unique
    }
  }

  return uniqueId;
};
// Post route for adding books
router.post("/addbooks", upload.single("File"), async (req, res) => {
  const { bookname, authorname, aboutbook, totalbooks, booktype } = req.body;
  const file = req.file; // Uploaded file from `upload.single()`

  // Collect and convert serial numbers to integers
  const serialNumbers = Object.keys(req.body)
    .filter((key) => key.startsWith("serialNumber"))
    .map((key) => Number(req.body[key]));

  // Validate input fields
  if (!file) return res.status(400).json({ msg: "File is required" });
  if (!bookname || !authorname || !aboutbook || !totalbooks || !booktype) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Convert `totalbooks` to number
  const totalBooksCount = Number(totalbooks);
  if (isNaN(totalBooksCount)) {
    return res
      .status(400)
      .json({ msg: "Total books should be a valid number" });
  }

  try {
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "uploads"); // Define the correct target folder path

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Get file extension from the uploaded file
    const fileExtension = path.extname(file.originalname).toLowerCase(); // Get original file extension
    const validExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image formats

    // Check if the file extension is valid
    if (!validExtensions.includes(fileExtension)) {
      return res
        .status(400)
        .json({ msg: "Invalid file format. Only .jpg, .jpeg, .png allowed." });
    }

    // Rename the file with a timestamp and ensure it has a .jpg extension
    const fileName = `${Date.now()}.jpg`; // Save file as .jpg format
    const filePath = path.join(uploadDir, fileName); // Correct target file path

    // Move the file to the server's directory with the new name
    fs.renameSync(file.path, filePath);

    // Generate the image URL for the frontend
    const imageUrl = `http://localhost:5000/uploads/${fileName}`; // Update with your hosting URL

    // Generate unique ID and save the book record to the database
    const uniqueId = await generateUniqueId();
    const bookslist = new Books({
      uniqueId,
      bookname,
      authorname,
      aboutbook,
      totalbooks: totalBooksCount,
      booktype,
      serialNumbers,
      imgUrl: imageUrl,
    });

    await bookslist.save();

    return res.status(200).json({
      msg: "Book added successfully",
      uniqueId,
      imageUrl,
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to process request" });
  }
});

router.put("/updateStatus", async (req, res) => {
  const { userId, bookId, status, username, bookname } = req.body;

  try {
    // Update the status of the rent request in the database
    const updatedRequest = await RentBook.findOneAndUpdate(
      {  userId, bookId: bookId, status: "Returned" },
      { status },
      { new: true }
    );

    if (updatedRequest) {

      // Prepare email details
      const subject = ` ${bookname} বইটি ফিরত দেওয়ার জন্য অনুরোধ`;
      const message = `আসসালামু আলাইকুম ,\n\n আপনি আমাদের কাছ থেকে  "${bookname}" বইটি নিয়েছিলেন। দয়া করে অতি শ্রীঘ্রই ফিরত দেওয়ার অনুরোধ জানানো হলো \n\nধন্যবাদ`;

      const mailOptions = {
        from: "boiyerpatha@gmail.com", // Sender email
        to: username, // User email
        subject,
        text: message,
      };
      // Log mail options for debugging
      await sendEmail({ to: mailOptions.to, subject: mailOptions.subject, html: mailOptions.html, text: mailOptions.text });

      // // Send the email
      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     console.error("Error sending email:", err);
      //   } else {
      //     console.log("Email sent successfully:", info.response);
      //   }
      // });

      // Respond to the client
      res.status(200).json({
        success: true,
        message: `Request ${status} successfully, and an email notification has been sent.`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Request not found or already processed.",
      });
    }
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while updating the request status.",
    });
  }
});
router.put("/reduceBooks", async (req, res) => {
  try {
    const { id } = req.query; // Get the book ID from the query string

    if (!id) {
      return res.status(400).json({ error: "Book ID is required" });
    }

    const book = await Books.findOne({ uniqueId: id });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.totalbooks <= 0) {
      return res.status(400).json({ error: "No books left to reduce" });
    }

    // Decrement the totalBooks and save
    book.totalbooks -= 1;
    await book.save();

    res.status(200).json({ message: "Book count updated", book });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

router.put("/addBooks", async (req, res) => {
  try {
    const { id } = req.query; // Get the book ID from the query string

    const book = await Books.findOne({ uniqueId: id });
    if (book) {
      // Decrement the totalBooks if the book is available

      book.totalbooks += 1; // Decrement totalBooks
      await book.save(); // Save the updated book count
      res.send(book); // Send the updated book back as a response
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updatebook", fileUpload(), async (req, res) => {
  const file = req.files?.File;
  const {
    id,
    bookname,
    authorname,
    aboutbook,
    totalbooks,
    booktype,
  } = req.body;

  if (!id) {
    return res.status(400).json({ msg: "Book ID is required" });
  }

  if (!bookname || !authorname || !aboutbook || !totalbooks || !booktype) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    let updatedData = { bookname, authorname, aboutbook, totalbooks, booktype };

    if (file) {
      const formData = new FormData();
      formData.append("image", file.data, file.name);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=c9cf072e93fd0a947a1ce06dc9ffeae5",
        formData,
        {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          },
        }
      );

      if (response.data && response.data.data && response.data.data.url) {
        updatedData.imgUrl = response.data.data.url;
      } else {
        return res
          .status(500)
          .json({ msg: "Failed to upload image to ImageBB" });
      }
    }

    const updatedBook = await Books.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res
      .status(200)
      .json({ msg: "Book updated successfully", book: updatedBook });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ msg: "Failed to update book" });
  }
});

router.put("/editbooks", uploads.single("File"), async (req, res) => {
  const { bookId } = req.query;
  const { bookname, authorname, aboutbook, booktype } = req.body;

  const totalbooks = parseInt(req.body.totalbooks, 10); // Safely parse totalbooks
  const serialNumbers = Object.keys(req.body)
    .filter((key) => key.startsWith("serialNumber"))
    .map((key) => req.body[key]);

  // Validate input
  if (
    !bookname ||
    !authorname ||
    !aboutbook ||
    !booktype ||
    isNaN(totalbooks)
  ) {
    return res.status(400).json({
      msg: "Validation failed. Please provide all required fields correctly.",
    });
  }

  try {
    const book = await Books.findOne({ uniqueId: bookId });
    if (!book) return res.status(404).json({ msg: "Book not found" });

    // Handle file upload if file exists
    if (req.file) {
      // Ensure the uploads directory exists
      const uploadDir = path.join(__dirname, "uploads"); // Define the correct target folder path
      const file = req.file;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      // Get file extension from the uploaded file
      const fileExtension = path.extname(file.originalname).toLowerCase(); // Get original file extension
      const validExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image formats

      // Check if the file extension is valid
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
          msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
        });
      }

      // Rename the file with a timestamp and ensure it has a .jpg extension
      const fileName = `${Date.now()}.jpg`; // Save file as .jpg format
      const filePath = path.join(uploadDir, fileName); // Correct target file path

      // Move the file to the server's directory with the new name
      fs.renameSync(file.path, filePath);

      // Generate the image URL for the frontend
      const imageUrl = `http://localhost:5000/uploads/${fileName}`; // Update with your hosting URL
      book.imgUrl = imageUrl;
    }

    // Update book fields
    book.bookname = bookname;
    book.authorname = authorname;
    book.aboutbook = aboutbook;
    book.totalbooks = totalbooks;
    book.booktype = booktype;
    book.serialNumbers = serialNumbers;

    // Save changes
    await book.save();
    res.status(200).json({ msg: "Book updated successfully", book });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/deleteBook", async (req, res) => {
  const { id } = req.query; // Ensure this matches the ID passed from the frontend

  try {
    // Find the book in the database
    const book = await Books.findOne({ uniqueId: id });

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Extract filename from the image URL
    if (book.imgUrl) {
      const imagePath = path.join(
        __dirname,
        "uploads",
        path.basename(book.imgUrl)
      );

      // Check if the file exists before deleting
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file
      }
    }

    // Delete book record from the database
    await Books.findOneAndDelete({ uniqueId: id });

    res.json({ success: true, message: "Book and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/checkUserSinglePendingRequest", async (req, res) => {
  const { userId, status } = req.query;

  try {
    const pendingRequest = await RentBook.find({
      status: status,
       userId,
    });

    if (pendingRequest.length > 0) {
      res.status(200).json({ pendingRequest });
    } else {
      res.status(200).json({ pendingRequest: [] }); // Return an empty array if no requests
    }
  } catch (error) {
    console.error("Error checking pending request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking the pending request." });
  }
});
router.get("/getBook", async (req, res) => {
  try {
    // Extract bookId from query parameters
    const { bookId } = req.query;
    const book = await Books.findOne({ uniqueId: bookId }); // Use findOne for a single book

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/addblogs", upload.single("file"), async (req, res) => {
  const { blogTitle, authorName, content } = req.body;
  const file = req.file; // Uploaded file from `upload.single()`

  // Validate input fields
  if (!file || !blogTitle || !authorName || !content) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get file extension from the uploaded file
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png"];

    // Check if the file extension is valid
    if (!validExtensions.includes(fileExtension)) {
      return res.status(400).json({
        msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
      });
    }

    // Rename the file with a timestamp and retain its original extension
    const fileName = `${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Move the file to the uploads directory with the new name
    fs.renameSync(file.path, filePath);

    // Generate the image URL for the frontend
    const imageUrl = `http://localhost:5000/uploads/${fileName}`;

    // Generate a unique ID for the blog
    const uniqueId = await generateUniqueIdForBlogs();

    // Save the blog record to the database
    const blog = new Blogs({
      uniqueId,
      blogTitle,
      authorName,
      content,
      imgUrl: imageUrl,
      date: Date.now(),
    });

    await blog.save();

    return res.status(200).json({
      msg: "Blog added successfully",
      uniqueId,
      imageUrl,
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to process request" });
  }
});

router.get("/getblogs", async (req, res) => {
  try {
    // Fetch blogs sorted by most recent
    const blogs = await Blogs.find().sort({ date: -1 });
    return res.status(200).json(blogs);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to fetch blogs" });
  }
});

router.get("/blog/:id", async (req, res) => {
  try {
    const blog = await Blogs.findOne({ uniqueId: req.params.id });
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/editblogs/:id", uploads.single("file"), async (req, res) => {
  const file = req.files?.file;
  const { blogTitle, authorName, content } = req.body;

  try {
    const updateData = {
      blogTitle,
      authorName,
      content,
    };
    if (req.file) {
      // Ensure the uploads directory exists
      const uploadDir = path.join(__dirname, "uploads"); // Define the correct target folder path
      const file = req.file;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      // Get file extension from the uploaded file
      const fileExtension = path.extname(file.originalname).toLowerCase(); // Get original file extension
      const validExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image formats

      // Check if the file extension is valid
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
          msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
        });
      }

      // Rename the file with a timestamp and ensure it has a .jpg extension
      const fileName = `${Date.now()}.jpg`; // Save file as .jpg format
      const filePath = path.join(uploadDir, fileName); // Correct target file path

      // Move the file to the server's directory with the new name
      fs.renameSync(file.path, filePath);

      // Generate the image URL for the frontend
      const imageUrl = `http://localhost:5000/uploads/${fileName}`; // Update with your hosting URL

      if (imageUrl) {
        updateData.imgUrl = imageUrl;
      }
    }

    const updatedBlog = await Blogs.findOneAndUpdate(
      { uniqueId: req.params.id }, // Search by uniqueId
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    res.status(200).json({ msg: "Blog updated successfully", updatedBlog });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Failed to process request" });
  }
});

router.delete("/deleteBlogs", async (req, res) => {
  const { id } = req.query; // Ensure ID is passed as a query parameter

  try {
    // Find the blog in the database
    const blog = await Blogs.findOne({ uniqueId: id });

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Extract filename from the image URL
    if (blog.imgUrl) {
      const imagePath = path.join(
        __dirname,
        "uploads",
        path.basename(blog.imgUrl)
      );

      // Check if the file exists before deleting
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file
      }
    }

    // Delete blog record from the database
    await Blogs.findOneAndDelete({ uniqueId: id });

    res.json({ success: true, message: "Blog and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/addGallery", upload.single("file"), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file; // Uploaded file from `upload.single()`

  // Validate input fields
  if (!file || !title || !description) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get file extension from the uploaded file
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png"];

    // Check if the file extension is valid
    if (!validExtensions.includes(fileExtension)) {
      return res.status(400).json({
        msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
      });
    }

    // Rename the file with a timestamp and retain its original extension
    const fileName = `${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Move the file to the uploads directory with the new name
    fs.renameSync(file.path, filePath);

    // Generate the image URL for the frontend
    const imageUrl = `http://localhost:5000/uploads/${fileName}`;

    // Save the gallery record to the database
    const uniqueId = await generateUniqueIdForGallery();
    const gallery = new Gallery({
      uniqueId,
      title,
      description,
      imgUrl: imageUrl,
      date: Date.now(),
    });

    await gallery.save();

    return res.status(200).json({
      msg: "Image added to gallery successfully",
      imageUrl,
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to process request" });
  }
});
router.get("/allPhotoGallery", async (req, res) => {
  try {
    const photo = await Gallery.find({});
    if (photo && photo.length > 0) {
      res.send(photo);
    }
  } catch (error) {
    res.status(200).json({
      error: "there is no notice",
    });
  }
});
router.get("/singleGallery/:id", async (req, res) => {
  try {
    const blog = await Gallery.findOne({ uniqueId: req.params.id });
    if (!blog) {
      return res.status(404).json({ msg: "image not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});
router.put("/editGallery/:id", upload.single("file"), async (req, res) => {

  try {
    const { title, description } = req.body;
    let updateData = { title, description };

    if (req.file) {
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png"];

      if (!validExtensions.includes(fileExtension)) {
        return res
          .status(400)
          .json({
            msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
          });
      }
      if (req.file) {
        // Ensure the uploads directory exists
        const uploadDir = path.join(__dirname, "uploads"); // Define the correct target folder path
        const file = req.file;
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
        }

        // Get file extension from the uploaded file
        const fileExtension = path.extname(file.originalname).toLowerCase(); // Get original file extension
        const validExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image formats

        // Check if the file extension is valid
        if (!validExtensions.includes(fileExtension)) {
          return res.status(400).json({
            msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
          });
        }

        // Rename the file with a timestamp and ensure it has a .jpg extension
        const fileName = `${Date.now()}.jpg`; // Save file as .jpg format
        const filePath = path.join(uploadDir, fileName); // Correct target file path

        // Move the file to the server's directory with the new name
        fs.renameSync(file.path, filePath);

        // Generate the image URL for the frontend
        const imageUrl = `http://localhost:5000/uploads/${fileName}`; // Update with your hosting URL

        if (imageUrl) {
          updateData.imgUrl = imageUrl;
        }
      }
    }

    const updatedGallery = await Gallery.findOneAndUpdate(
      { uniqueId: req.params.id },
      updateData,
      { new: true }
    );

    if (!updatedGallery) {
      return res.status(404).json({ msg: "Gallery item not found" });
    }

    res
      .status(200)
      .json({ msg: "Gallery updated successfully", updatedGallery });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Failed to process request" });
  }
});
router.delete("/deletePhotoGallery", async (req, res) => {
  const { id } = req.query; // Ensure this matches the ID passed from the frontend

  try {
    // Find the gallery entry in the database
    const gallery = await Gallery.findOne({ uniqueId: id });

    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Photo not found" });
    }

    // Extract filename from the image URL
    if (gallery.imgUrl) {
      const imagePath = path.join(
        __dirname,
        "uploads",
        path.basename(gallery.imgUrl)
      );

      // Check if the file exists before deleting
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file
      }
    }

    // Delete gallery record from the database
    await Gallery.findOneAndDelete({ uniqueId: id });

    res.json({
      success: true,
      message: "Photo and image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
router.post("/addnotice", uploads.single("file"), async (req, res) => {
  const { noticeTitle, description,category } = req.body;
  const file = req.file; // Uploaded file from `upload.single()`

  // Validate input fields
  if (!noticeTitle || !description || !file) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get file extension from the uploaded file
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png"];

    // Check if the file extension is valid
    if (!validExtensions.includes(fileExtension)) {
      return res.status(400).json({
        msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
      });
    }

    // Rename the file with a timestamp and retain its original extension
    const fileName = `${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Move the file to the uploads directory with the new name
    fs.renameSync(file.path, filePath);

    // Generate the image URL for the frontend
    const imageUrl = `http://localhost:5000/uploads/${fileName}`;

    // Generate a unique ID for the notice
    const uniqueId = await generateUniqueIdForNotice();

    // Save the notice record to the database
    const newNotice = new Notice({
      uniqueId,
      noticeTitle,
      description,
      category,
      imgUrl: imageUrl,
    });

    await newNotice.save();
    // NOTICE_EMAIL_NOTIFICATION: send notice email to approved & verified members
    try {
      const users = await User.find({
        emailVerified: true,
        designation: { $nin: ["unverified", "pending"] },
      }).select("email");
      const emails = users.map((u) => u.email).filter(Boolean);

      for (const email of emails) {
        await sendEmail({
          to: email,
          subject: `New Notice: ${noticeTitle}`,
          html: noticeEmailTemplate({ title: noticeTitle, description }),
          text: `${noticeTitle}\n\n${description}`,
        });
      }
    } catch (e) {
      console.error("Notice email notification failed:", e.message || e);
    }


    return res.status(200).json({
      msg: "Notice added successfully",
      uniqueId,
      imageUrl,

    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to process request" });
  }
});

router.get("/allNotice", async (req, res) => {
  try {
    const books = await Notice.find({}).sort({ date: -1, _id: -1 });
    if (books && books.length > 0) {
      res.send(books);
    }
  } catch (error) {
    res.status(200).json({
      error: "there is no notice",
    });
  }
});

router.get("/editnotice/:id", async (req, res) => {
  try {
    const notice = await Notice.findOne({ uniqueId: req.params.id });
    if (!notice) {
      return res.status(404).json({ msg: "Notice not found" });
    }
    res.status(200).json(notice);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});
const uploadss = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      return cb(
        new Error("Invalid file format. Only .jpg, .jpeg, .png allowed.")
      );
    }
    cb(null, true);
  },
});
// Route to update notice
router.put("/updatenotice/:id", upload.single("file"), async (req, res) => {
  try {
    const { noticeTitle, description,category } = req.body;

    // Find the notice by ID
    const notice = await Notice.findOne({ uniqueId: req.params.id });
    if (!notice) {
      return res.status(404).json({ msg: "Notice not found" });
    }

    let imageUrl = notice.imgUrl; // Use existing image URL if no new file is uploaded

    // If a new file is uploaded, update the image URL
    if (req.file) {
      // Ensure the uploads directory exists
      const uploadDir = path.join(__dirname, "uploads"); // Define the correct target folder path
      const file = req.file;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      // Get file extension from the uploaded file
      const fileExtension = path.extname(file.originalname).toLowerCase(); // Get original file extension
      const validExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image formats

      // Check if the file extension is valid
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
          msg: "Invalid file format. Only .jpg, .jpeg, .png allowed.",
        });
      }

      // Rename the file with a timestamp and ensure it has a .jpg extension
      const fileName = `${Date.now()}.jpg`; // Save file as .jpg format
      const filePath = path.join(uploadDir, fileName); // Correct target file path

      // Move the file to the server's directory with the new name
      fs.renameSync(file.path, filePath);

      // Generate the image URL for the frontend
      const imageUrl = `http://localhost:5000/uploads/${fileName}`; // Update with your hosting URL
      notice.imgUrl = imageUrl;
    }
    // Update notice fields
    notice.noticeTitle = noticeTitle || notice.noticeTitle;
    notice.description = description || notice.description;
    notice.category = category || notice.category;

    await notice.save();

    res.status(200).json({ msg: "Notice updated successfully" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Failed to update notice" });
  }
});
router.delete("/deleteNotice", async (req, res) => {
  const { id } = req.query; // Using query parameter 'id'

  try {
    // Find the notice in the database
    const notice = await Notice.findOne({ uniqueId: id });

    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    }

    // Extract filename from the image URL
    if (notice.imgUrl) {
      const imagePath = path.join(
        __dirname,
        "uploads",
        path.basename(notice.imgUrl)
      );

      // Check if the file exists before deleting
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the file
      }
    }

    // Delete notice record from the database
    await Notice.findOneAndDelete({ uniqueId: id });

    res.json({
      success: true,
      message: "Notice and image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/checkTotalReadBook", async (req, res) => {
  try {
    // Fetch requests with specific statuses and ensure they have a valid date
    const readBooks = await RentBook.find({
      status: { $in: ["approved", "Received", "Returned", "readed"] },
      date: { $exists: true }, // Ensure the date field exists
    });

    res.status(200).json({ readBooks });
  } catch (error) {
    console.error("Error fetching read books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the read books." });
  }
});
router.get("/checkMostReadBook", async (req, res) => {
  try {
    // Fetch books that have been read
    const readBooks = await RentBook.find({
      status: "readed",
      date: { $exists: true },
    });

    let sortedBooks = [];

    if (readBooks.length > 0) {
      // Count occurrences of each book
      const bookCount = {};
      readBooks.forEach((book) => {
        bookCount[book.bookId] = bookCount[book.bookId] || { count: 0 };
        bookCount[book.bookId] += 1;
      });

      // Convert to array, sort by read count in descending order, and get top 3 books
      sortedBooks = Object.entries(bookCount)
        .map(([bookId, count]) => ({ bookId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    } else {
      // If no books have been read, return 3 random books with only bookId
      const randomBooks = await RentBook.aggregate([{ $sample: { size: 3 } }]);
      sortedBooks = randomBooks.map((book) => ({
        bookId: book.bookId,
        count: 0,
      }));
    }
 
    res.status(200).json({ sortedBooks });
  } catch (error) {
    console.error("Error fetching read books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the read books." });
  }
});

router.get("/checkTotalReadBookThisMonth", async (req, res) => {
  try {
    // Fetch requests with specific statuses and ensure they have a valid date
    const readBooks = await RentBook.find({
      status: { $in: ["approved", "Received", "Returned", "readed"] },
      date: { $exists: true }, // Ensure the date field exists
    });

    res.status(200).json({ readBooks });
  } catch (error) {
    console.error("Error fetching read books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the read books." });
  }
});
router.get("/availableBook", async (req, res) => {
  try {
    // Fetch requests with specific statuses and ensure they have a valid date
    const readBooks = await RentBook.find({
      status: { $in: ["approved", "Received", "Returned"] },
      date: { $exists: true }, // Ensure the date field exists
    });

    res.status(200).json({ readBooks });
  } catch (error) {
    console.error("Error fetching read books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the read books." });
  }
});
router.get("/readedSingleBook", async (req, res) => {
  try {
    // Fetch requests with specific statuses and ensure they have a valid date
    const readBooks = await RentBook.find({
      status: { $in: ["Received", "Returned", "readed"] },
      date: { $exists: true }, // Ensure the date field exists
    });

    res.status(200).json({ readBooks });
  } catch (error) {
    console.error("Error fetching read books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the read books." });
  }
});

router.get("/requestDonationDetails", async (req, res) => {
  try {
    // Retrieve all membership data from the database
    const memberships = await DonationR.find();

    // Send the retrieved data as the response
    res.status(200).json(memberships);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    res.status(500).json({ message: "Error fetching memberships", error });
  }
});
router.delete("/deletealldonaton", async (req, res) => {
  try {
    // Delete all documents from the DonationR collection
    const memberships = await DonationR.find();
 
    await DonationR.deleteMany({});
  
    res
      .status(200)
      .json({ message: "All donations have been deleted successfully." });
  } catch (error) {
    console.error("Error deleting donations:", error);
    res.status(500).json({ message: "Error deleting donations", error });
  }
});

router.delete("/deleteAllBookInfo", async (req, res) => {
  try {
    // Delete all documents from the DonationR collection
    const memberships = await RentBook.find();
    
    await RentBook.deleteMany({});
  
    res
      .status(200)
      .json({ message: "All Book Information have been deleted successfully." });
  } catch (error) {
    console.error("Error deleting donations:", error);
    res.status(500).json({ message: "Error deleting donations", error });
  }
});

// Add a new FAQ using fetch API format (Corrected Route)
router.post("/addFaqs", async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res
      .status(400)
      .json({ message: "Question and answer are required" });
  }

  try {
    const faqs = new newFAQ({ question, answer });
    await faqs.save();
    res.status(201).json({ message: "FAQ added successfully", faq: newFAQ });
  } catch (error) {
    console.error("Error adding FAQ:", error); // Log error for debugging
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
router.get("/allFaqs", async (req, res) => {
  try {
    const photo = await newFAQ.find({});
    if (newFAQ && newFAQ.length > 0) {
      res.send(photo);
    }
  } catch (error) {
    res.status(200).json({
      error: "there is no notice",
    });
  }
});
router.delete("/deleteFaq/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the FAQ ID from the URL parameter
    const deletedFaq = await newFAQ.findByIdAndDelete(id); // Delete the FAQ by ID

    if (!deletedFaq) {
      return res.status(404).json({ error: "FAQ not found" }); // Handle case where FAQ is not found
    }

    res.status(200).json({ message: "FAQ deleted successfully" }); // Send success response
  } catch (error) {
    res.status(500).json({ error: "Failed to delete FAQ" }); // Handle server error
  }
});

// Update or add mission statement
router.post("/mission", async (req, res) => {
  try {
    const { mission } = req.body;
    if (!mission) {
      return res.status(400).json({ error: "Mission is required" });
    }

    let existingMission = await Mission.findOne();
    if (existingMission) {
      existingMission.mission = mission;
      await existingMission.save();
      res.json({ message: "Mission updated successfully" });
    } else {
      existingMission = new Mission({ mission });
      await existingMission.save();
      res.json({ message: "Mission added successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating mission" });
  }
});

// Optionally, handle PUT if needed
router.put("/mission", async (req, res) => {
  try {
    const { mission } = req.body;
    if (!mission) {
      return res.status(400).json({ error: "Mission is required" });
    }

    const existingMission = await Mission.findOne();
    if (existingMission) {
      existingMission.mission = mission;
      await existingMission.save();
      res.json({ message: "Mission updated successfully" });
    } else {
      res.status(404).json({ error: "Mission not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating mission" });
  }
});

router.post("/addTeamMember", upload.single("file"), async (req, res) => {
  const { Name, role, Mobile, email } = req.body;
  const file = req.file; // Uploaded file from Multer

  // Validate input fields
  if (!file) return res.status(400).json({ msg: "File is required" });
  if (!Name || !role) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "uploads"); // Define the target folder path

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Get file extension from the uploaded file
    const fileExtension = path.extname(file.originalname).toLowerCase(); // Get original file extension
    const validExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image formats

    // Check if the file extension is valid
    if (!validExtensions.includes(fileExtension)) {
      return res
        .status(400)
        .json({ msg: "Invalid file format. Only .jpg, .jpeg, .png allowed." });
    }

    // Rename the file with a timestamp
    const fileName = `${Date.now()}${fileExtension}`; // Save file with a timestamp
    const filePath = path.join(uploadDir, fileName); // Correct target file path

    // Move the file to the server's directory with the new name
    fs.renameSync(file.path, filePath);

    // Generate the image URL for the frontend
    const imageUrl = `http://localhost:5000/uploads/${fileName}`;

    // Save the team member record to the database
    const teamMember = new TeamMember({
      Name,
      role,
      Mobile,
      email,
      imgUrl: imageUrl,
    });

    await teamMember.save();

    return res.status(200).json({
      msg: "Team member added successfully",
      imageUrl,
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to process request" });
  }
});

router.delete("/deleteTeamMember/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the team member by ID
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({ msg: "Team member not found" });
    }

    // Extract image file path
    const filePath = path.join(
      __dirname,
      "uploads",
      path.basename(teamMember.imgUrl)
    );

    // Check if the file exists before deleting
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Remove the file from the server
    }

    // Delete team member record from the database
    await TeamMember.findByIdAndDelete(id);

    return res.status(200).json({ msg: "Team member deleted successfully" });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to process request" });
  }
});

router.get("/allTeamMembers", async (req, res) => {
  try {
    // Retrieve all team members from the database
    const teamMembers = await TeamMember.find();

    if (teamMembers.length === 0) {
      return res.status(404).json({ msg: "No team members found" });
    }

    return res.status(200).json({ teamMembers });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to process request" });
  }
});

router.post("/addevent", uploads.single("file"), async (req, res) => {
  const { eventname, organizer, description, eventDate, eventTime } = req.body;

  const file = req.file; // Uploaded file

  // Validate input fields
  if (!file) return res.status(400).json({ msg: "File is required" });
  if (!eventname || !organizer || !description || !eventDate || !eventTime) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Convert `totalAttendees` to number


  try {
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Validate file extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png"];
    if (!validExtensions.includes(fileExtension)) {
      return res
        .status(400)
        .json({ msg: "Invalid file format. Only .jpg, .jpeg, .png allowed." });
    }

    // Rename the file with a timestamp
    const fileName = `${Date.now()}.jpg`;
    const filePath = path.join(uploadDir, fileName);
    fs.renameSync(file.path, filePath);

    // Generate the image URL
    const imageUrl = `http://localhost:5000/uploads/${fileName}`;

    // Save event to the database
    const uniqueId = await generateEventUniqueId();
    const event = new Event({
      uniqueId,
      eventname,
      organizer,
      description,
      eventDate,
      eventTime,
      imgUrl: imageUrl,
    });

    await event.save();

    return res.status(200).json({
      msg: "Event added successfully",
      imageUrl,
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to process request" });
  }
});
router.get("/allEvent", async (req, res) => {
  try {
    const books = await Event.find({});
    if (books && books.length > 0) {
      res.send(books);
    }
  } catch (error) {
    res.status(200).json({
      error: "there is no notice",
    });
  }
});
router.put("/updateEvent/:id", upload.single("File"), async (req, res) => {
  const { eventname, organizer, description, eventDate, eventTime } = req.body;
  const file = req.file; // Uploaded file
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    let imageUrl = event.imgUrl; // Keep the old image if no new file is uploaded

    if (file) {
      // Validate file extension
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png"];
      if (!validExtensions.includes(fileExtension)) {
        return res
          .status(400)
          .json({ msg: "Invalid file format. Only .jpg, .jpeg, .png allowed." });
      }

      // Delete the old image
      if (event.imgUrl) {
        const oldImagePath = path.join(__dirname, "..", event.imgUrl.replace("http://localhost:5000/", ""));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const fileName = `${Date.now()}.jpg`;
      const filePath = path.join(__dirname, "..", "uploads", fileName);
      fs.renameSync(file.path, filePath);
      imageUrl = `http://localhost:5000/uploads/${fileName}`;
    }

    // Update event details
    event.eventname = eventname || event.eventname;
    event.organizer = organizer || event.organizer;
    event.description = description || event.description;
    event.eventDate = eventDate || event.eventDate;
    event.eventTime = eventTime || event.eventTime;
    event.imgUrl = imageUrl;

    await event.save();

    return res.status(200).json({ msg: "Event updated successfully", event });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to update event" });
  }
});

/**
 * 🗑 Delete Event API
 */
router.delete("/deleteEvent/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Delete the event image from the server
    if (event.imgUrl) {
      const imagePath = path.join(__dirname, "..", event.imgUrl.replace("http://localhost:5000/", ""));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Event deleted successfully" });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ msg: "Failed to delete event" });
  }
});

router.put("/updateTeamMember/:id", upload.single("file"), async (req, res) => {
  const { Name, role, Mobile, email } = req.body;
  const file = req.file;
  const { id } = req.params;

  try {
    const member = await TeamMember.findById(id);
    if (!member) return res.status(404).json({ msg: "Member not found" });

    const imageUrl = file ? `http://localhost:5000/uploads/${file.filename}` : member.imgUrl;

    await TeamMember.findByIdAndUpdate(id, { Name, role, Mobile, email, imgUrl: imageUrl });

    return res.json({ msg: "Team member updated successfully", imageUrl });
  } catch (error) {
    return res.status(500).json({ msg: "Error updating member" });
  }
});

// Approve User (Update designation)
router.patch("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ uniqueId: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        message: "User has not verified email yet. Please ask them to verify email first.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    user.designation = "member";
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const loginUrl = `${clientUrl}/login`;
    const approvalMessage =
      "Your account has been approved by our admin panel. You can log in to your account now.";

    sendEmail({
      to: user.email,
      subject: "Account Approved - MU CSE Society",
      html: `<p>${approvalMessage} <a href="${loginUrl}">login page</a></p>`,
      text: `${approvalMessage} Login: ${loginUrl}`,
    }).catch((error) => {
      console.error("Approval email send failed:", error?.message || error);
    });

    res.json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Reject User (Delete from database)
router.delete("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findOneAndDelete({ uniqueId: id });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User rejected and deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.patch("/promote/:userId", async (req, res) => {
  const { userId } = req.params;

  const { position, startDate, endDate } = req.body;

  // Validate the data
  if (!position || !startDate || !endDate) {
    return res.status(400).json({ message: "All fields (position, startDate, endDate) are required." });
  }

  try {
    // Find the user by uniqueId and update the fields
    const updatedUser = await User.findOneAndUpdate(
      { uniqueId: userId },
      { designation: position, startDate:startDate, endDate:endDate },
      { new: true } // Return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user
    res.status(200).json({ message: "User promoted successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});
router.delete("/deleteMember/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findOneAndDelete({ uniqueId: userId });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.get("/Allmemberprofile", async (req, res) => {
  try {
    const users = await User.find({ designation: "member" }); // Filter by designation
 
    
    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      res.status(404).json({ message: "No members found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching user profiles.",
    });
  }
});
router.get("/AllExecutiveprofile", async (req, res) => {
  try {
    const users = await User.find({
      designation: { $nin: ["member", "pending"] }, // Exclude "member" and "pending"
    });

    

    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      res.status(404).json({ message: "No eligible members found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching user profiles.",
    });
  }
});

router.post("/exicutiveCounsil", upload.single("profileImage"), async (req, res) => {
  try {
    // Generate hashed password
    const hashpassword = await bcrypt.hash(req.body.password, saltRounds);
    // Validate required fields
    if (!req.body.fullName || !req.body.email || !req.body.password) {
      return res.status(400).json({ msg: "Name, email, and password are required" });
    }
    // Generate a unique ID and check its uniqueness
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
      uniqueId = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
      const existingUser = await User.findOne({ uniqueId }); // Check uniqueness
      if (!existingUser) {
        isUnique = true;
      }
    }
    // Handle profile image upload
    const file = req.file; // Uploaded file from `upload.single()`
    if (file) {
      const uploadDir = path.join(__dirname, "uploads"); // Define the correct target folder path
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
      }
      const fileExtension = path.extname(file.originalname).toLowerCase(); // Get original file extension
      const validExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image formats
      // Check if the file extension is valid
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
          msg: "Invalid file format. Only .jpg, .jpeg, .png allowed."
       
        });
      }
      // Rename the file with a timestamp and ensure it has a .jpg extension
      const fileName = `${Date.now()}.jpg`; // Save file as .jpg format
      const filePath = path.join(uploadDir, fileName); // Correct target file path
      // Move the file to the server's directory with the new name
      fs.renameSync(file.path, filePath);
      // Generate image URL for frontend
      const imageUrl = `http://localhost:5000/uploads/${fileName}`; // Update with your hosting URL
      // Save user with profile image URL
      const newUser = new User({
        uniqueId, // Unique ID
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
        image: imageUrl, // Save image URL
        emailVerified: true,
        designation: req.body.designation,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      });

      await newUser.save();

      return res.status(200).json({
        message: "Signup was successful!",
        userId: uniqueId,
        imageUrl: imageUrl, // Return image URL
      });
    } else {
      // If no file is uploaded, create user without image
      const newUser = new User({
        uniqueId, // Unique ID
        name: req.body.fullName,
        email: req.body.email,
        mobile: req.body.mobile,
        permanentAddress: req.body.permanentAddress,
        currentAddress: req.body.currentAddress,
        linkedinId: req.body.linkedinId,
        batch: req.body.batch,
        id: req.body.id,
        password: hashpassword,
        emailVerified: true,
       
      });

      await newUser.save();

      return res.status(200).json({
        message: "Signup was successful without a profile image",
        userId: uniqueId,
        imageUrl: null, // No image URL
      });
    }

  } catch (error) {
    res.status(400).json({
      message: "Error in signing up",
      error: error.message,
    });
  }
});
// POST: update or insert permissions for multiple roles
router.post('/update', async (req, res) => {
  const rolesData = req.body;  // Received data: an object where keys are roles and values are permissions



  // Check if the rolesData is an object
  if (typeof rolesData !== 'object' || Array.isArray(rolesData)) {
    return res.status(400).json({ msg: 'Invalid data format. Expected an object with role as keys.' });
  }

  // Transform the received object into an array of { role, permissions }
  const roles = Object.keys(rolesData).map(role => ({
    role,
    permissions: rolesData[role]  // Permissions corresponding to each role
  }));



  try {
    for (const roleData of roles) {
      const { role, permissions } = roleData;

      // Check if role and permissions are present
      if (!role || !permissions) {
        return res.status(400).json({ msg: 'Role and permissions are required.' });
      }

      // Ensure permissions are in the correct format
      const validPermissions = {
        addNotice: permissions['Add Notice'] ?? false,
        addEvent: permissions['Add Event'] ?? false,
        addBlog: permissions['Add Blog'] ?? false,
        addGallery: permissions['Add Gallery'] ?? false,
        addTestimonial: permissions['Add Testimonial'] ?? false,
      };

  

      // Use findOneAndUpdate with upsert: true to create or update the role and permissions
      const updatedRole = await RolePermission.findOneAndUpdate(
        { role }, // Search by role
        { permissions: validPermissions }, // Update the permissions
        { upsert: true, new: true } // Create if not found
      );

  
    }

    res.json({ msg: 'Permissions updated successfully' });
  } catch (error) {
    console.error("Error updating permissions:", error);
    res.status(500).json({ msg: 'Error updating permissions' });
  }
});
router.get('/getPermissions', async (req, res) => {
  try {
    const roles = await RolePermission.find();  // Fetch all role permissions from the database
    res.json(roles);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ msg: 'Error fetching permissions' });
  }
});

router.get('/geRoletPermissions', async (req, res) => {
  try {
    const { role } = req.query; // Get the role from query parameters

    // If a role is provided, fetch only the permissions for that role
    if (role) {
      const rolePermissions = await RolePermission.findOne({ role });
      if (!rolePermissions) {
        return res.status(404).json({ msg: 'Role not found' });
      }
      return res.json(rolePermissions); // Return the permissions for that specific role
    }

    // If no role is provided, fetch all roles
    const roles = await RolePermission.find();  // Fetch all role permissions from the database
    res.json(roles);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ msg: 'Error fetching permissions' });
  }
});



module.exports = router;
