# PostgreSQL Installation Guide

## Windows Installation

### Method 1: Official Installer (Recommended)

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   Or via https://www.enterprisedb.com/downloads/postgres-postgresql-downloads 
   - Download the latest version installer
   - Run the installer

2. **Installation Steps**
   - Choose installation directory (default is fine)
   - Select components to install:
     - ✅ PostgreSQL Server
     - ✅ pgAdmin 4 (GUI tool)
     - ✅ Command Line Tools
     - ✅ Stack Builder (optional)
   - Choose data directory (default is fine)
   - **Set a password** for the postgres superuser (remember this!)
   - Port: 5432 (default)
   - Locale: Default locale

3. **Verify Installation**
   ```bash
   # Open Command Prompt or PowerShell
   psql --version
   ```

### Method 2: Using Chocolatey

```bash
# If you have Chocolatey installed
choco install postgresql
```

## macOS Installation

### Method 1: Homebrew (Recommended)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create your user database
createdb `whoami`
```

### Method 2: Postgres.app

1. Download from: https://postgresapp.com/
2. Move to Applications folder
3. Double-click to start
4. Click "Initialize" to create a new server

## Linux Installation

### Ubuntu/Debian

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -i -u postgres
psql
```

### Fedora/RHEL/CentOS

```bash
# Install PostgreSQL
sudo dnf install postgresql-server postgresql-contrib

# Initialize database
sudo postgresql-setup --initdb

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Post-Installation Setup

### 1. Access PostgreSQL

**Windows:**
```bash
# Using psql
psql -U postgres

# You'll be prompted for the password you set during installation
```

**macOS/Linux:**
```bash
# Switch to postgres user (Linux)
sudo -u postgres psql

# Or directly (if configured)
psql postgres
```

### 2. Create Your First Database

```sql
-- Create a new database for practice
CREATE DATABASE sql_practice;

-- Connect to the database
\c sql_practice

-- Create a new user (optional)
CREATE USER your_username WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sql_practice TO your_username;
```

### 3. Configure Environment Variables (Optional)

**Windows:**
1. Search for "Environment Variables"
2. Add to PATH: `C:\Program Files\PostgreSQL\15\bin`

**macOS/Linux:**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export PATH="/usr/local/opt/postgresql@15/bin:$PATH"
```

## Troubleshooting

### Issue: "psql: command not found"
- **Solution**: PostgreSQL bin directory is not in PATH. Add it manually or reinstall.

### Issue: "Connection refused"
- **Solution**: PostgreSQL service is not running
  - Windows: Check Services app
  - macOS: `brew services start postgresql@15`
  - Linux: `sudo systemctl start postgresql`

### Issue: "Password authentication failed"
- **Solution**: Reset postgres password
  ```bash
  # Windows (as admin)
  psql -U postgres
  ALTER USER postgres PASSWORD 'new_password';
  ```

## GUI Tools (Optional)

### pgAdmin 4
- Comes with PostgreSQL installer on Windows
- Download separately: https://www.pgadmin.org/

### DBeaver
- Universal database tool
- Download: https://dbeaver.io/

### TablePlus
- Modern database GUI (paid, with free tier)
- Download: https://tableplus.com/

## Next Steps

Once PostgreSQL is installed and running:
1. Read `getting-started.md` for basic commands
2. Start with Exercise 1 in the `exercises/` folder
3. Practice, practice, practice!

## Useful Resources

- Official Documentation: https://www.postgresql.org/docs/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/
- SQL Practice: https://pgexercises.com/
