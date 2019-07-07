require('dotenv').config()

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    define: {
      underscored: true,
      timestamps: false
    }
  },
  test: {
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || null,
    database: process.env.MYSQL_TEST_DATABASE || 'testdb',
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      timestamps: false
    }
  },
  production: {
    use_env_variable: 'JAWSDB_URL',
    dialect: 'mysql',
    define: {
      underscored: true,
      timestamps: false
    }
  }
}
