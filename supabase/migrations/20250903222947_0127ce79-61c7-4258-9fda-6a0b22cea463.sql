-- Crear un spot de prueba para Orea, Teruel con user_id válido
INSERT INTO public.spots (
  user_id,
  name, 
  notes,
  geom,
  elevation_m,
  is_active
) VALUES (
  '0efec3d4-5aea-486c-8507-8e4f14a6ce51', -- ID de usuario real
  'Orea, Teruel (Prueba)',
  'Localización de prueba para testear la API de AEMET',
  ST_SetSRID(ST_MakePoint(-1.72611, 40.55806), 4326),
  1200,
  true
);