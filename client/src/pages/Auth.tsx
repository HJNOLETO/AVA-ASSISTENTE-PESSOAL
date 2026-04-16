import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, ShieldCheck, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, KeySquare, Smartphone, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import SecurityCardDisplay from "@/components/SecurityCard";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<{email: string, password: string} | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "card" | null>(null);
  const [cardPositions, setCardPositions] = useState<string[]>([]);
  const [cardAnswers, setCardAnswers] = useState<Record<string, string>>({});
  const [newlyGeneratedCard, setNewlyGeneratedCard] = useState<any>(null);
  
  // Validation States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    website: "" // Honeypot field
  });
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const utils = trpc.useUtils();

  // Simulated Captcha Verification
  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setIsVerified(true);
      toast.success("Verificação concluída com sucesso!");
    }, 1500);
  };

  // Password Strength Logic
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
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "E-mail é obrigatório";
      else if (!emailRegex.test(value)) error = "E-mail inválido";
    } else if (name === "password") {
      if (!value) error = "Senha é obrigatória";
      else if (value.length < 8) error = "Mínimo 8 caracteres";
      else if (!/[0-9]/.test(value)) error = "Deve conter pelo menos um número";
    } else if (name === "confirmPassword") {
      if (value !== formData.password) error = "As senhas não coincidem";
    } else if (name === "name") {
      if (!value) error = "Nome é obrigatório";
      else if (value.length < 2) error = "Nome muito curto";
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

  useEffect(() => {
    if (activeTab === "login") {
      setRegistrationSuccess(false);
      setIsForgotPassword(false);
      setResetSent(false);
    }
  }, [activeTab]);

  // Load saved credentials on mount
  useEffect(() => {
    const saved = localStorage.getItem("ava_remember_me");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedCredentials(parsed);
        setRememberMe(true);
        setFormData(prev => ({ ...prev, email: parsed.email, password: parsed.password }));
      } catch (e) {
        localStorage.removeItem("ava_remember_me");
      }
    }
  }, []);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data, variables) => {
      toast.success("Login realizado com sucesso!");
      
      if (rememberMe) {
        localStorage.setItem("ava_remember_me", JSON.stringify({
          email: variables.email,
          password: variables.password
        }));
      } else {
        localStorage.removeItem("ava_remember_me");
      }

      utils.auth.me.setData(undefined, data.user as any);
      setLocation("/");
    },
    onError: (error) => {
      const message = error.message || "Credenciais inválidas";
      toast.error(message);
      
      if (message.toLowerCase().includes("credenciais") || message.toLowerCase().includes("inválidas")) {
        setErrors(prev => ({ 
          ...prev, 
          email: "E-mail ou senha incorretos",
          password: "E-mail ou senha incorretos"
        }));
        setTouched(prev => ({ ...prev, email: true, password: true }));
      }
      
      setLoading(false);
    },
  });

  const resetPasswordMutation = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setResetSent(true);
      setLoading(false);
      toast.success("Link de recuperação enviado!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao solicitar recuperação");
      setLoading(false);
    }
  });

  const generateCardMutation = trpc.securityCard.generate.useMutation({
    onSuccess: (data: any) => {
      setNewlyGeneratedCard(data.card);
      toast.success("Carta de Segurança gerada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao gerar carta: " + error.message);
    }
  });

  const requestPositionsMutation = trpc.securityCard.requestPositions.useMutation({
    onSuccess: (data: any) => {
      setCardPositions(data.positions);
      setRecoveryMethod("card");
      setLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
      setLoading(false);
    }
  });

  const validateCardMutation = trpc.securityCard.validate.useMutation({
    onSuccess: (data: any) => {
      toast.success("Carta validada com sucesso!");
      if (data.token) {
        setLocation(`/reset-password?token=${data.token}`);
      } else {
        setResetSent(true);
      }
      setLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
      setLoading(false);
    }
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setRegistrationSuccess(true);
      setLoading(false);
      toast.success("Conta criada com sucesso! Por favor, verifique seu e-mail.");
      // Automatically generate card after registration
      generateCardMutation.mutate();
    },
    onError: (error) => {
      const message = error.message || "Erro ao criar conta";
      toast.error(message);

      if (message.includes("já existe") || message.includes("e-mail")) {
        setErrors(prev => ({ ...prev, email: "Este e-mail já está em uso" }));
        setTouched(prev => ({ ...prev, email: true }));
      }

      setLoading(false);
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailErr = validateField("email", formData.email);
    const passErr = validateField("password", formData.password);

    if (emailErr || passErr) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setLoading(true);
    loginMutation.mutate({ email: formData.email, password: formData.password });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Anti-bot: check honeypot
    if (formData.website) {
      console.warn("Bot detected via honeypot");
      return;
    }

    if (!isVerified) {
      toast.error("Por favor, complete a verificação de segurança");
      return;
    }

    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const passErr = validateField("password", formData.password);
    const confirmErr = validateField("confirmPassword", formData.confirmPassword);

    if (nameErr || emailErr || passErr || confirmErr) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setLoading(true);
    registerMutation.mutate({ 
      email: formData.email, 
      password: formData.password, 
      name: formData.name 
    });
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
    setResetSent(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailErr = validateField("email", formData.email);
    if (emailErr) return;

    setLoading(true);
    if (recoveryMethod === "card") {
      validateCardMutation.mutate({
        email: formData.email,
        answers: cardAnswers,
      });
    } else {
      resetPasswordMutation.mutate({ email: formData.email });
    }
  };

  const handleRequestCardPositions = () => {
    const emailErr = validateField("email", formData.email);
    if (emailErr) return;
    setLoading(true);
    requestPositionsMutation.mutate({ email: formData.email });
  };

  const renderInput = (name: string, label: string, type: string = "text", icon: any, placeholder?: string) => {
    const hasError = touched[name] && errors[name];
    const isValid = touched[name] && !errors[name] && formData[name as keyof typeof formData];
    const Icon = icon;
    const isPasswordField = name.toLowerCase().includes("password");

    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <Label htmlFor={name} className="text-sm font-medium">{label}</Label>
          <AnimatePresence>
            {hasError && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-red-500 font-medium"
              >
                {errors[name]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="relative group">
          <Icon className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200",
            hasError ? "text-red-400" : isValid ? "text-green-500" : "text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100"
          )} />
          <Input
            id={name}
            name={name}
            type={isPasswordField && !showPassword ? "password" : type === "password" ? "text" : type}
            placeholder={placeholder}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              "pl-10 transition-all duration-200 placeholder:text-zinc-400/80 dark:placeholder:text-zinc-500/80",
              hasError ? "border-red-500 focus-visible:ring-red-500 bg-red-50/30 dark:bg-red-900/10" : 
              isValid ? "border-green-500 focus-visible:ring-green-500 bg-green-50/30 dark:bg-green-900/10" : 
              "focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-700"
            )}
            required
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          {isValid && !isPasswordField && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
          {hasError && !isPasswordField && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="w-14 h-14 bg-zinc-900 dark:bg-zinc-100 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-zinc-200 dark:shadow-none"
          >
            <ShieldCheck className="w-7 h-7 text-white dark:text-zinc-900" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-1">
            AVA Assistant
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            O futuro da produtividade inteligente
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl">
            <TabsTrigger 
              value="login" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm transition-all"
            >
              <LogIn className="w-4 h-4" /> Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" /> Registro
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (isForgotPassword ? "-forgot" : "")}
              initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeTab === "login" ? (
                isForgotPassword ? (
                  <Card className="border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
                      <CardDescription className="text-zinc-500 dark:text-zinc-400">
                        {resetSent 
                          ? "Verifique as instruções enviadas para você."
                          : "Escolha um método para recuperar o acesso à sua conta."}
                      </CardDescription>
                    </CardHeader>
                    
                    {resetSent ? (
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-300">
                          <p className="flex gap-2">
                            <Check className="w-5 h-5 flex-shrink-0" />
                            Se os dados estiverem corretos, você receberá as instruções em instantes.
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full h-11 rounded-xl font-bold"
                          onClick={() => {
                            setIsForgotPassword(false);
                            setResetSent(false);
                            setRecoveryMethod(null);
                          }}
                        >
                          Voltar ao Login
                        </Button>
                      </CardContent>
                    ) : (
                      <form onSubmit={handleForgotPasswordSubmit}>
                        <CardContent className="space-y-4">
                          {!recoveryMethod ? (
                            <div className="space-y-4">
                              {renderInput("email", "E-mail da Conta", "email", Mail, "seu@email.com")}
                              
                              <div className="grid grid-cols-1 gap-3 pt-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="h-16 justify-start px-4 rounded-xl border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all group"
                                  onClick={() => setRecoveryMethod("email")}
                                >
                                  <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center mr-3 transition-colors">
                                    <Mail className="w-5 h-5" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold text-sm">Receber link por e-mail</p>
                                    <p className="text-xs text-zinc-500">Enviaremos um link de redefinição</p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 ml-auto text-zinc-300 group-hover:text-zinc-900" />
                                </Button>

                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="h-16 justify-start px-4 rounded-xl border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all group"
                                  onClick={handleRequestCardPositions}
                                  disabled={loading}
                                >
                                  <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center mr-3 transition-colors">
                                    <KeySquare className="w-5 h-5" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold text-sm">Usar Carta de Segurança</p>
                                    <p className="text-xs text-zinc-500">Valide posições da sua carta física/digital</p>
                                  </div>
                                  {loading ? (
                                    <div className="w-4 h-4 ml-auto border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                                  ) : (
                                    <ArrowRight className="w-4 h-4 ml-auto text-zinc-300 group-hover:text-zinc-900" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ) : recoveryMethod === "email" ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 mb-2">
                                <Mail className="w-4 h-4" /> {formData.email}
                                <button 
                                  type="button" 
                                  onClick={() => setRecoveryMethod(null)}
                                  className="ml-auto text-xs text-zinc-900 underline"
                                >
                                  Alterar
                                </button>
                              </div>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Clique no botão abaixo para receber o link de recuperação no seu e-mail.
                              </p>
                              <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl font-bold"
                                disabled={loading}
                              >
                                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                                <KeySquare className="w-4 h-4" /> {formData.email}
                                <button 
                                  type="button" 
                                  onClick={() => setRecoveryMethod(null)}
                                  className="ml-auto text-xs text-zinc-900 underline"
                                >
                                  Alterar
                                </button>
                              </div>

                              <div className="p-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-inner">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-3">Informe os códigos da sua carta:</p>
                                <div className="grid grid-cols-3 gap-4">
                                  {cardPositions.map(pos => (
                                    <div key={pos} className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase opacity-60">Posição {pos}</Label>
                                      <Input 
                                        className="bg-white/10 border-white/20 text-white dark:bg-zinc-100 dark:border-zinc-200 dark:text-zinc-900 h-10 text-center font-mono font-bold text-lg tracking-widest focus-visible:ring-white"
                                        maxLength={4}
                                        placeholder="0000"
                                        value={cardAnswers[pos] || ""}
                                        onChange={(e) => setCardAnswers(prev => ({ ...prev, [pos]: e.target.value.replace(/\D/g, "") }))}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl font-bold"
                                disabled={loading || Object.keys(cardAnswers).length < 3}
                              >
                                {loading ? "Validando..." : "Validar e Continuar"}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            className="w-full h-11 rounded-xl font-semibold text-zinc-500"
                            onClick={() => {
                              setIsForgotPassword(false);
                              setRecoveryMethod(null);
                            }}
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Login
                          </Button>
                        </CardFooter>
                      </form>
                    )}
                  </Card>
                ) : (
                  <Card className="border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
                      <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
                        Acesse sua conta para continuar suas conversas.
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                      <CardContent className="space-y-4">
                        {renderInput("email", "E-mail", "email", Mail, "seu@email.com")}
                        
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <button 
                              type="button"
                              onClick={handleForgotPasswordClick}
                              className="px-0 h-auto font-semibold text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-transparent border-none cursor-pointer"
                            >
                              Esqueceu a senha?
                            </button>
                          </div>
                          {renderInput("password", "", "password", Lock, "••••••••")}
                        </div>

                        <div className="flex items-center justify-between space-x-2 pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="remember"
                              checked={rememberMe}
                              onCheckedChange={setRememberMe}
                            />
                            <Label htmlFor="remember" className="text-sm font-semibold leading-none cursor-pointer text-zinc-600 dark:text-zinc-400">
                              Lembrar de mim
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full h-11 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99]" disabled={loading}>
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Entrando...
                            </div>
                          ) : "Entrar"}
                        </Button>

                        <div className="relative w-full">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 font-bold">Ou continue com</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-semibold text-xs"
                            onClick={() => toast.info("Login com Google em breve")}
                          >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-semibold text-xs"
                            onClick={() => toast.info("Login com Microsoft em breve")}
                          >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
                              <path fill="#f3f3f3" d="M0 0h23v23H0z"/><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/>
                            </svg>
                            Microsoft
                          </Button>
                        </div>
                      </CardFooter>
                    </form>
                  </Card>
                )
              ) : registrationSuccess ? (
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verifique seu E-mail</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium px-4">
                      Enviamos um link de confirmação para <strong className="text-zinc-900 dark:text-zinc-50">{formData.email}</strong>. 
                      Por favor, verifique sua caixa de entrada e spam.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      <p>Não recebeu o e-mail? Verifique sua pasta de spam ou tente reenviar em alguns minutos.</p>
                    </div>

                    {newlyGeneratedCard && (
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-300">
                          <p className="flex gap-2 font-bold">
                            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                            IMPORTANTE: Sua Carta de Segurança foi gerada!
                          </p>
                          <p className="mt-1 ml-6">
                            Guarde-a com cuidado. Você precisará dela para ações sensíveis e recuperação de conta.
                          </p>
                        </div>
                        <SecurityCardDisplay data={newlyGeneratedCard} />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    <Button 
                      onClick={() => {
                        setRegistrationSuccess(false);
                        setNewlyGeneratedCard(null);
                        setActiveTab("login");
                      }}
                      variant="outline"
                      className="w-full h-11 rounded-xl font-bold text-sm transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Voltar para o Login
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none rounded-2xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
                      Comece sua jornada com o assistente AVA hoje mesmo.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                      {/* Honeypot field */}
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      {renderInput("name", "Nome Completo", "text", User, "Seu Nome")}
                      {renderInput("email", "E-mail", "email", Mail, "seu@email.com")}
                      
                      <div className="space-y-3">
                        {renderInput("password", "Senha", "password", Lock, "••••••••")}
                        
                        {/* Password Strength Indicator */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-zinc-500">Força da Senha</span>
                            <span className={cn(
                              passwordStrength.color.replace("bg-", "text-"),
                              "transition-colors"
                            )}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength.score}%` }}
                              className={cn("h-full transition-all duration-500", passwordStrength.color)}
                            />
                          </div>
                          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-zinc-500 font-medium">
                            <li className="flex items-center gap-1">
                              <div className={cn("w-1 h-1 rounded-full", formData.password.length >= 8 ? "bg-green-500" : "bg-zinc-300")} />
                              Mínimo 8 caracteres
                            </li>
                            <li className="flex items-center gap-1">
                              <div className={cn("w-1 h-1 rounded-full", /[0-9]/.test(formData.password) ? "bg-green-500" : "bg-zinc-300")} />
                              Pelo menos um número
                            </li>
                          </ul>
                        </div>
                      </div>

                      {renderInput("confirmPassword", "Confirmar Senha", "password", Lock, "••••••••")}

                      {/* Anti-bot Verification */}
                      <div className="pt-2">
                        <div 
                          onClick={!isVerified && !verifying ? handleVerify : undefined}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                            isVerified 
                              ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800" 
                              : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-all",
                            isVerified ? "bg-green-500 border-green-500" : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600"
                          )}>
                            {verifying ? (
                              <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                            ) : isVerified ? (
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            ) : null}
                          </div>
                          <span className={cn(
                            "text-xs font-semibold",
                            isVerified ? "text-green-700 dark:text-green-400" : "text-zinc-600 dark:text-zinc-400"
                          )}>
                            {verifying ? "Verificando..." : isVerified ? "Você é humano!" : "Sou um humano"}
                          </span>
                          <ShieldCheck className={cn(
                            "ml-auto w-4 h-4",
                            isVerified ? "text-green-500" : "text-zinc-300 dark:text-zinc-600"
                          )} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full h-11 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99]" disabled={loading}>
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Criando conta...
                          </div>
                        ) : "Criar Conta"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <p className="mt-8 text-center text-[11px] text-zinc-500 dark:text-zinc-500 font-medium leading-relaxed">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" className="underline underline-offset-4 text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="underline underline-offset-4 text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Política de Privacidade
          </a>.
        </p>
      </motion.div>
    </div>
  );
}
