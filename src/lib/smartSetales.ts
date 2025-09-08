/**
 * Sistema de Setales Inteligentes
 * Análisis individual por setal con algoritmos específicos por especie
 */

export type SetalAnalysis = {
  setalId: string;
  species: string;
  coordinates: { lat: number; lng: number };
  probability: number; // 0-100%
  confidence: number; // 0-100%
  conditions: {
    temperature: number;
    humidity: number;
    rain3d: number;
    rain7d: number;
    wind: number;
  };
  recommendation: {
    action: 'go_now' | 'wait' | 'check_later' | 'not_recommended';
    reason: string;
    bestTime?: string;
  };
  lastUpdated: string;
};

export type SpeciesProfile = {
  name: string;
  optimalTemp: { min: number; max: number; ideal: number };
  optimalHumidity: { min: number; max: number; ideal: number };
  rainRequirements: { min3d: number; max3d: number; min7d: number; max7d: number };
  windTolerance: number; // km/h
  seasonality: { start: number; end: number }; // meses del año
  soilPreference: string[];
  environmentNotes: string;
};

// Perfiles específicos por especie basados en conocimiento micológico
export const SPECIES_PROFILES: Record<string, SpeciesProfile> = {
  boletus_edulis: {
    name: 'Boletus edulis (Boleto)',
    optimalTemp: { min: 8, max: 18, ideal: 12 },
    optimalHumidity: { min: 70, max: 85, ideal: 78 },
    rainRequirements: { min3d: 15, max3d: 40, min7d: 25, max7d: 80 },
    windTolerance: 20,
    seasonality: { start: 9, end: 11 }, // septiembre-noviembre
    soilPreference: ['ácido', 'bien drenado', 'bosque mixto'],
    environmentNotes: 'Prefiere bosques de pinos, robles y hayas. Aparece después de lluvias moderadas.'
  },
  amanita_caesarea: {
    name: 'Amanita caesarea (Oronja)',
    optimalTemp: { min: 15, max: 25, ideal: 20 },
    optimalHumidity: { min: 60, max: 75, ideal: 68 },
    rainRequirements: { min3d: 10, max3d: 30, min7d: 20, max7d: 60 },
    windTolerance: 25,
    seasonality: { start: 8, end: 11 }, // agosto-noviembre
    soilPreference: ['calcáreo', 'bosque mediterráneo', 'encinares'],
    environmentNotes: 'Típica de bosques mediterráneos, especialmente encinares y alcornocales.'
  },
  lactarius_deliciosus: {
    name: 'Lactarius deliciosus (Níscalo)',
    optimalTemp: { min: 6, max: 16, ideal: 11 },
    optimalHumidity: { min: 75, max: 90, ideal: 82 },
    rainRequirements: { min3d: 20, max3d: 50, min7d: 35, max7d: 100 },
    windTolerance: 15,
    seasonality: { start: 9, end: 12 }, // septiembre-diciembre
    soilPreference: ['ácido', 'pinares', 'suelo arenoso'],
    environmentNotes: 'Exclusivo de pinares, especialmente Pinus pinaster y Pinus sylvestris.'
  },
  cantharellus_cibarius: {
    name: 'Cantharellus cibarius (Rebozuelo)',
    optimalTemp: { min: 10, max: 20, ideal: 15 },
    optimalHumidity: { min: 65, max: 80, ideal: 72 },
    rainRequirements: { min3d: 12, max3d: 35, min7d: 20, max7d: 70 },
    windTolerance: 18,
    seasonality: { start: 6, end: 11 }, // junio-noviembre
    soilPreference: ['ácido', 'bosque mixto', 'suelo húmedo'],
    environmentNotes: 'Aparece en bosques mixtos, especialmente bajo hayas y robles.'
  },
  macrolepiota_procera: {
    name: 'Macrolepiota procera (Parasol)',
    optimalTemp: { min: 12, max: 22, ideal: 17 },
    optimalHumidity: { min: 60, max: 75, ideal: 68 },
    rainRequirements: { min3d: 8, max3d: 25, min7d: 15, max7d: 50 },
    windTolerance: 30,
    seasonality: { start: 7, end: 11 }, // julio-noviembre
    soilPreference: ['pastizales', 'claros de bosque', 'suelo rico'],
    environmentNotes: 'Prefiere pastizales y claros de bosque con suelo rico en materia orgánica.'
  },
  pleurotus_eryngii: {
    name: 'Pleurotus eryngii (Seta de cardo)',
    optimalTemp: { min: 8, max: 18, ideal: 13 },
    optimalHumidity: { min: 70, max: 85, ideal: 78 },
    rainRequirements: { min3d: 15, max3d: 40, min7d: 25, max7d: 80 },
    windTolerance: 20,
    seasonality: { start: 9, end: 12 }, // septiembre-diciembre
    soilPreference: ['cardos', 'raíces muertas', 'suelo calcáreo'],
    environmentNotes: 'Crece sobre raíces de cardos muertos, especialmente en pastizales calcáreos.'
  },
  marasmius_oreades: {
    name: 'Marasmius oreades (Senderuela)',
    optimalTemp: { min: 10, max: 20, ideal: 15 },
    optimalHumidity: { min: 65, max: 80, ideal: 72 },
    rainRequirements: { min3d: 10, max3d: 30, min7d: 18, max7d: 60 },
    windTolerance: 25,
    seasonality: { start: 5, end: 11 }, // mayo-noviembre
    soilPreference: ['césped', 'pastizales', 'suelo compacto'],
    environmentNotes: 'Forma "corros de brujas" en pastizales y céspedes.'
  },
  agaricus_campestris: {
    name: 'Agaricus campestris (Champiñón silvestre)',
    optimalTemp: { min: 12, max: 22, ideal: 17 },
    optimalHumidity: { min: 60, max: 75, ideal: 68 },
    rainRequirements: { min3d: 8, max3d: 25, min7d: 15, max7d: 50 },
    windTolerance: 25,
    seasonality: { start: 6, end: 11 }, // junio-noviembre
    soilPreference: ['pastizales', 'suelo rico', 'estiércol'],
    environmentNotes: 'Aparece en pastizales ricos, especialmente donde hay ganado.'
  },
  hydnum_repandum: {
    name: 'Hydnum repandum (Lengua de gato)',
    optimalTemp: { min: 8, max: 18, ideal: 13 },
    optimalHumidity: { min: 70, max: 85, ideal: 78 },
    rainRequirements: { min3d: 15, max3d: 40, min7d: 25, max7d: 80 },
    windTolerance: 18,
    seasonality: { start: 9, end: 12 }, // septiembre-diciembre
    soilPreference: ['bosque mixto', 'suelo ácido', 'hojarasca'],
    environmentNotes: 'Crece en bosques mixtos sobre hojarasca y restos vegetales.'
  },
  morchella_esculenta: {
    name: 'Morchella esculenta (Colmenilla)',
    optimalTemp: { min: 5, max: 15, ideal: 10 },
    optimalHumidity: { min: 65, max: 80, ideal: 72 },
    rainRequirements: { min3d: 20, max3d: 50, min7d: 35, max7d: 100 },
    windTolerance: 15,
    seasonality: { start: 3, end: 5 }, // marzo-mayo
    soilPreference: ['suelo quemado', 'cenizas', 'suelo rico'],
    environmentNotes: 'Aparece en primavera, especialmente en zonas quemadas o con cenizas.'
  },
  otro: {
    name: 'Otra especie',
    optimalTemp: { min: 8, max: 20, ideal: 14 },
    optimalHumidity: { min: 65, max: 80, ideal: 72 },
    rainRequirements: { min3d: 10, max3d: 30, min7d: 20, max7d: 60 },
    windTolerance: 20,
    seasonality: { start: 8, end: 11 }, // agosto-noviembre
    soilPreference: ['variado'],
    environmentNotes: 'Perfil genérico para especies no especificadas.'
  }
};

