export function notFound(req, res) {
  res.status(404).json({ message: 'Resource not found' });
}

export function errorHandler(error, req, res, next) {
  if (error?.code === 11000) return res.status(409).json({ message: 'A unique value is already in use' });
  if (error?.name === 'ValidationError') return res.status(400).json({ message: 'Please check the submitted fields' });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong' });
}

