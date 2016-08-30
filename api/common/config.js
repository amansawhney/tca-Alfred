module.exports = {
 mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/',
 mongoDbName: 'tca_db',
 secret:'8b8d37254f12372637eaaeac3d36ceeaf',
 support_email: 'support@tca.com',
 admin_username: 'admin',
 check_max_interval: 240,
 check_min_interval: 15,
 encryption_algorithm:'aes-256-ctr',
 encryption_password:'a1e31f3q',
 json_file_path: '/Users/gagandeepsawhney/Development/miscProjects/tca-Alfred/sample/data_encrypted.json',
};