/**
 * Calcula la probabilidad de fructificación para un setal específico
 */
export function analyzeSetal(
  setalId: string,
  species: string,
  coordinates: { lat: number; lng: number },
  weatherData: {
    temperature: number;
    humidity: number;
    rain3d: number;
    rain7d: number;
    wind: number;
  }
): SetalAnalysis {
  const profile = SPECIES_PROFILES[species] || SPECIES_PROFILES.otro;
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // Verificar si estamos en temporada
  const inSeason = currentMonth >= profile.seasonality.start && 
                   currentMonth <= profile.seasonality.end;

  if (!inSeason) {
    return {
      setalId,
      species,
      coordinates,
      probability: 0,
      confidence: 95,
      conditions: weatherData,
      recommendation: {
        action: 'not_recommended',
        reason: `Fuera de temporada. ${profile.name} aparece de ${getMonthName(profile.seasonality.start)} a ${getMonthName(profile.seasonality.end)}.`
      },
      lastUpdated: new Date().toISOString()
    };
  }

  // Calcular score de temperatura (0-1)
  const tempScore = calculateTemperatureScore(weatherData.temperature, profile.optimalTemp);
  
  // Calcular score de humedad (0-1)
  const humidityScore = calculateHumidityScore(weatherData.humidity, profile.optimalHumidity);
  
  // Calcular score de lluvia (0-1)
  const rainScore = calculateRainScore(weatherData.rain3d, weatherData.rain7d, profile.rainRequirements);
  
  // Calcular score de viento (0-1, penalización)
  const windScore = calculateWindScore(weatherData.wind, profile.windTolerance);

  // Ponderación de factores
  const probability = Math.round(
    (tempScore * 0.3 + 
     humidityScore * 0.25 + 
     rainScore * 0.3 + 
     windScore * 0.15) * 100
  );

  // Calcular confianza basada en qué tan cerca están los valores de los ideales
  const confidence = calculateConfidence(weatherData, profile);

  // Generar recomendación
  const recommendation = generateRecommendation(probability, weatherData, profile);

  return {
    setalId,
    species,
    coordinates,
    probability: Math.max(0, Math.min(100, probability)),
    confidence: Math.max(0, Math.min(100, confidence)),
    conditions: weatherData,
    recommendation,
    lastUpdated: new Date().toISOString()
  };
}

