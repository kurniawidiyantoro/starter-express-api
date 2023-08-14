const { userGameModel } = require('../models/UserGameModel')
const multer = require("multer");
const admin = require("../lib/FirebaseAdmin");
const storage = admin.storage().bucket();
const fs = require('fs');

const upload = multer({ dest: "./uploads" }); 

class FirebaseController {
  static async uploadImage(req, res) {
    upload.single("profilepic")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: "Error processing the file upload" });
      } else if (err) {
        return res.status(500).json({ message: "Error uploading the file" });
      }

      const { username, email, password, confirmPassword, scores } = req.body;
      const file = req.file;

      const userGame = await userGameModel.getUserGame(email);
      const id = userGame.id;

      console.log('ID adalah:', id);

      if (!file) {
        return res.status(400).json({ message: "No photo provided" });
      }

      if (!username) {
        return res.status(400).json({ message: "Username not provided" });
      }

      const oldPath = file.path;
      const fileExtension = (file.originalname && typeof file.originalname === "string" && file.originalname !== "")
        ? file.originalname.split(".").pop()
        : null;
      const newFilename = `avatar_${id}.${fileExtension}`;
      const newPath = `./uploads/${newFilename}`;

      fs.rename(oldPath, newPath, async (renameErr) => {
        if (renameErr) {
          console.error("Error renaming the uploaded file:", renameErr);
          return res.status(500).json({ message: "Error renaming the uploaded file" });
        }
        try {
          await storage.upload(newPath, {
            destination: `avatars/${newFilename}`,
          });

          fs.unlink(newPath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error removing the temp file:", unlinkErr);
            }
          });

          return res.status(200).json({ message: "File uploaded successfully" });
        } catch (uploadError) {
          console.error("Error uploading file to Firebase Storage:", uploadError);
          return res.status(500).json({ message: "Error uploading file to Firebase Storage" });
        }
      });
    });
  }

  static async getProfilePicUrl(req, res) {
    try {
      const id = userGame.id;
      console.log("id:", id) 
      const fileFormats = ['png', 'jpg', 'jpeg']; // format file
      let profilePicUrl = null;

      for (const format of fileFormats) {
        console.log('format: ',format);
        const profilePicRef = storage.file(`avatars/avatar_${id}.${format}`);
        const url = await profilePicRef.getSignedUrl({
          action: 'read',
          expires: '03-01-2025',
        });

        // Check url, kalok ada break the loop
        if (url && url.length > 0) {
          profilePicUrl = url[0];
          break;
        }
      }

      if (profilePicUrl) {
        return res.status(200).json({ url: profilePicUrl });
      } else {
        return res.status(404).json({ message: "Profile picture not found" });
      }
    } catch (error) {
      console.error('Error fetching profile picture URL:', error);
      return null;
    }
  }
  
  
}

module.exports = { FirebaseController };
