-- === ps1_responses (10 rows) ===
INSERT INTO ps1_responses (created_at, email, id_number, name, station, cgpa, preference, allotment_round, year_and_sem, public) VALUES
  (NOW(), 'f20210000@pilani.bits-pilani.ac.in', '2021A7PS0000P', 'Student 0', 'Hyderabad Metro', 8.52, 2, '2', '2023-1', TRUE),
  (NOW(), 'f20210001@pilani.bits-pilani.ac.in', '2021A7PS0001P', 'Student 1', 'BARC', 9.62, 1, '1', '2023-1', TRUE),
  (NOW(), 'f20210002@goa.bits-pilani.ac.in',    '2021A7PS0002G', 'Student 2', 'Indian Railways', 7.28, 3, '2', '2023-1', TRUE),
  (NOW(), 'f20210003@goa.bits-pilani.ac.in',    '2021A7PS0003G', 'Student 3', 'ISRO', 8.74, 2, '1', '2023-1', TRUE),
  (NOW(), 'f20210004@hyderabad.bits-pilani.ac.in', '2021A7PS0004H', 'Student 4', 'BHEL', 7.65, 1, '1', '2023-1', TRUE),
  (NOW(), 'f20210005@goa.bits-pilani.ac.in',    '2021A7PS0005G', 'Student 5', 'DRDO', 9.10, 1, '2', '2023-1', TRUE),
  (NOW(), 'f20210006@pilani.bits-pilani.ac.in', '2021A7PS0006P', 'Student 6', 'BARC', 6.92, 2, '2', '2023-1', TRUE),
  (NOW(), 'f20210007@hyderabad.bits-pilani.ac.in', '2021A7PS0007H', 'Student 7', 'ISRO', 8.24, 3, '1', '2023-1', TRUE),
  (NOW(), 'f20210008@pilani.bits-pilani.ac.in', '2021A7PS0008P', 'Student 8', 'Indian Railways', 8.02, 2, '1', '2023-1', TRUE),
  (NOW(), 'f20210009@goa.bits-pilani.ac.in',    '2021A7PS0009G', 'Student 9', 'Hyderabad Metro', 9.45, 1, '1', '2023-1', TRUE);

-- === ps2_responses (10 rows) ===
INSERT INTO ps2_responses (created_at, email, id_number, name, station, cgpa, preference, offshoot, offshoot_total, offshoot_type, stipend, year_and_sem, allotment_round, public) VALUES
  (NOW(), 'f20210000@pilani.bits-pilani.ac.in', '2021A7PS0000P', 'Student 0', 'Indian Railways', 7.57, 1, 2, 2, 'Research', '20000', '2024-1', '1', TRUE),
  (NOW(), 'f20210001@pilani.bits-pilani.ac.in', '2021A7PS0001P', 'Student 1', 'Hyderabad Metro', 9.17, 3, 0, 2, 'Research', '20000', '2024-1', '2', TRUE),
  (NOW(), 'f20210002@goa.bits-pilani.ac.in', '2021A7PS0002G', 'Student 2', 'DRDO', 8.45, 2, 1, 2, 'Research', '25000', '2024-1', '1', TRUE),
  (NOW(), 'f20210003@goa.bits-pilani.ac.in', '2021A7PS0003G', 'Student 3', 'ISRO', 6.78, 3, 2, 2, 'Research', '30000', '2024-1', '2', TRUE),
  (NOW(), 'f20210004@hyderabad.bits-pilani.ac.in', '2021A7PS0004H', 'Student 4', 'BARC', 7.95, 1, 1, 2, 'Research', '25000', '2024-1', '2', TRUE),
  (NOW(), 'f20210005@goa.bits-pilani.ac.in', '2021A7PS0005G', 'Student 5', 'BHEL', 8.65, 2, 0, 2, 'Research', '20000', '2024-1', '1', TRUE),
  (NOW(), 'f20210006@pilani.bits-pilani.ac.in', '2021A7PS0006P', 'Student 6', 'DRDO', 7.23, 3, 1, 2, 'Research', '30000', '2024-1', '1', TRUE),
  (NOW(), 'f20210007@hyderabad.bits-pilani.ac.in', '2021A7PS0007H', 'Student 7', 'Hyderabad Metro', 9.55, 2, 1, 2, 'Research', '25000', '2024-1', '2', TRUE),
  (NOW(), 'f20210008@pilani.bits-pilani.ac.in', '2021A7PS0008P', 'Student 8', 'ISRO', 8.88, 1, 2, 2, 'Research', '20000', '2024-1', '1', TRUE),
  (NOW(), 'f20210009@goa.bits-pilani.ac.in', '2021A7PS0009G', 'Student 9', 'BARC', 7.60, 3, 0, 2, 'Research', '30000', '2024-1', '1', TRUE);