function calculateTemperatureScore(temp: number, optimal: { min: number; max: number; ideal: number }): number {
  if (temp < optimal.min || temp > optimal.max) return 0;
  if (temp === optimal.ideal) return 1;
  
  // Score basado en distancia al ideal
  const distanceFromIdeal = Math.abs(temp - optimal.ideal);
  const maxDistance = Math.max(optimal.ideal - optimal.min, optimal.max - optimal.ideal);
  return Math.max(0, 1 - (distanceFromIdeal / maxDistance));
}

function calculateHumidityScore(humidity: number, optimal: { min: number; max: number; ideal: number }): number {
  if (humidity < optimal.min || humidity > optimal.max) return 0;
  if (humidity === optimal.ideal) return 1;
  
  const distanceFromIdeal = Math.abs(humidity - optimal.ideal);
  const maxDistance = Math.max(optimal.ideal - optimal.min, optimal.max - optimal.ideal);
  return Math.max(0, 1 - (distanceFromIdeal / maxDistance));
}

function calculateRainScore(rain3d: number, rain7d: number, requirements: { min3d: number; max3d: number; min7d: number; max7d: number }): number {
  const rain3dScore = rain3d >= requirements.min3d && rain3d <= requirements.max3d ? 1 : 
                     rain3d < requirements.min3d ? rain3d / requirements.min3d : 
                     requirements.max3d / rain3d;
  
  const rain7dScore = rain7d >= requirements.min7d && rain7d <= requirements.max7d ? 1 : 
                     rain7d < requirements.min7d ? rain7d / requirements.min7d : 
                     requirements.max7d / rain7d;
  
  return (rain3dScore * 0.6 + rain7dScore * 0.4);
}

function calculateWindScore(wind: number, tolerance: number): number {
  if (wind <= tolerance) return 1;
  return Math.max(0, 1 - ((wind - tolerance) / tolerance));
}

function calculateConfidence(weatherData: any, profile: SpeciesProfile): number {
  // Confianza alta si todos los valores están en rangos óptimos
  let confidence = 100;
  
  if (weatherData.temperature < profile.optimalTemp.min || weatherData.temperature > profile.optimalTemp.max) {
    confidence -= 20;
  }
  if (weatherData.humidity < profile.optimalHumidity.min || weatherData.humidity > profile.optimalHumidity.max) {
    confidence -= 15;
  }
  if (weatherData.rain3d < profile.rainRequirements.min3d || weatherData.rain3d > profile.rainRequirements.max3d) {
    confidence -= 25;
  }
  if (weatherData.wind > profile.windTolerance) {
    confidence -= 10;
  }
  
  return Math.max(50, confidence); // Mínimo 50% de confianza
}

function generateRecommendation(probability: number, weatherData: any, profile: SpeciesProfile): SetalAnalysis['recommendation'] {
  if (probability >= 80) {
    return {
      action: 'go_now',
      reason: `Condiciones excelentes para ${profile.name}. Probabilidad muy alta.`,
      bestTime: 'Mañana temprano o tarde'
    };
  } else if (probability >= 60) {
    return {
      action: 'check_later',
      reason: `Buenas condiciones para ${profile.name}. Monitorea los próximos días.`,
      bestTime: 'En 1-2 días'
    };
  } else if (probability >= 40) {
    return {
      action: 'wait',
      reason: `Condiciones moderadas. Espera mejor tiempo para ${profile.name}.`,
      bestTime: 'En 3-5 días'
    };
  } else {
    return {
      action: 'not_recommended',
      reason: `Condiciones no favorables para ${profile.name} en este momento.`
    };
  }
}

function getMonthName(month: number): string {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return months[month - 1];
}

/**
 * Obtiene el color del marcador basado en la probabilidad
 */
export function getMarkerColor(probability: number): string {
  if (probability >= 80) return '#22c55e'; // Verde - Alta probabilidad
  if (probability >= 60) return '#eab308'; // Amarillo - Media probabilidad
  if (probability >= 40) return '#f97316'; // Naranja - Baja probabilidad
  return '#ef4444'; // Rojo - Muy baja probabilidad
}

/**
 * Obtiene el emoji de la recomendación
 */
export function getRecommendationEmoji(action: string): string {
  switch (action) {
    case 'go_now': return '🚀';
    case 'check_later': return '👀';
    case 'wait': return '⏳';
    case 'not_recommended': return '❌';
    default: return '❓';
  }
}
