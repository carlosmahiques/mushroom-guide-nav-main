-- Crear un spot de prueba para Orea, Teruel
INSERT INTO public.spots (
  user_id,
  name, 
  notes,
  geom,
  elevation_m,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- UUID temporal para pruebas
  'Orea, Teruel (Prueba)',
  'Localización de prueba para testear la API de AEMET',
  ST_SetSRID(ST_MakePoint(-1.72611, 40.55806), 4326),
  1200,
  true
);