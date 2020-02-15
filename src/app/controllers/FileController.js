import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname, filename } = req.file;

    const file = await File.create({
      original_name: originalname,
      file_name: filename,
    });

    return res.json(file);
  }
}

export default new FileController();
