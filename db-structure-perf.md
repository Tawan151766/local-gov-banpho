# โครงสร้างฐานข้อมูล Performance Results

## perf_results_types
- id (PK)
- type_name
- created_at
- updated_at

## perf_results_sections
- id (PK)
- type_id (FK → perf_results_types.id)
- section_name
- date
- created_at
- updated_at

## perf_results_sub_topics
- id (PK)
- section_id (FK → perf_results_sections.id)
- topic_name
- date
- created_at
- updated_at

## perf_results_files
- id (PK)
- sub_topic_id (FK → perf_results_sub_topics.id)
- files_path
- files_type
- created_at
- updated_at

## ความสัมพันธ์
- 1 type → หลาย section
- 1 section → หลาย sub_topic
- 1 sub_topic → หลาย file

## ตัวอย่างความสัมพันธ์
```
perf_results_types
  └─ perf_results_sections
        └─ perf_results_sub_topics
              └─ perf_results_files
```
