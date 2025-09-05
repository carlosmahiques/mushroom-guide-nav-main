-- Añadir columna is_public a la tabla spots
ALTER TABLE public.spots 
ADD COLUMN is_public boolean DEFAULT false;

-- Actualizar el spot de Orea para hacerlo público
UPDATE public.spots 
SET is_public = true 
WHERE name = 'Orea, Teruel (Prueba)';

-- Crear política para permitir acceso público a spots marcados como públicos
CREATE POLICY "Public spots are viewable by everyone" 
ON public.spots 
FOR SELECT 
USING (is_public = true);

-- Crear política para permitir acceso público a weather_observations de spots públicos
CREATE POLICY "Public weather data is viewable by everyone" 
ON public.weather_observations 
FOR SELECT 
USING (spot_id IN (SELECT id FROM public.spots WHERE is_public = true));