-- Replace with real UUIDs from auth.users
insert into profiles (id, name, role, color, initials)
values 
  ('58ef8e79-01a7-4345-8474-f6489aef9229', 'Jose', 'jose', '#c1603a', 'J'),
  ('6f1a3cc9-c0e6-4d59-b669-c9a0ce82b6c0', 'Anto', 'anto', '#d4849e', 'A');

-- Seed mock revenue data
insert into tablio_revenue (month, year, amount, venture)
values
  ('Oct', 2024, 200, 'RecepcionistaAI'),
  ('Nov', 2024, 350, 'RecepcionistaAI'),
  ('Dec', 2024, 400, 'RecepcionistaAI'),
  ('Jan', 2025, 550, 'RecepcionistaAI'),
  ('Feb', 2025, 500, 'RecepcionistaAI'),
  ('Feb', 2025, 200, 'BotFactory'),
  ('Mar', 2025, 600, 'RecepcionistaAI'),
  ('Mar', 2025, 200, 'BotFactory');
