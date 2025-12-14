import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, ShoppingCart, Package, Users, CheckCircle } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Easy Purchasing',
      description: 'Browse and purchase sweets with real-time stock tracking',
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Admin dashboard for complete stock control',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure authentication with user and admin roles',
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Support for multiple users with separate accounts',
    },
  ];

  const techStack = [
    'React + TypeScript',
    'Express.js',
    'PostgreSQL + Prisma',
    'JWT Authentication',
    'Jest + Supertest',
    'Tailwind CSS',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
        
        <nav className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xl">🍬</span>
              </div>
              <span className="font-bold text-xl">Sweet Shop</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              🧪 Built with TDD
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Sweet Shop{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A production-ready full-stack application with secure authentication, 
              inventory management, and role-based access control.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button size="lg" asChild className="gap-2">
                <Link to="/register">
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Admin Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="text-muted-foreground">Everything you need to manage a sweet shop</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Tech Stack</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm py-1.5 px-3">
                    <CheckCircle className="h-3 w-3 mr-1.5" />
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to explore?</h2>
          <p className="text-muted-foreground">
            Login with demo credentials to see the full application
          </p>
          <div className="p-4 rounded-lg bg-muted/50 inline-block text-left font-mono text-sm">
            <p><span className="text-muted-foreground">Admin:</span> admin@sweetshop.com / Admin123!</p>
            <p><span className="text-muted-foreground">User:</span> user@sweetshop.com / User123!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Sweet Shop Management System — Built with ❤️ and TDD
        </div>
      </footer>
    </div>
  );
};

export default Landing;
