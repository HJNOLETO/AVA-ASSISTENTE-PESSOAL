import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Eye, EyeOff, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Get token from URL
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { data: tokenStatus, isLoading: checkingToken } = trpc.auth.validateResetToken.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setLoading(false);
      toast.success("Senha alterada com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao redefinir senha");
      setLoading(false);
    }
  });

  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: "", color: "bg-zinc-200" };
    
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 0:
      case 1: return { score: 25, label: "Fraca", color: "bg-red-500" };
      case 2: return { score: 50, label: "Média", color: "bg-yellow-500" };
      case 3: return { score: 75, label: "Forte", color: "bg-blue-500" };
      case 4: return { score: 100, label: "Muito Forte", color: "bg-green-500" };
      default: return { score: 0, label: "", color: "bg-zinc-200" };
    }
  }, [formData.password]);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "password") {
      if (!value) error = "Senha é obrigatória";
      else if (value.length < 8) error = "Mínimo 8 caracteres";
      else if (!/[0-9]/.test(value)) error = "Deve conter pelo menos um número";
    } else if (name === "confirmPassword") {
      if (value !== formData.password) error = "As senhas não coincidem";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const passErr = validateField("password", formData.password);
    const confErr = validateField("confirmPassword", formData.confirmPassword);

    if (passErr || confErr) return;

    setLoading(true);
    resetMutation.mutate({ token, password: formData.password });
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium">Validando link de recuperação...</p>
        </div>
      </div>
    );
  }

  if (!token || (tokenStatus && !tokenStatus.valid)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="max-w-md w-full border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Link Inválido ou Expirado</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-2">
              Este link de recuperação não é mais válido. Por favor, solicite um novo link na página de login.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => setLocation("/auth")} 
              className="w-full h-11 rounded-xl font-bold"
            >
              Voltar ao Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900/5 dark:bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900/5 dark:bg-white/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-zinc-900 dark:text-white" />
              <span className="font-bold text-lg tracking-tight">AVA Assistant</span>
            </div>
            <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
              Crie uma nova senha forte para sua conta.
            </CardDescription>
          </CardHeader>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 text-center"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Senha Alterada!</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                  Sua senha foi redefinida com sucesso. Você já pode fazer login com sua nova senha.
                </p>
                <Button 
                  onClick={() => setLocation("/auth")} 
                  className="w-full h-11 rounded-xl font-bold"
                >
                  Ir para o Login
                </Button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nova Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={cn(
                          "pl-10 pr-10 h-11 rounded-xl transition-all duration-200",
                          touched.password && errors.password && "border-red-500 focus-visible:ring-red-500 bg-red-50/30",
                          touched.password && !errors.password && "border-green-500 focus-visible:ring-green-500 bg-green-50/30"
                        )}
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                          <span className="text-zinc-500">Força da Senha</span>
                          <span className={cn(
                            passwordStrength.label === "Fraca" && "text-red-500",
                            passwordStrength.label === "Média" && "text-yellow-600",
                            passwordStrength.label === "Forte" && "text-blue-600",
                            passwordStrength.label === "Muito Forte" && "text-green-600"
                          )}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            className={cn("h-full", passwordStrength.color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.score}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {touched.password && errors.password && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={cn(
                          "pl-10 h-11 rounded-xl transition-all duration-200",
                          touched.confirmPassword && errors.confirmPassword && "border-red-500 focus-visible:ring-red-500 bg-red-50/30",
                          touched.confirmPassword && !errors.confirmPassword && "border-green-500 focus-visible:ring-green-500 bg-green-50/30"
                        )}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full h-11 rounded-xl font-bold shadow-lg shadow-zinc-900/10 dark:shadow-none"
                    disabled={loading}
                  >
                    {loading ? "Redefinindo..." : "Redefinir Senha"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setLocation("/auth")}
                    className="w-full h-11 rounded-xl font-semibold text-zinc-500 hover:text-zinc-900"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Login
                  </Button>
                </CardFooter>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
