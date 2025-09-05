-- Crear función para obtener coordenadas de un spot
CREATE OR REPLACE FUNCTION public.get_spot_coordinates()
RETURNS TABLE (
  id UUID,
  name TEXT,
  notes TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  is_public BOOLEAN,
  is_active BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.notes,
    ST_Y(s.geom::geometry) as lat,
    ST_X(s.geom::geometry) as lng,
    s.created_at,
    s.user_id,
    s.is_public,
    s.is_active
  FROM spots s
  WHERE s.is_active = true;
END;
$$;