-- === course_resources (10 rows) ===
INSERT INTO course_resources (name, link, created_by, created_at, email, score, category) VALUES
  ('OS Lab GitHub', 'https://example.com', 'f20210000@pilani.bits-pilani.ac.in', NOW(), 'f20210000@pilani.bits-pilani.ac.in', 10, 'Physics'),
  ('Calculus Notes', 'https://example.com', 'f20210001@pilani.bits-pilani.ac.in', NOW(), 'f20210001@pilani.bits-pilani.ac.in', 9, 'Physics'),
  ('EDA Guide', 'https://example.com', 'f20210002@goa.bits-pilani.ac.in', NOW(), 'f20210002@goa.bits-pilani.ac.in', 8, 'Electronics'),
  ('Thermodynamics Tricks', 'https://example.com', 'f20210003@goa.bits-pilani.ac.in', NOW(), 'f20210003@goa.bits-pilani.ac.in', 7, 'Physics'),
  ('DBMS Notes', 'https://example.com', 'f20210004@hyderabad.bits-pilani.ac.in', NOW(), 'f20210004@hyderabad.bits-pilani.ac.in', 10, 'CS'),
  ('Discrete Math Solns', 'https://example.com', 'f20210005@goa.bits-pilani.ac.in', NOW(), 'f20210005@goa.bits-pilani.ac.in', 9, 'Mathematics'),
  ('Signals & Systems', 'https://example.com', 'f20210006@pilani.bits-pilani.ac.in', NOW(), 'f20210006@pilani.bits-pilani.ac.in', 8, 'Electronics'),
  ('Linear Algebra Videos', 'https://example.com', 'f20210007@hyderabad.bits-pilani.ac.in', NOW(), 'f20210007@hyderabad.bits-pilani.ac.in', 7, 'Mathematics'),
  ('Computer Networks', 'https://example.com', 'f20210008@pilani.bits-pilani.ac.in', NOW(), 'f20210008@pilani.bits-pilani.ac.in', 10, 'CS'),
  ('Physics Simulations', 'https://example.com', 'f20210009@goa.bits-pilani.ac.in', NOW(), 'f20210009@goa.bits-pilani.ac.in', 6, 'Physics');

-- === course_reviews (10 rows) ===
INSERT INTO course_reviews (created_at, created_by, course, prof, review) VALUES
  (NOW(), 'f20210000@pilani.bits-pilani.ac.in', 'EEE F111', 'Dr. Iyer', 'Could be better.'),
  (NOW(), 'f20210001@pilani.bits-pilani.ac.in', 'MATH F111', 'Dr. Rao', 'Very organized lectures.'),
  (NOW(), 'f20210002@goa.bits-pilani.ac.in', 'CS F111', 'Dr. Dutta', 'Excellent explanations.'),
  (NOW(), 'f20210003@goa.bits-pilani.ac.in', 'PHY F110', 'Dr. Sharma', 'Tough but fair grading.'),
  (NOW(), 'f20210004@hyderabad.bits-pilani.ac.in', 'CS F111', 'Dr. Iyer', 'Could be better.'),
  (NOW(), 'f20210005@goa.bits-pilani.ac.in', 'MATH F111', 'Dr. Rao', 'Very organized lectures.'),
  (NOW(), 'f20210006@pilani.bits-pilani.ac.in', 'PHY F110', 'Dr. Sharma', 'Excellent explanations.'),
  (NOW(), 'f20210007@hyderabad.bits-pilani.ac.in', 'EEE F111', 'Dr. Iyer', 'Tough but fair grading.'),
  (NOW(), 'f20210008@pilani.bits-pilani.ac.in', 'CS F111', 'Dr. Dutta', 'Could be better.'),
  (NOW(), 'f20210009@goa.bits-pilani.ac.in', 'PHY F110', 'Dr. Sharma', 'Excellent explanations.');
