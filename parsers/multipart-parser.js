const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');

/**
 * Asynchronous function to parse a multipart form data request and extract fields and files.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the callback function
 * @return {Promise} a Promise that resolves when the parsing is complete
 */
const multipartParser = async (req, res, next) => {
  try {
    if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/form-data')) {
      return next();
    }
    const busboy = new Busboy({ headers: req.headers });
    const formData = {
      fields: {},
      files: {}
    };

    return new Promise((resolve, reject) => {
      busboy.on('field', (fieldname, value) => {
        formData.fields[fieldname] = value;
      });

      busboy.on('file', (fieldname, fileStream, filename, encoding, mimetype) => {
        const filePath = path.join(__dirname, '../../uploads', filename);
        const fileWriteStream = fs.createWriteStream(filePath);

        fileStream
          .pipe(fileWriteStream)
          .on('error', reject)
          .on('finish', () => {
            formData.files[fieldname] = {
              filename,
              contentType: mimetype,
              path: filePath
            };
          });
      });


      busboy.on('finish', () => {
        req.body = formData.fields;
        req.files = formData.files;
        resolve();
      });

      busboy.on('error', reject);

      req.pipe(busboy);
    }).then(() => {
      next();
    }).catch(next);
  } catch (err) {
    next(err);
  }
};
  
  module.exports = multipartParser;
