const { Sequelize } = require("sequelize");
require("dotenv").config({ quiet: true });

// Configuration for Sequelize CLI (migrations)
const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  },
};

// For Sequelize CLI (migrations) - export the config object
if (require.main !== module) {
  module.exports = config;
} else {
  // For direct app usage - create and export Sequelize instance
  let sequelize;

  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl:
          process.env.DB_SSL === "true"
            ? {
                require: true,
                rejectUnauthorized: false,
              }
            : false,
      },
    });
  } else {
    const env = process.env.NODE_ENV || "development";
    const dbConfig = config[env];

    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        dialectOptions: dbConfig.dialectOptions,
      }
    );
  }

  module.exports = sequelize;
}
