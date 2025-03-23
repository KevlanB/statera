-- Cria a tabela `user` (se ainda não existir)
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

-- Insere o usuário default
INSERT INTO user (username, password, email)
VALUES ('admin', '$2b$10$81KjFVsrtiHbqhy9aQ1yA.OHW..0eClCzEAE/MTIV/d/UB9dzo/zi', 'admin@example.com');