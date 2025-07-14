
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/icons";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const registerSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.72 1.9-4.27 0-7.75-3.5-7.75-7.75s3.48-7.75 7.75-7.75c2.44 0 3.98.92 4.9 1.82l2.5-2.5C20.4 1.63 17.6.5 14.92.5 9.08.5 4.5 5.08 4.5 10.92s4.58 10.42 10.42 10.42c5.84 0 10.13-3.95 10.13-10.13 0-.74-.07-1.45-.18-2.18H12.48z" fill="currentColor"/>
    </svg>
);


export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de Login",
        description: "Email ou senha inválidos. Por favor, tente novamente.",
      });
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de Registro",
        description:
          "Não foi possível criar a conta. O email pode já estar em uso.",
      });
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro com o Google",
        description: "Não foi possível fazer login com o Google. Tente novamente."
      });
      console.error(error);
    } finally {
        setGoogleLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center mb-12 w-[400px]">
        <div className="flex items-center gap-2 mb-6">
            <Logo className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold">BizBalance</span>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>
                  Acesse sua conta para gerenciar seu negócio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="seu@email.com" {...loginForm.register("email")} />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input id="login-password" type="password" {...loginForm.register("password")} />
                     {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Registrar</CardTitle>
                <CardDescription>
                  Crie uma nova conta para começar a usar o BizBalance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="seu@email.com" {...registerForm.register("email")} />
                     {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input id="register-password" type="password" {...registerForm.register("password")} />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Conta
                  </Button>
                 </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="relative w-full my-6">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-sm text-muted-foreground">OU</span>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
            {googleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Entrar com Google
        </Button>
      </div>
    </div>
  );
}
