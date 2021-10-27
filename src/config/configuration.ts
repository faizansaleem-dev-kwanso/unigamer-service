export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  session: {
    secret: process.env.SESSION_SECRET,
  },
  database: {
    mongouri: process.env.MONGO_URL,
  },
  s3: {
    awsConfig: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_ACCESS_SECRET,
      region: process.env.AWS_S3_REGION,
      // ... any options you want to pass to the AWS instance
    },
    bucket: process.env.MEDIA_BUCKET_NAME,
    basePath: 'media',
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});
