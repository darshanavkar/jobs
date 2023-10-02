import express from 'express';
import multer from 'multer';

// Create a multer instance for file uploads
export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files'); // Destination directory for uploaded files
    },
    filename(req, file, cb) {
      // Generate a unique filename using current timestamp and original filename
      const timestamp = new Date().getTime();
      const originalName = file.originalname;
      const extension = originalName.split('.').pop();
      const uniqueFilename = `${timestamp}_${originalName}`;
      cb(null, uniqueFilename);
    },
  }),
  limits: {
    fileSize: 1000000, // Max file size: 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'Only upload files with jpg, jpeg, png, pdf, doc, docx, xlsx, xls format.'
        )
      );
    }
    cb(null, true); // Continue with upload if the file format is valid
  },
});
