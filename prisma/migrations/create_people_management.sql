-- CreateTable
CREATE TABLE `people_management` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `email` VARCHAR(255) NULL,
  `department` ENUM('executive', 'council', 'clerk', 'finance', 'engineering', 'education', 'audit') NOT NULL,
  `sub_department` VARCHAR(255) NULL,
  `role_type` ENUM('head', 'deputy', 'staff', 'worker') NOT NULL DEFAULT 'staff',
  `level` INT NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `district` VARCHAR(100) NULL,
  `img` VARCHAR(255) NULL,
  `is_empty` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_department` (`department`),
  INDEX `idx_sort_order` (`sort_order`),
  INDEX `idx_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;