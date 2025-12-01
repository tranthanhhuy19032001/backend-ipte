-- CreateEnum
CREATE TYPE "consult_status" AS ENUM ('PENDING', 'CONTACTED', 'SCHEDULED', 'CLOSED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "contact_method" AS ENUM ('PHONE', 'EMAIL', 'ZALO', 'MESSENGER', 'WHATSAPP', 'OTHER');

-- CreateEnum
CREATE TYPE "course_category" AS ENUM ('BASIS', 'ADVANCE', 'IPASS');

-- CreateEnum
CREATE TYPE "course_level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "course_mode" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- CreateEnum
CREATE TYPE "enrollment_status" AS ENUM ('INTERESTED', 'REGISTERED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('UNPAID', 'PAID', 'PARTIAL', 'REFUNDED');

-- CreateEnum
CREATE TYPE "publish_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "about_me" (
    "about_id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "hotline" VARCHAR(50),
    "website" VARCHAR(255),
    "address" TEXT,
    "facebook_url" VARCHAR(255),
    "zalo_url" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,
    "category" VARCHAR(25),
    "map_url" TEXT,
    "tiktok_url" VARCHAR(255),
    "youtube_url" VARCHAR(255),

    CONSTRAINT "about_me_pkey" PRIMARY KEY ("about_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "course_id" INTEGER,
    "news_id" INTEGER,
    "knowledge_id" INTEGER,
    "parent_comment_id" INTEGER,
    "content" TEXT NOT NULL,
    "is_approved" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "commitment" (
    "commitment_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "priority" INTEGER DEFAULT 0,
    "course_id" INTEGER,
    "effective_from" DATE,
    "effective_to" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "commitment_pkey" PRIMARY KEY ("commitment_id")
);

-- CreateTable
CREATE TABLE "consultation_request" (
    "consultation_request_id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "course_id" INTEGER,
    "message" TEXT,
    "contact_method" "contact_method",
    "status" "consult_status" NOT NULL DEFAULT 'PENDING',
    "preferred_time" TIMESTAMP(6),
    "source" VARCHAR(50),
    "assigned_to" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "consultation_request_pkey" PRIMARY KEY ("consultation_request_id")
);

-- CreateTable
CREATE TABLE "course" (
    "course_id" SERIAL NOT NULL,
    "course_code" VARCHAR(50),
    "course_name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "title" TEXT,
    "description" TEXT,
    "level" "course_level" NOT NULL DEFAULT 'BEGINNER',
    "mode" "course_mode" NOT NULL DEFAULT 'ONLINE',
    "language" VARCHAR(50) DEFAULT 'en',
    "price" DECIMAL(12,2) DEFAULT 0,
    "duration" VARCHAR(255),
    "start_date" DATE,
    "end_date" DATE,
    "image" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,
    "category" "course_category",
    "schedule" VARCHAR(255),
    "tuition" VARCHAR(255),
    "content" VARCHAR(255),
    "category_id" INTEGER,
    "is_featured" BOOLEAN DEFAULT false,
    "is_disabled" BOOLEAN DEFAULT false,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "audience" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "schema_enabled" BOOLEAN DEFAULT false,
    "schema_mode" VARCHAR(50),
    "schema_data" TEXT,
    "benefits" TEXT,

    CONSTRAINT "course_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "enrollment_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "status" "enrollment_status" NOT NULL DEFAULT 'REGISTERED',
    "payment_status" "payment_status" NOT NULL DEFAULT 'UNPAID',
    "payment_amount" DECIMAL(12,2) DEFAULT 0,
    "registered_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(6),
    "completed_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "knowledge" (
    "knowledge_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "status" "publish_status" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(6),
    "author_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,
    "category_id" INTEGER,
    "description" TEXT,
    "is_prominent" INTEGER DEFAULT 0,
    "category_type" VARCHAR(255),

    CONSTRAINT "knowledge_pkey" PRIMARY KEY ("knowledge_id")
);

-- CreateTable
CREATE TABLE "news" (
    "news_id" SERIAL NOT NULL,
    "author_id" INTEGER,
    "category_id" INTEGER,
    "image" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "status" "publish_status" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(6),
    "tag_ids" INTEGER[],
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,
    "is_prominent" BOOLEAN DEFAULT false,
    "category_type" VARCHAR(255),

    CONSTRAINT "news_pkey" PRIMARY KEY ("news_id")
);

-- CreateTable
CREATE TABLE "permission" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" VARCHAR(50) NOT NULL,
    "permission_description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "jti" VARCHAR(100) NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "session_id" UUID NOT NULL,
    "device_name" VARCHAR(100),
    "user_agent" TEXT,
    "ip" VARCHAR(45),
    "expires_at" TIMESTAMP(6) NOT NULL,
    "last_used_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(6),
    "replaced_by_jti" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "review_id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "rating" SMALLINT NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT,
    "is_approved" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "role" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "role_description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "student" (
    "student_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "phone" VARCHAR(30),
    "dob" DATE,
    "address" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "tag_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "slug" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "teacher_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "bio" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "image" VARCHAR(255),
    "overall_score" DECIMAL(3,2) DEFAULT 0,
    "listening_score" DECIMAL(3,2) DEFAULT 0,
    "speaking_score" DECIMAL(3,2) DEFAULT 0,
    "reading_score" DECIMAL(3,2) DEFAULT 0,
    "writing_score" DECIMAL(3,2) DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,
    "slug" VARCHAR(255) NOT NULL DEFAULT '',
    "content" TEXT,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,
    "avatar" VARCHAR(50),
    "is_active" BOOLEAN DEFAULT true,
    "teacher_id" INTEGER,
    "bio" VARCHAR(128),
    "name" VARCHAR(50),
    "image" VARCHAR(50),
    "overall_score" REAL,
    "listening_score" REAL,
    "speaking_score" REAL,
    "reading_score" REAL,
    "writing_score" REAL,
    "slug" VARCHAR(50),

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" SERIAL NOT NULL,
    "icon" TEXT,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "parent_id" BIGINT,
    "category_type" VARCHAR(50) NOT NULL,
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "h1_heading" VARCHAR(255),
    "seo_content_top" TEXT,
    "seo_content_bottom" TEXT,
    "canonical_url" TEXT,
    "noindex" BOOLEAN DEFAULT false,
    "url" TEXT,
    "level" INTEGER,
    "is_featured" BOOLEAN DEFAULT false,
    "is_disable" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateIndex
CREATE INDEX "idx_comment_course" ON "comment"("course_id");

-- CreateIndex
CREATE INDEX "idx_comment_knowledge" ON "comment"("knowledge_id");

-- CreateIndex
CREATE INDEX "idx_comment_news" ON "comment"("news_id");

-- CreateIndex
CREATE INDEX "idx_comment_parent" ON "comment"("parent_comment_id");

-- CreateIndex
CREATE INDEX "idx_commitment_active" ON "commitment"("is_active");

-- CreateIndex
CREATE INDEX "idx_commitment_course" ON "commitment"("course_id");

-- CreateIndex
CREATE INDEX "idx_consult_course" ON "consultation_request"("course_id");

-- CreateIndex
CREATE INDEX "idx_consult_status" ON "consultation_request"("status");

-- CreateIndex
CREATE UNIQUE INDEX "course_course_code_key" ON "course"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "course_slug_key" ON "course"("slug");

-- CreateIndex
CREATE INDEX "idx_course_level" ON "course"("level");

-- CreateIndex
CREATE INDEX "idx_course_mode" ON "course"("mode");

-- CreateIndex
CREATE INDEX "idx_course_slug" ON "course"("slug");

-- CreateIndex
CREATE INDEX "idx_enrollment_course" ON "enrollment"("course_id");

-- CreateIndex
CREATE INDEX "idx_enrollment_student" ON "enrollment"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_enrollment" ON "enrollment"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_slug_key" ON "knowledge"("slug");

-- CreateIndex
CREATE INDEX "idx_knowledge_published_at" ON "knowledge"("published_at");

-- CreateIndex
CREATE INDEX "idx_knowledge_status" ON "knowledge"("status");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permission_permission_name_key" ON "permission"("permission_name");

-- CreateIndex
CREATE INDEX "idx_review_course" ON "review"("course_id");

-- CreateIndex
CREATE INDEX "idx_review_student" ON "review"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_review" ON "review"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_role_name_key" ON "role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "student_user_id_key" ON "student"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tag_slug_key" ON "tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_knowledge_id_fkey" FOREIGN KEY ("knowledge_id") REFERENCES "knowledge"("knowledge_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comment"("comment_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "commitment" ADD CONSTRAINT "commitment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultation_request" ADD CONSTRAINT "consultation_request_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultation_request" ADD CONSTRAINT "consultation_request_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "knowledge" ADD CONSTRAINT "knowledge_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("permission_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
