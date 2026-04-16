import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ComponentShowcase() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container py-10 space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Guia de Estilo AVA
            </h1>
            <p className="text-muted-foreground">
              Tokens, tipografia e componentes para manter consistência visual.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setTheme("light")}
              disabled={theme === "light"}
            >
              Light
            </Button>
            <Button
              variant="outline"
              onClick={() => setTheme("dark")}
              disabled={theme === "dark"}
            >
              Dark
            </Button>
            <Button
              variant="outline"
              onClick={() => setTheme("serene")}
              disabled={theme === "serene"}
            >
              Serene
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cores principais</CardTitle>
              <CardDescription>Tokens de superfície e ação</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[
                { name: "Primary", className: "bg-primary" },
                { name: "Secondary", className: "bg-secondary" },
                { name: "Muted", className: "bg-muted" },
                { name: "Accent", className: "bg-accent" },
                { name: "Destructive", className: "bg-destructive" },
                { name: "Card", className: "bg-card border border-border" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${item.className}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipografia</CardTitle>
              <CardDescription>Hierarquia e ritmo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <h1 className="text-h1 font-serif">Heading 1</h1>
              <h2 className="text-h2">Heading 2</h2>
              <h3 className="text-h3">Heading 3</h3>
              <p className="text-p">Texto base com leitura confortável.</p>
              <p className="text-sm text-muted-foreground">
                Texto auxiliar e metadados.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Espaçamento</CardTitle>
              <CardDescription>Grid de 8pt para layout consistente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[8, 16, 24, 32].map((size) => (
                <div key={size} className="flex items-center gap-3">
                  <div
                    className="h-3 rounded-full bg-primary/20"
                    style={{ width: `${size}px` }}
                  />
                  <span className="text-sm text-muted-foreground">{size}px</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raio e sombras</CardTitle>
              <CardDescription>Profundidade sutil e leve</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4 shadow-[var(--shadow-sm)]">
                <p className="text-sm font-medium">Sombra leve</p>
              </div>
              <div className="rounded-2xl border border-border p-4 shadow-[var(--shadow-md)]">
                <p className="text-sm font-medium">Sombra média</p>
              </div>
              <div className="rounded-3xl border border-border p-4 shadow-[var(--shadow-lg)] col-span-2">
                <p className="text-sm font-medium">Sombra profunda</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Botões e estados</CardTitle>
              <CardDescription>Hover, active e disabled</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button>Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destrutivo</Button>
              <Button disabled>Disabled</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campos</CardTitle>
              <CardDescription>Inputs com acessibilidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="showcase-email">Email</Label>
                <Input id="showcase-email" placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="showcase-password">Senha</Label>
                <Input
                  id="showcase-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="showcase-message">Mensagem</Label>
                <Textarea
                  id="showcase-message"
                  placeholder="Escreva uma mensagem..."
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                <div className="space-y-1">
                  <Label htmlFor="showcase-notifications">Notificações</Label>
                  <p className="text-xs text-muted-foreground">
                    Receber alertas por email.
                  </p>
                </div>
                <Switch id="showcase-notifications" defaultChecked />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="showcase-terms" defaultChecked />
                <Label htmlFor="showcase-terms">Aceito os termos</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
