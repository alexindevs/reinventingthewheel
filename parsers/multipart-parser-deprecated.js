const multipartParserDeprecated = async (req, res, next) => {
    try {
      if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
        const boundary = extractBoundary(req.headers['content-type']);
    
        if (!boundary) {
          throw new Error('Invalid or missing multipart boundary');
        }
    
        let body = '';
    
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
    
        req.on('end', async () => {
          if (!body) {
            throw new Error('Empty request body');
          }
    
          const parts = body.split(`--${boundary}`);
    
          parts.shift();
          parts.pop();
    
          const formData = {
            fields: {},
            files: {}
          };
    
          for (const part of parts) {
            const [headers, content] = part.split('\r\n\r\n');
            const headersObj = parseHeaders(headers);
            const disposition = headersObj['Content-Disposition'];
    
            if (!disposition) {
              continue;
            }
    
            const filenameMatch = disposition.match(/filename="([^"]+)"/);
            const fieldNameMatch = disposition.match(/name="([^"]+)"/);
    
            if (filenameMatch) {
              // File upload part
              const filename = filenameMatch[1];
              const contentDisposition = parseContentDisposition(disposition);
              const contentType = headersObj['Content-Type'];
              const fileContent = content.trim().slice(0, -2);
    
              formData.files[contentDisposition.name] = {
                filename,
                contentType,
                content: fileContent
              };
    
              const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
              await fs.writeFile(filePath, fileContent);
            } else if (fieldNameMatch) {
              const fieldName = fieldNameMatch[1];
              const fieldValue = content.trim().slice(0, -2);
              formData.fields[fieldName] = fieldValue;
            }
          }
    
          req.body = formData.fields;
          req.files = formData.files;
    
          next();
        });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
  

const parseHeaders = (headerString) => {
    const headers = {};
  
    headerString.split('\r\n').forEach((line) => {
      const [key, value] = line.split(': ');
      headers[key] = value;
    });
  
    return headers;
  };
  
  const parseContentDisposition = (disposition) => {
    const contentDisposition = {}; 
    const params = disposition.split(';');
  
    params.shift();
  
    params.forEach((param) => {
      const [key, value] = param.trim().split('=');
      contentDisposition[key] = value.replace(/"/g, '');
    });
  
    return contentDisposition;
  };
