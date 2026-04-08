export const notFound = (req, res, next) => {
  const error = new Error(`Route introuvable : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || 'Erreur serveur inattendue.',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
};
