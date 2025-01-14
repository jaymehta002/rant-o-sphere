import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AuthForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "Successfully signed in.",
        });
      }
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Goodbye!",
          description: "Successfully signed out.",
        });
      }
      if (event === 'USER_UPDATED') {
        const { error } = supabase.auth.getSession();
        if (error) {
          setError(error.message);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return (
    <Card className="w-full max-w-md mx-auto bg-card shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-vent-primary to-vent-secondary bg-clip-text text-transparent">
          Welcome to Rant-o-sphere
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#6D28D9',
                  brandAccent: '#5b21b6',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'w-full bg-vent-primary hover:bg-vent-primary/90 text-white',
              divider: 'my-4',
            }
          }}
          providers={['google']}
          redirectTo={window.location.origin}
        />
      </CardContent>
    </Card>
  );
};