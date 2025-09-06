-- Bảng role
DROP TABLE IF EXISTS role;
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng permission
DROP TABLE IF EXISTS permission;
CREATE TABLE permission (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) UNIQUE NOT NULL,
    permission_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1
);

-- Bảng user
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
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

-- Bảng user_role (quan hệ nhiều-nhiều)
DROP TABLE IF EXISTS user_role;
CREATE TABLE user_role (
    user_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES role(role_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1,
    PRIMARY KEY (user_id, role_id)
);

-- Bảng role_permission (quan hệ nhiều-nhiều)
DROP TABLE IF EXISTS role_permission;
CREATE TABLE role_permission (
    role_id INT REFERENCES role(role_id) ON DELETE CASCADE,
    permission_id INT REFERENCES permission(permission_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    version INT DEFAULT 1,
    PRIMARY KEY (role_id, permission_id)
);



-- =========================================================
-- ENUM helpers (tạo nếu chưa tồn tại, giá trị IN HOA)
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_level') THEN
    CREATE TYPE course_level AS ENUM ('BEGINNER','INTERMEDIATE','ADVANCED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_mode') THEN
    CREATE TYPE course_mode AS ENUM ('ONLINE','OFFLINE','HYBRID');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publish_status') THEN
    CREATE TYPE publish_status AS ENUM ('DRAFT','PUBLISHED','ARCHIVED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollment_status') THEN
    CREATE TYPE enrollment_status AS ENUM ('INTERESTED','REGISTERED','IN_PROGRESS','COMPLETED','CANCELLED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('UNPAID','PAID','PARTIAL','REFUNDED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_method') THEN
    CREATE TYPE contact_method AS ENUM ('PHONE','EMAIL','ZALO','MESSENGER','WHATSAPP','OTHER');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'consult_status') THEN
    CREATE TYPE consult_status AS ENUM ('PENDING','CONTACTED','SCHEDULED','CLOSED','CONVERTED');
  END IF;
END $$;


-- =========================================================
-- 1) course: thông tin khóa học
-- =========================================================
CREATE TABLE IF NOT EXISTS course (
  course_id         SERIAL PRIMARY KEY,
  course_code       VARCHAR(50) UNIQUE,
  course_name       VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) UNIQUE,
  short_description TEXT,
  description       TEXT,
  level             course_level NOT NULL DEFAULT 'BEGINNER',
  mode              course_mode  NOT NULL DEFAULT 'ONLINE',
  language          VARCHAR(50)  DEFAULT 'en',
  price             NUMERIC(12,2) DEFAULT 0,
  duration_hours    INT,
  start_date        DATE,
  end_date          DATE,
  image_url         TEXT,

  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by        VARCHAR(50),
  updated_by        VARCHAR(50),
  version           INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_course_slug ON course(slug);
CREATE INDEX IF NOT EXISTS idx_course_level ON course(level);
CREATE INDEX IF NOT EXISTS idx_course_mode  ON course(mode);

-- =========================================================
-- 2) student: học viên đã đăng ký thành công
--    (liên kết với bảng user để tái sử dụng tài khoản đăng nhập)
-- =========================================================
CREATE TABLE IF NOT EXISTS student (
  student_id  SERIAL PRIMARY KEY,
  user_id     INT UNIQUE NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
  phone       VARCHAR(30),
  dob         DATE,
  address     TEXT,
  note        TEXT,

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by  VARCHAR(50),
  updated_by  VARCHAR(50),
  version     INT DEFAULT 1
);

