# Database Scripts

This directory contains utility scripts for managing the worship management database.

## Available Scripts

### 1. Create Admin User

Creates an admin user in the database with default or custom credentials.

#### Usage

**Default Admin User:**

```bash
npm run create-admin
```

**JavaScript Version:**

```bash
npm run create-admin:js
```

#### Default Admin Credentials

- **Email:** admin@worship.com
- **Password:** admin123
- **Role:** ADMIN
- **Key:** C

#### Tag Format

Tags in the system use forward slash (`/`) as separators instead of commas. For example:

- `hymn / traditional / grace`
- `contemporary / worship / praise`
- `worship / surrender / intimate`

#### Custom Admin User

To create a custom admin user, modify the `scripts/create-admin.ts` file:

```typescript
// Uncomment and modify this section in the main() function
await createAdminUser({
  name: "Your Name",
  email: "your-email@example.com",
  password: "your-password",
  key: "G", // Optional: preferred musical key
});
```

#### Features

- ✅ **Duplicate Prevention:** Won't create duplicate admin users
- ✅ **Password Hashing:** Securely hashes passwords using bcrypt
- ✅ **Flexible Configuration:** Supports custom user data
- ✅ **Error Handling:** Provides clear error messages
- ✅ **Database Safety:** Properly disconnects from database

#### Output Example

```
✅ Admin user created successfully!
Email: admin@worship.com
Name: Admin User
Role: ADMIN
Key: C
Password: admin123

⚠️  Please change the password after first login!
```

## Security Notes

1. **Change Default Password:** Always change the default password after first login
2. **Environment Variables:** Ensure your database connection is properly configured
3. **Access Control:** Limit access to these scripts in production environments

## Troubleshooting

### Common Issues

1. **Database Connection Error:**

   - Ensure your `.env` file has the correct `DATABASE_URL`
   - Check if the database server is running

2. **User Already Exists:**

   - The script will show existing user details instead of creating a new one
   - To create a different admin, modify the email in the script

3. **Permission Errors:**
   - Ensure you have write permissions to the database
   - Check database user permissions

### Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Verify your database connection
3. Ensure all dependencies are installed (`npm install`)
