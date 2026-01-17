
insert into public.categories (name, slug) values
  ('Math', 'math'),
  ('Computer Science', 'cs'),
  ('Language', 'language'),
  ('Physics', 'physics'),
  ('Chemistry', 'chemistry')
on conflict (slug) do nothing;
