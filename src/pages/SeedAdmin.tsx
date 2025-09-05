import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SeedAdmin() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [chosenEmail, setChosenEmail] = useState<string>("");

  const candidateEmails = useMemo(() => {
    const ts = Date.now();
    return [
      `admin@test.local`,
      `admin@example.com`,
      `admin+${ts}@testmail.com`,
      `admin+${ts}@gmail.com`,
      `admin+${ts}@icloud.com`,
      `admin+${ts}@yahoo.com`,
    ];
  }, []);

  const handleSeed = useCallback(async () => {
    setResult("");
    setError("");
    setLoading(true);
    try {
      const password = "Admin123!";
      let emailToUse = "";
      let lastErr: string | null = null;

      // Try candidate emails until one validates or yields a non-invalid error
      for (const candidate of candidateEmails) {
        const { error: tryErr } = await supabase.auth.signUp({
          email: candidate,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (!tryErr) {
          emailToUse = candidate;
          setChosenEmail(candidate);
          break;
        }
        lastErr = tryErr.message;
        if (!tryErr.message.toLowerCase().includes("invalid")) {
          // keep the candidate to handle below (already registered or other)
          emailToUse = candidate;
          break;
        }
      }

      if (!emailToUse) {
        setError(lastErr || "No se pudo validar ningún email de prueba.");
        return;
      }

      if (lastErr && !lastErr.toLowerCase().includes("invalid")) {
        // If already registered, try sign-in
        if (lastErr.includes("User already registered")) {
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
          if (signInErr) {
            if (signInErr.message.includes("Email not confirmed")) {
              setError("El usuario existe pero el email no está confirmado. Revisa tu correo.");
            } else {
              setError(signInErr.message);
            }
          } else {
            setResult("Usuario admin existente: inicio de sesión realizado correctamente.");
          }
        } else {
          setError(lastErr);
        }
      } else {
        // Try to sign-in right away (works if auto-confirm is enabled)
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
        if (signInErr) {
          if (signInErr.message.includes("Email not confirmed")) {
            setResult("Usuario creado. Debes confirmar el email antes de iniciar sesión.");
          } else {
            setError(signInErr.message);
          }
        } else {
          setResult("Usuario admin creado y sesión iniciada correctamente.");
        }
      }
    } catch (e: any) {
      setError(e?.message || "Error creando el usuario admin");
    } finally {
      setLoading(false);
    }
  }, [candidateEmails]);

  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Esta ruta solo está disponible en desarrollo.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Seed Admin</CardTitle>
          <CardDescription>
            Crea un usuario de pruebas (password: Admin123!). {chosenEmail && `Email usado: ${chosenEmail}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <Alert>
              <AlertDescription>{result}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleSeed} disabled={loading} className="w-full">
            {loading ? "Creando..." : "Crear usuario admin"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