-- =========================================================
-- 3) enrollment: lần ghi danh/đăng ký vào khóa học
--    (giúp quản lý trạng thái tiến độ & thanh toán)
-- =========================================================
CREATE TABLE IF NOT EXISTS enrollment (
  enrollment_id   SERIAL PRIMARY KEY,
  student_id      INT NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
  course_id       INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
  status          enrollment_status NOT NULL DEFAULT 'REGISTERED',
  payment_status  payment_status    NOT NULL DEFAULT 'UNPAID',
  payment_amount  NUMERIC(12,2) DEFAULT 0,
  registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at      TIMESTAMP,
  completed_at    TIMESTAMP,

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by      VARCHAR(50),
  updated_by      VARCHAR(50),
  version         INT DEFAULT 1,

  CONSTRAINT uq_enrollment UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollment_student ON enrollment(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_course  ON enrollment(course_id);

-- =========================================================
-- 4) review: đánh giá của học viên về khóa học
--    (chỉ 1 review/1 học viên/1 khóa)
-- =========================================================
CREATE TABLE IF NOT EXISTS review (
  review_id   SERIAL PRIMARY KEY,
  course_id   INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
  student_id  INT NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(255),
  content     TEXT,
  is_approved BOOLEAN DEFAULT FALSE,

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by  VARCHAR(50),
  updated_by  VARCHAR(50),
  version     INT DEFAULT 1,

  CONSTRAINT uq_review UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_review_course ON review(course_id);
CREATE INDEX IF NOT EXISTS idx_review_student ON review(student_id);


-- =========================================================
-- 5) consultation_request: người quan tâm / cần tư vấn
-- =========================================================
CREATE TABLE IF NOT EXISTS consultation_request (
  consultation_request_id SERIAL PRIMARY KEY,
  full_name       VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  phone           VARCHAR(30),
  course_id       INT REFERENCES course(course_id) ON DELETE SET NULL,
  message         TEXT,
  contact_method  contact_method,
  status          consult_status NOT NULL DEFAULT 'PENDING',
  preferred_time  TIMESTAMP,
  source          VARCHAR(50),              -- web form, hotline, facebook, ...
  assigned_to     INT REFERENCES "user"(user_id) ON DELETE SET NULL, -- sale tư vấn

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by      VARCHAR(50),
  updated_by      VARCHAR(50),
  version         INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_consult_status ON consultation_request(status);
CREATE INDEX IF NOT EXISTS idx_consult_course  ON consultation_request(course_id);


-- =========================================================
-- 6) news: tin tức tiếng Anh (SEO-friendly bằng slug)
-- =========================================================
CREATE TABLE IF NOT EXISTS news (
  news_id     SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) UNIQUE NOT NULL,
  summary     TEXT,
  content     TEXT NOT NULL,
  cover_image_url TEXT,
  status      publish_status NOT NULL DEFAULT 'DRAFT',
  published_at TIMESTAMP,
  author_id   INT REFERENCES "user"(user_id) ON DELETE SET NULL,

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by  VARCHAR(50),
  updated_by  VARCHAR(50),
  version     INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);

-- =========================================================
-- 7) knowledge: bài giảng/kiến thức học tiếng Anh
-- =========================================================
CREATE TABLE IF NOT EXISTS knowledge (
  knowledge_id  SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) UNIQUE NOT NULL,
  content       TEXT NOT NULL,
  cover_image_url TEXT,
  status        publish_status NOT NULL DEFAULT 'DRAFT',
  published_at  TIMESTAMP,
  author_id     INT REFERENCES "user"(user_id) ON DELETE SET NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by    VARCHAR(50),
  updated_by    VARCHAR(50),
  version       INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_knowledge_status ON knowledge(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_published_at ON knowledge(published_at);


-- =========================================================
-- 8) comment: bình luận cho course / news / knowledge
--    Dùng 3 FK nullable + CHECK để đảm bảo chỉ gắn 1 loại mục tiêu.
-- =========================================================
CREATE TABLE IF NOT EXISTS comment (
  comment_id   SERIAL PRIMARY KEY,
  user_id      INT REFERENCES "user"(user_id) ON DELETE SET NULL,
  course_id    INT REFERENCES course(course_id) ON DELETE CASCADE,
  news_id      INT REFERENCES news(news_id) ON DELETE CASCADE,
  knowledge_id INT REFERENCES knowledge(knowledge_id) ON DELETE CASCADE,
  parent_comment_id INT REFERENCES comment(comment_id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  is_approved  BOOLEAN DEFAULT TRUE,

  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by   VARCHAR(50),
  updated_by   VARCHAR(50),
  version      INT DEFAULT 1,

  CHECK (num_nonnulls(course_id, news_id, knowledge_id) = 1)
);

CREATE INDEX IF NOT EXISTS idx_comment_course    ON comment(course_id);
CREATE INDEX IF NOT EXISTS idx_comment_news      ON comment(news_id);
CREATE INDEX IF NOT EXISTS idx_comment_knowledge ON comment(knowledge_id);
CREATE INDEX IF NOT EXISTS idx_comment_parent    ON comment(parent_comment_id);

-- =========================================================
-- 9) about_me: thông tin doanh nghiệp / trung tâm
-- =========================================================
CREATE TABLE IF NOT EXISTS about_me (
  about_id     SERIAL PRIMARY KEY,
  org_name     VARCHAR(255),
  description  TEXT,
  mission      TEXT,
  vision       TEXT,
  email        VARCHAR(255),
  phone        VARCHAR(50),
  hotline      VARCHAR(50),
  website      VARCHAR(255),
  address      TEXT,
  facebook_url VARCHAR(255),
  zalo_url     VARCHAR(255),

  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by   VARCHAR(50),
  updated_by   VARCHAR(50),
  version      INT DEFAULT 1
);

