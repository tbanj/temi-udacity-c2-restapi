require('dotenv').config();

export const config = {
  "dev": {
    "username": process.env.POSTGRES_USERNAME_DEV,
    "password": process.env.POSTGRES_PASSWORD_DEV,
    "database": process.env.POSTGRES_DATABASE_NAME_DEV,
    "host": process.env.POSTGRESS_HOST_NAME_DEV,
    "dialect": "postgres",
    "aws_region": process.env.AWS_REGION_DEV,
    "aws_profile": process.env.AWS_PROFILE_DEV,
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET_DEV,
    "jwt": {
      "secret": "helloworld",
    }
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }
}
