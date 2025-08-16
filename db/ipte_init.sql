-- ==========================================
-- 1. Tạo user và database
-- ==========================================
DROP DATABASE IF EXISTS ipte;
DROP USER IF EXISTS admin;

CREATE USER admin WITH PASSWORD 'admin';
CREATE DATABASE ipte OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE ipte TO admin;

-- ==========================================
-- 2. Kết nối vào database ipte
-- ==========================================
\c ipte

-- ==========================================
-- 3. Tạo bảng với cột common
-- ==========================================

-- Bảng roles
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng permissions
DROP TABLE IF EXISTS permissions;
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) UNIQUE NOT NULL,
    permission_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng posts
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng users_roles (quan hệ nhiều-nhiều)
DROP TABLE IF EXISTS users_roles;
CREATE TABLE users_roles (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1,
    PRIMARY KEY (user_id, role_id)
);

-- Bảng roles_permissions (quan hệ nhiều-nhiều)
DROP TABLE IF EXISTS roles_permissions;
CREATE TABLE roles_permissions (
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(permission_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1,
    PRIMARY KEY (role_id, permission_id)
);

-- ==========================================
-- 4. Gán quyền cho user admin
-- ==========================================
GRANT ALL PRIVILEGES ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO admin;

-- ==========================================
-- 5. Insert dữ liệu mẫu
-- ==========================================
INSERT INTO roles (role_name, role_description, created_by)
VALUES ('ADMIN', 'Quản trị hệ thống', 'system'),
       ('USER', 'Người dùng thông thường', 'system');

INSERT INTO permissions (permission_name, permission_description, created_by)
VALUES ('CREATE_POST', 'Tạo bài viết', 'system'),
       ('EDIT_POST', 'Chỉnh sửa bài viết', 'system'),
       ('DELETE_POST', 'Xóa bài viết', 'system'),
       ('VIEW_POST', 'Xem bài viết', 'system');

INSERT INTO users (username, password, email, full_name, created_by)
VALUES ('admin', 'admin123', 'admin@ipte.edu.vn', 'Administrator', 'system');

INSERT INTO users_roles (user_id, role_id, created_by)
SELECT u.user_id, r.role_id, 'system'
FROM users u, roles r
WHERE u.username = 'admin' AND r.role_name = 'ADMIN';
