import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, CheckCircle, Star, Sparkles, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">
              QueroAgenda
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Começar Grátis
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80" 
            alt="Background" 
            className="w-full h-full object-cover blur-sm opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/90"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              <Sparkles className="h-3 w-3 mr-1" />
              Solução Completa para Clínicas Odontológicas
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Gerencie sua clínica com{" "}
              <span className="text-primary">
                simplicidade
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A plataforma completa para agendamento, gestão de pacientes e controle financeiro da sua clínica odontológica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="text-lg h-14"
              >
                Começar Agora - É Grátis
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14">
                Ver Demonstração
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Setup em 5 minutos</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-primary/30 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center justify-between p-4 bg-primary/5 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary"></div>
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      <div className="h-2 w-16 bg-gray-100 rounded mt-2"></div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Confirmado</Badge>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      <div className="h-2 w-16 bg-gray-100 rounded mt-2"></div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      <div className="h-2 w-16 bg-gray-100 rounded mt-2"></div>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary">Hoje</Badge>
                </motion.div>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="container mx-auto px-4 py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/10 to-transparent rounded-3xl -z-10"></div>
          
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-4">
              Interface Intuitiva
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Plataforma moderna e fácil de usar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acesse de qualquer dispositivo e gerencie sua clínica de forma eficiente
            </p>
          </div>

          {/* Main Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-white via-white to-primary/5 rounded-2xl shadow-2xl border border-border p-8 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Simulated browser bar */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/50"></div>
                    <div className="w-3 h-3 rounded-full bg-warning/50"></div>
                    <div className="w-3 h-3 rounded-full bg-success/50"></div>
                  </div>
                  <div className="flex-1 bg-muted/30 rounded-md h-6 mx-4"></div>
                </div>

                {/* Blurred dashboard content */}
                <div className="grid md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative group"
                    >
                      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-border/50 backdrop-blur-md hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-3 w-20 bg-muted/40 rounded blur-[2px]"></div>
                          <div className="w-8 h-8 rounded-lg bg-primary/20 blur-[1px]"></div>
                        </div>
                        <div className="h-8 w-16 bg-foreground/20 rounded mb-2 blur-[2px]"></div>
                        <div className="h-2 w-24 bg-muted/30 rounded blur-[2px]"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg backdrop-blur-sm border border-border/30"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 blur-[2px]"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-foreground/20 rounded w-1/3 blur-[2px]"></div>
                        <div className="h-2 bg-muted/40 rounded w-1/4 blur-[2px]"></div>
                      </div>
                      <div className="h-3 w-16 bg-muted/30 rounded blur-[2px]"></div>
                      <div className="h-6 w-20 bg-primary/20 rounded-full blur-[2px]"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlights with icons */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Visualização em Tempo Real</h3>
              <p className="text-sm text-muted-foreground">Acompanhe todas as informações ao vivo</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-1">Gestão Completa</h3>
              <p className="text-sm text-muted-foreground">Pacientes, dentistas e agendamentos</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold mb-1">Análises Detalhadas</h3>
              <p className="text-sm text-muted-foreground">Relatórios e métricas importantes</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-white">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-gray-600 mt-2">Clínicas Ativas</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-success/5 to-white">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-success">50k+</div>
                <div className="text-gray-600 mt-2">Agendamentos Mensais</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-success/5 to-white">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-success">98%</div>
                <div className="text-gray-600 mt-2">Satisfação dos Clientes</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-accent text-accent-foreground hover:bg-accent mb-4">
            Recursos
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Tudo que você precisa em{" "}
            <span className="text-primary">
              um só lugar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ferramentas poderosas para otimizar o dia a dia da sua clínica
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Agendamento Inteligente</CardTitle>
                <CardDescription>
                  Sistema completo de agendamento com confirmação automática e lembretes por WhatsApp
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Gestão de Pacientes</CardTitle>
                <CardDescription>
                  Prontuário digital completo, histórico de atendimentos e documentos em um só lugar
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-2 hover:border-success/30 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-success flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Economia de Tempo</CardTitle>
                <CardDescription>
                  Automatize processos repetitivos e foque no que realmente importa: seus pacientes
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-2 hover:border-warning/30 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-warning flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Relatórios e Análises</CardTitle>
                <CardDescription>
                  Dashboards intuitivos com métricas importantes para tomada de decisão
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-2 hover:border-accent/30 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent-foreground flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Experiência do Paciente</CardTitle>
                <CardDescription>
                  Agendamento online 24/7, confirmações automáticas e lembretes personalizados
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-2 hover:border-primary/30 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Segurança Total</CardTitle>
                <CardDescription>
                  Dados criptografados, backup automático e conformidade com LGPD
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-gray-50 to-white rounded-3xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-success/10 text-success hover:bg-success/10 mb-4">
            Planos
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Escolha o plano ideal para{" "}
            <span className="text-primary">
              sua clínica
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comece grátis e escale conforme cresce
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription>Para clínicas começando</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">Grátis</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Até 50 agendamentos/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>1 profissional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Gestão básica de pacientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Suporte por email</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" onClick={() => navigate('/dashboard')}>
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-4 border-primary hover:shadow-2xl transition-all relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Mais Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Professional</CardTitle>
                <CardDescription>Para clínicas em crescimento</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">R$ 149</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Agendamentos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Até 5 profissionais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>WhatsApp integrado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Relatórios avançados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button 
                  className="w-full mt-6"
                  onClick={() => navigate('/dashboard')}
                >
                  Começar Teste Grátis
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>Para redes de clínicas</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">Customizado</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Profissionais ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Múltiplas unidades</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>API personalizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Treinamento dedicado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Gerente de conta</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Falar com Vendas
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-warning/10 text-warning hover:bg-warning/10 mb-4">
            Depoimentos
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            O que nossos clientes{" "}
            <span className="text-primary">
              estão dizendo
            </span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "O QueroAgenda transformou completamente a gestão da minha clínica. Economizo pelo menos 2 horas por dia com agendamentos automáticos."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary"></div>
                  <div>
                    <div className="font-semibold">Dr. Carlos Silva</div>
                    <div className="text-sm text-gray-600">Clínica Odonto Plus</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "Meus pacientes adoram poder agendar pelo celular a qualquer hora. A taxa de faltas diminuiu 70% com os lembretes automáticos."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-success"></div>
                  <div>
                    <div className="font-semibold">Dra. Maria Santos</div>
                    <div className="text-sm text-gray-600">Sorriso Perfeito</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "Interface intuitiva e suporte excelente. Implantamos em 3 unidades e todos os funcionários aprenderam rapidamente."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent-foreground"></div>
                  <div>
                    <div className="font-semibold">Dr. Roberto Lima</div>
                    <div className="text-sm text-gray-600">Rede DentalCare</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl shadow-lg border border-border p-8 md:p-12">
              <div className="text-center space-y-6">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  Confiável e Seguro
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Milhares de profissionais confiam no QueroAgenda
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Nossa plataforma é desenvolvida pensando na segurança dos seus dados e na eficiência do seu atendimento. 
                  Junte-se aos profissionais que já transformaram a gestão de suas clínicas.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime garantido</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-success mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Suporte disponível</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">LGPD</div>
                    <div className="text-sm text-muted-foreground">100% Conformidade</div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/dashboard')}
                    className="text-lg h-12"
                  >
                    Começar Gratuitamente
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-none bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Pronto para transformar sua clínica?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Junte-se a centenas de clínicas que já usam o QueroAgenda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-white text-primary hover:bg-gray-100 text-lg h-14"
                >
                  Começar Agora - É Grátis
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 text-lg h-14"
                >
                  Agendar Demonstração
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">QueroAgenda</span>
            </div>
            <p className="text-gray-600 text-sm">
              A solução completa para gestão de clínicas odontológicas
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Recursos</li>
              <li>Preços</li>
              <li>Segurança</li>
              <li>Atualizações</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Sobre nós</li>
              <li>Blog</li>
              <li>Carreiras</li>
              <li>Contato</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Privacidade</li>
              <li>Termos de Uso</li>
              <li>LGPD</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          © 2026 QueroAgenda. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
