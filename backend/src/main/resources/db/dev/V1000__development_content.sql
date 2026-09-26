INSERT INTO categories(name, slug) VALUES
 ('Backend','backend'),('Frontend','frontend'),('DevOps','devops'),('Arquitetura','arquitetura'),('Projetos','projetos'),('Carreira','carreira')
ON CONFLICT DO NOTHING;
INSERT INTO tags(name, slug) VALUES
 ('Java','java'),('Spring Boot','spring-boot'),('Angular','angular'),('TypeScript','typescript'),('Docker','docker'),('PostgreSQL','postgresql'),('AWS','aws'),('REST','rest'),('Segurança','seguranca'),('Testes','testes')
ON CONFLICT DO NOTHING;
INSERT INTO projects(name, slug, description, technologies) VALUES
 ('ObraSync','obrasync','Projeto em construção — substitua pela descrição real.','Java, Angular, PostgreSQL'),
 ('PiiCheck','piicheck','Projeto em construção — substitua pela descrição real.','Spring Boot, Segurança'),
 ('Juvino Store','juvino-store','Projeto em construção — substitua pela descrição real.','Angular, TypeScript')
ON CONFLICT DO NOTHING;
INSERT INTO posts(title, slug, summary, content, status, featured, category_id, published_at, reading_time)
SELECT 'APIs resilientes com Spring Boot','apis-resilientes-com-spring-boot','Práticas objetivas para criar APIs previsíveis, observáveis e fáceis de manter.',
'# APIs resilientes com Spring Boot\n\nUma API profissional começa com **contratos claros** e falhas previsíveis.\n\n## Validação\n\nUse Bean Validation na borda da aplicação.\n\n```java\npublic record CreatePost(@NotBlank String title) {}\n```\n\n## Próximos passos\n\n- Padronize erros\n- Monitore latência\n- Teste regras de negócio',
'PUBLISHED',TRUE,id,NOW(),2 FROM categories WHERE slug='backend' ON CONFLICT DO NOTHING;
INSERT INTO posts(title, slug, summary, content, status, featured, category_id, published_at, reading_time)
SELECT 'Docker para ambientes locais previsíveis','docker-para-ambientes-locais-previsiveis','Como reduzir diferenças entre máquinas e tornar o onboarding simples.',
'# Docker para ambientes locais previsíveis\n\nAmbientes reproduzíveis diminuem tempo perdido.\n\n> Infraestrutura local também é experiência do desenvolvedor.\n\n```yaml\nservices:\n  postgres:\n    image: postgres:17-alpine\n```',
'PUBLISHED',TRUE,id,NOW() - INTERVAL '2 days',1 FROM categories WHERE slug='devops' ON CONFLICT DO NOTHING;
