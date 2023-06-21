export default () => ({
  port: parseInt(process.env.PORT, 10) || 5001,
  database: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    type: process.env.DB_TYPE,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
  },
});
