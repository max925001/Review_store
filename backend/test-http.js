import app from './src/app.js';
import pool, { query } from './src/config/database.js';
import bcrypt from 'bcrypt';

const PORT = 5001;

const run = async () => {
  const server = app.listen(PORT, async () => {
    console.log(`Test server listening on port ${PORT}`);
    try {
      // 1. Clean up old test data
      console.log('Cleaning up...');
      await query("DELETE FROM users WHERE email IN ('test_admin_http@example.com', 'test_owner_http@example.com')");

      // 2. Create admin user
      console.log('Seeding admin user...');
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      await query(
        `INSERT INTO users (name, email, password, address, role) 
         VALUES ('Test Admin HTTP', 'test_admin_http@example.com', $1, 'Admin HQ', 'ADMIN')`,
        [hashedPassword]
      );

      // 3. Log in as admin to get cookie
      console.log('Logging in...');
      const loginRes = await fetch(`http://localhost:${PORT}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test_admin_http@example.com',
          password: 'Password123!'
        })
      });

      console.log('Login status:', loginRes.status);
      const cookieHeader = loginRes.headers.get('set-cookie');
      console.log('Set-Cookie header:', cookieHeader);

      if (!cookieHeader) {
        throw new Error('No cookie returned from login');
      }

      // Extract accessToken cookie
      const cookies = cookieHeader.split(',').map(c => c.trim().split(';')[0]);
      const accessTokenCookie = cookies.find(c => c.startsWith('accessToken='));
      console.log('Access token cookie:', accessTokenCookie);

      // 4. Create new store owner as admin
      console.log('Creating store owner...');
      const createRes = await fetch(`http://localhost:${PORT}/api/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': accessTokenCookie
        },
        body: JSON.stringify({
          name: 'Test Owner HTTP',
          email: 'test_owner_http@example.com',
          password: 'Password123!',
          address: 'Owner Address',
          role: 'STORE_OWNER'
        })
      });

      console.log('Create user status:', createRes.status);
      const createBody = await createRes.json();
      console.log('Create user body:', JSON.stringify(createBody, null, 2));

      // 5. Query DB to verify
      console.log('Verifying DB entries...');
      const userRows = await query("SELECT * FROM users WHERE email = 'test_owner_http@example.com'");
      console.log('Users table count:', userRows.rowCount);
      if (userRows.rowCount > 0) {
        console.log('User role:', userRows.rows[0].role);
      }

      const employeeRows = await query("SELECT * FROM employees WHERE email = 'test_owner_http@example.com'");
      console.log('Employees table count:', employeeRows.rowCount);
      if (employeeRows.rowCount > 0) {
        console.log('Employee details:', employeeRows.rows[0]);
      }

      // 6. Final Clean up
      console.log('Final clean up...');
      await query("DELETE FROM users WHERE email IN ('test_admin_http@example.com', 'test_owner_http@example.com')");

    } catch (err) {
      console.error('Test failed with error:', err);
    } finally {
      server.close(async () => {
        await pool.end();
        console.log('Server and pool closed');
      });
    }
  });
};

run();
