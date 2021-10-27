import path from 'path';
export const getPathForTemplate = (templatePath: string, env = '') => {
  if (env === 'LAMBDA') {
    return path.resolve(
      process.env.LAMBDA_TASK_ROOT,
      '_optimize',
      process.env.AWS_LAMBDA_FUNCTION_NAME,
      `src/mail/templates/${templatePath}`,
    );
  }
  return `./${templatePath}`;
};

export const getPathForImage = (filename: string, env = '') => {
  if (env === 'LAMBDA') {
    return path.resolve(
      process.env.LAMBDA_TASK_ROOT,
      '_optimize',
      process.env.AWS_LAMBDA_FUNCTION_NAME,
      `src/mail/assets/${filename}`,
    );
  }
  return path.join(__dirname, `../mail/assets/${filename}`);
};
