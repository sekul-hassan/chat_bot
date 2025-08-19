const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads");

        // ✅ directory না থাকলে বানাও
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userEmail = req.user.email.replace(/[@.]/g, "_"); // email কে safe নাম বানাও
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now();

        cb(null, `${userEmail}_${uniqueSuffix}${ext}`);
    },
});

const upload = multer({ storage });

// ❌ এখানে single("document") না করে শুধু multer instance export করো
module.exports = upload;
