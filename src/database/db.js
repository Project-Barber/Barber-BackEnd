import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  options: '-c search_path=barber'
});

const conectDataBase = async () => {
  try {
      console.log('\nConnecting to database...');
      await pool.query('SELECT 1');
      console.log('Connected to database\n');
  }catch(error) {
      console.log('Error connecting to database:', error);
  };
};

export {pool, conectDataBase};