-- Tuỳ chọn (khuyến nghị): bảng chi nhánh (branch) trực thuộc about_me
CREATE TABLE IF NOT EXISTS branch (
  branch_id    SERIAL PRIMARY KEY,
  about_id     INT NOT NULL REFERENCES about_me(about_id) ON DELETE CASCADE,
  branch_name  VARCHAR(255) NOT NULL,
  address      TEXT NOT NULL,
  phone        VARCHAR(50),
  latitude     NUMERIC(10,6),
  longitude    NUMERIC(10,6),
  opening_hours JSONB,

  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by   VARCHAR(50),
  updated_by   VARCHAR(50),
  version      INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_branch_about ON branch(about_id);

-- =========================================================
-- 10) commitment: cam kết của trung tâm (toàn cục hoặc theo khóa)
-- =========================================================
CREATE TABLE IF NOT EXISTS commitment (
  commitment_id  SERIAL PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  content        TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  priority       INT DEFAULT 0,
  course_id      INT REFERENCES course(course_id) ON DELETE SET NULL, -- null = áp dụng chung
  effective_from DATE,
  effective_to   DATE,

  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by     VARCHAR(50),
  updated_by     VARCHAR(50),
  version        INT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_commitment_course ON commitment(course_id);
CREATE INDEX IF NOT EXISTS idx_commitment_active ON commitment(is_active);


-- public.refresh_token definition (mở rộng)

CREATE TABLE public.refresh_token (
    id              serial4       NOT NULL,
    user_id         int4          NOT NULL,
    jti             varchar(100)  NOT NULL,               -- ID duy nhất cho refresh token
    token_hash      varchar(255)  NOT NULL,               -- hash của refresh token
    session_id      uuid          NOT NULL,               -- 👈 định danh phiên (ổn định cho 1 thiết bị)
    device_name     varchar(100)  NULL,                   -- tên thiết bị client tự gửi (ví dụ: iPhone 15)
    user_agent      text          NULL,                   -- User-Agent string
    ip              varchar(45)   NULL,                   -- IP (ipv4/ipv6); 45 đủ chứa cả IPv6
    expires_at      timestamp     NOT NULL,
    last_used_at    timestamp     DEFAULT CURRENT_TIMESTAMP, -- lần cuối dùng token (refresh)
    revoked_at      timestamp     NULL,
    replaced_by_jti varchar(100)  NULL,                   -- 👈 jti mới thay thế khi rotate
    created_at      timestamp     DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamp     DEFAULT CURRENT_TIMESTAMP,
    created_by      varchar(50)   NULL,
    updated_by      varchar(50)   NULL,
    version         int4          DEFAULT 1,

    CONSTRAINT refresh_token_pkey PRIMARY KEY (id),
    CONSTRAINT refresh_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE
);

-- Unique constraint cho jti (đảm bảo 1 jti chỉ xuất hiện 1 lần)
CREATE UNIQUE INDEX uq_refresh_jti ON public.refresh_token (jti);

-- Các index hữu ích cho hiệu năng truy vấn
CREATE INDEX idx_refresh_user_session ON public.refresh_token (user_id, session_id);
CREATE INDEX idx_refresh_expires      ON public.refresh_token (expires_at);
CREATE INDEX idx_refresh_revoked      ON public.refresh_token (revoked_at);


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

