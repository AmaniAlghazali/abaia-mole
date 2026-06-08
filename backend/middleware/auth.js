const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'غير مصرح به، يرجى تسجيل الدخول' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'صلاحية مدير مطلوبة' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'رمز الدخول غير صالح أو منتهي' });
  }
};

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'غير مصرح به، يرجى تسجيل الدخول' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'رمز الدخول غير صالح أو منتهي' });
  }
};

module.exports = { verifyAdmin, verifyToken };
