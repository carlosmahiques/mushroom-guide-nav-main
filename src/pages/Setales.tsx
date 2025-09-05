import { Pin, MapPin, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Setales = () => {
  const mockSetales = [
    {
      id: 1,
      name: "Robledal de Soria",
      coordinates: "41.7665, -2.4790",
      lastVisit: "2024-01-20",
      rating: 5,
      species: ["Boletus edulis", "Cantharellus cibarius"]
    },
    {
      id: 2,
      name: "Pinar de Guadalajara",
      coordinates: "40.6320, -3.1601",
      lastVisit: "2024-01-15",
      rating: 4,
      species: ["Lactarius deliciosus"]
    },
    {
      id: 3,
      name: "Hayedo de Burgos",
      coordinates: "42.3440, -3.6969",
      lastVisit: "2024-01-10",
      rating: 5,
      species: ["Boletus edulis", "Amanita caesarea"]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Pin className="h-8 w-8 text-primary" />
            Mis sétales
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y organiza tus localizaciones favoritas
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover shadow-medium">
          <MapPin className="w-4 h-4 mr-2" />
          Añadir localización
        </Button>
      </div>

      {/* Sétales list */}
      <div className="space-y-4">
        {mockSetales.map((setal) => (
          <Card key={setal.id} className="shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {setal.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Pin className="h-3 w-3" />
                      {setal.coordinates}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Última visita: {setal.lastVisit}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${
                        i < setal.rating 
                          ? "fill-accent text-accent" 
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2">Especies encontradas:</span>
                {setal.species.map((species) => (
                  <Badge key={species} variant="secondary" className="bg-primary-light text-primary">
                    {species}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state if no sétales */}
      {mockSetales.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Pin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No tienes sétales guardados</h3>
              <p className="text-sm">Empieza añadiendo tus primeras localizaciones desde el mapa</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Setales;