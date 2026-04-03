const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri || uri === 'your_mongodb_connection_string_here') {
        console.error(
            '\n[DB] MONGO_URI is not set.\n' +
            'Create a .env file in the backend directory and set:\n' +
            '  MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority\n' +
            'Get a free cluster at https://www.mongodb.com/atlas\n'
        );
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('MongoDB connected');
    } catch (err) {
        const isSrvError =
            err.message && (err.message.includes('querySrv') || err.message.includes('ENOTFOUND'));

        if (isSrvError) {
            console.error(
                '\n[DB] MongoDB SRV DNS lookup failed. Common causes:\n' +
                '  1. The cluster hostname in MONGO_URI is wrong or the cluster does not exist.\n' +
                '     Double-check the connection string in your MongoDB Atlas dashboard:\n' +
                '     Database > Connect > Drivers > copy the connection string.\n' +
                '  2. Your IP address is not whitelisted in Atlas Network Access.\n' +
                '     Add your current IP (or 0.0.0.0/0 for dev) under:\n' +
                '     Security > Network Access > Add IP Address.\n' +
                '  3. A firewall or proxy is blocking outbound DNS/TCP on port 27017.\n' +
                '\nOriginal error:', err.message, '\n'
            );
        } else {
            console.error('MongoDB connection error:', err);
        }

        process.exit(1);
    }
};

module.exports = connectDB;