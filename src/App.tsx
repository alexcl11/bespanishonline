import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Check,
  BookOpen,
  Award,
  Clock,
  MessageSquare,
  Star,
  ArrowRight,
  Instagram,
  Linkedin,
  Youtube,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Copy,
  ExternalLink,
  Sparkles,
  Play,
  Volume2,
  Phone,
  Globe,
  GraduationCap,
  Laptop,
  Heart,
  Smile,
  Lightbulb,
  Trophy,
  CreditCard
} from 'lucide-react';

// Tipos de datos para el simulador de Stripe
interface Bono {
  id: string;
  name: string;
  hours: number;
  price: number;
  pricePerHour: number;
  savings: number;
  popular: boolean;
  features: string[];
  stripeLinkPlaceholder: string;
  category: 'general' | 'dele';
  description: string;
}

export default function App() {
  // Estados para la navegación
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // Estados para el FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Estados para el Test de Nivel
  const [quizStep, setQuizStep] = useState<number>(0); // 0: No iniciado, 1, 2, 3: preguntas, 4: resultado
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [estimatedLevel, setEstimatedLevel] = useState<string>('');
  const [recommendedBono, setRecommendedBono] = useState<string>('');

  // Estados para el Formulario de Contacto
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    level: 'no-sure',
    goals: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Estado para el Modal de Stripe / Compra
  const [selectedBono, setSelectedBono] = useState<Bono | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Datos de los Bonos de Clases (Packages)
  const bonos: Bono[] = [
    {
      id: 'general-5',
      name: 'General Spanish',
      hours: 5,
      price: 125,
      pricePerHour: 25,
      savings: 0,
      popular: false,
      category: 'general',
      description: "Perfect if you'd like to try personalised lessons or need help with a specific topic.",
      features: [
        'Private one-to-one online lessons',
        'Personalised learning plan',
        'Native Spanish teacher from Spain',
        'Interactive materials and resources',
        'Speaking, grammar, listening, reading, and writing practice',
        'Flexible scheduling'
      ],
      stripeLinkPlaceholder: 'https://buy.stripe.com/test_general_5h_placeholder'
    },
    {
      id: 'general-10',
      name: 'General Spanish',
      hours: 10,
      price: 230,
      pricePerHour: 23,
      savings: 20, // (25 * 10) - 230 = 20
      popular: false,
      category: 'general',
      description: 'A great option for students who want to make consistent progress while saving on the hourly rate.',
      features: [
        'Private one-to-one online lessons',
        'Personalised learning plan',
        'Native Spanish teacher from Spain',
        'Interactive materials and resources',
        'Speaking, grammar, listening, reading, and writing practice',
        'Flexible scheduling'
      ],
      stripeLinkPlaceholder: 'https://buy.stripe.com/test_general_10h_placeholder'
    },
    {
      id: 'general-15',
      name: 'General Spanish',
      hours: 15,
      price: 300,
      pricePerHour: 20,
      savings: 75, // (25 * 15) - 300 = 75
      popular: true,
      category: 'general',
      description: 'Ideal for learners looking to build confidence and improve all language skills with a structured learning plan.',
      features: [
        'Private one-to-one online lessons',
        'Personalised learning plan',
        'Native Spanish teacher from Spain',
        'Interactive materials and resources',
        'Speaking, grammar, listening, reading, and writing practice',
        'Flexible scheduling'
      ],
      stripeLinkPlaceholder: 'https://buy.stripe.com/test_general_15h_placeholder'
    },
    {
      id: 'dele-5',
      name: 'DELE Preparation',
      hours: 5,
      price: 150,
      pricePerHour: 30,
      savings: 0,
      popular: false,
      category: 'dele',
      description: 'Perfect for reviewing specific exam sections or strengthening weaker skills before the exam.',
      features: [
        'Private 1-to-1 DELE exam preparation',
        'Focused on official Cervantes format',
        'Authentic exam materials & resources',
        'Accredited native examiner feedback',
        'Reading, listening, writing & speaking',
        'Flexible scheduling & strategies'
      ],
      stripeLinkPlaceholder: 'https://buy.stripe.com/test_dele_5h_placeholder'
    },
    {
      id: 'dele-10',
      name: 'DELE Preparation',
      hours: 10,
      price: 280,
      pricePerHour: 28,
      savings: 20, // (30 * 10) - 280 = 20
      popular: true,
      category: 'dele',
      description: 'Ideal for students who want structured preparation and targeted practice with exam strategies.',
      features: [
        'Private 1-to-1 DELE exam preparation',
        'Focused on official Cervantes format',
        'Authentic exam materials & resources',
        'Accredited native examiner feedback',
        'Reading, listening, writing & speaking',
        'Flexible scheduling & strategies'
      ],
      stripeLinkPlaceholder: 'https://buy.stripe.com/test_dele_10h_placeholder'
    },
    {
      id: 'dele-15',
      name: 'DELE Preparation',
      hours: 15,
      price: 375,
      pricePerHour: 25,
      savings: 75, // (30 * 15) - 375 = 75
      popular: false,
      category: 'dele',
      description: 'A complete preparation package with intensive practice, mock exams, personalised feedback, and confidence-building techniques for exam day.',
      features: [
        'Private 1-to-1 DELE exam preparation',
        'Focused on official Cervantes format',
        'Authentic exam materials & resources',
        'Accredited native examiner feedback',
        'Reading, listening, writing & speaking',
        'Flexible scheduling & strategies'
      ],
      stripeLinkPlaceholder: 'https://buy.stripe.com/test_dele_15h_placeholder'
    }
  ];

  // Datos de Testimonios (Testimonials)
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Marketing Director (United Kingdom)',
      text: 'Classes with María completely changed my life! I needed to learn Spanish to communicate with my suppliers in Barcelona. Her practical, business-focused approach gave me the fluency I needed in just 3 months.',
      rating: 5,
      tags: '15-Hour Package',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      name: 'Marc-Antoine Dubois',
      role: 'University Student (France)',
      text: 'I prepared for the DELE B2 exam with María. She explains complex grammar so easily and her materials are highly dynamic. I got my PASS mark with an excellent score. Highly recommended!',
      rating: 5,
      tags: '15-Hour DELE Package',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      name: 'David Koenig',
      role: 'Retired Expat in Málaga (Germany)',
      text: 'I was afraid of speaking Spanish at shops or with my neighbors. María is extremely patient, warm, and fun. Her classes are a safe space to make mistakes and learn. Now I speak with complete confidence!',
      rating: 5,
      tags: '10-Hour Package',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
    }
  ];

  // Quick level test questions
  const quizQuestions = [
    {
      question: '1. If a friend says to you: "¡Hola! ¿Cómo estás?", what is the most natural reply?',
      options: [
        { text: 'A) Tengo veinticinco años.', points: 1 },
        { text: 'B) Muy bien, gracias, ¿y tú?', points: 3 },
        { text: 'C) Ojalá estuviera en España en este momento.', points: 5 }
      ]
    },
    {
      question: '2. Choose the grammatically correct option to express a wish or desire about someone else:',
      options: [
        { text: 'A) Quiero que tú vienes a cenar hoy.', points: 1 },
        { text: 'B) Quiero que tú vengas a cenar hoy.', points: 5 },
        { text: 'C) Quiero tú venir a cenar hoy.', points: 2 }
      ]
    },
    {
      question: '3. If you hear the colloquial Spanish phrase "Estar de mala leche", it means that someone...',
      options: [
        { text: 'A) Is in a very bad mood.', points: 5 },
        { text: 'B) Does not like cow milk.', points: 1 },
        { text: 'C) Is having very good luck in life.', points: 2 }
      ]
    }
  ];

  // Efecto para resaltar la sección activa en el menú de navegación al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'sobre-mi', 'precios', 'contacto'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para hacer scroll suave
  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.offsetTop - 80; // Compensar la barra de navegación fija
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Manejar respuesta del quiz de nivel
  const handleQuizAnswer = (points: number) => {
    const newAnswers = [...quizAnswers, points];
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      // Calcular nivel
      const totalPoints = newAnswers.reduce((sum, p) => sum + p, 0);
      let level = '';
      let recommended = '';

      if (totalPoints <= 5) {
        level = 'Beginner (A1 - A2)';
        recommended = 'General Spanish 10-Hour Package or 5-Hour Package to start your learning journey with confidence.';
      } else if (totalPoints <= 11) {
        level = 'Intermediate (B1 - B2)';
        recommended = 'General Spanish 15-Hour Package - Ideal for building strong conversation skills and structural accuracy.';
      } else {
        level = 'Advanced (C1 - C2)';
        recommended = 'General Spanish 15-Hour Package - Perfect for polishing advanced nuances, native expressions, and achieving complete fluency.';
      }

      setEstimatedLevel(level);
      setRecommendedBono(recommended);
      setQuizStep(4); // Pantalla de resultado
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setEstimatedLevel('');
    setRecommendedBono('');
  };

  // Manejar el formulario de contacto
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío de API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Resetear formulario
      setFormData({
        name: '',
        email: '',
        level: 'no-sure',
        goals: 'general',
        message: ''
      });
    }, 1200);
  };

  // Copiar el enlace de pago placeholder en el modal de Stripe
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-terracotta selection:text-white" id="inicio">

      {/* 1. BARRA DE NAVEGACIÓN FIJA */}
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-40 border-b border-slate-100 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center">

            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => scrollTo('inicio')}
              id="nav-logo"
            >
              <div className="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center text-white font-display font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
                ES
              </div>
              <div>
                <span className="font-display font-bold text-navy text-lg block leading-none">Be Spanish</span>
                <span className="text-xs text-terracotta font-medium tracking-wider uppercase">María López Hernán</span>
              </div>
            </div>

            {/* Enlaces Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollTo('inicio')}
                className={`font-medium text-sm transition-colors cursor-pointer ${activeSection === 'inicio' ? 'text-terracotta font-semibold' : 'text-navy-light hover:text-terracotta'}`}
                id="link-inicio"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo('sobre-mi')}
                className={`font-medium text-sm transition-colors cursor-pointer ${activeSection === 'sobre-mi' ? 'text-terracotta font-semibold' : 'text-navy-light hover:text-terracotta'}`}
                id="link-sobre-mi"
              >
                About Me
              </button>
              <button
                onClick={() => scrollTo('precios')}
                className={`font-medium text-sm transition-colors cursor-pointer ${activeSection === 'precios' ? 'text-terracotta font-semibold' : 'text-navy-light hover:text-terracotta'}`}
                id="link-precios"
              >
                Rates & Packages
              </button>
              <button
                onClick={() => scrollTo('contacto')}
                className={`font-medium text-sm transition-colors cursor-pointer ${activeSection === 'contacto' ? 'text-terracotta font-semibold' : 'text-navy-light hover:text-terracotta'}`}
                id="link-contacto"
              >
                Contact
              </button>

              <button
                onClick={() => scrollTo('precios')}
                className="bg-terracotta hover:bg-terracotta-hover text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-md cursor-pointer shadow-xs"
                id="btn-nav-cta"
              >
                Book Lesson
              </button>
            </div>

            {/* Hamburguesa Mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-navy hover:text-terracotta p-2 focus:outline-hidden cursor-pointer"
                aria-label="Open menu"
                id="btn-mobile-toggle"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Menú Mobile desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-3 shadow-lg absolute w-full left-0 animate-fadeIn" id="mobile-menu-dropdown">
            <button
              onClick={() => scrollTo('inicio')}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium text-base ${activeSection === 'inicio' ? 'bg-terracotta/5 text-terracotta font-semibold' : 'text-navy hover:bg-slate-50'}`}
              id="mobile-link-inicio"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('sobre-mi')}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium text-base ${activeSection === 'sobre-mi' ? 'bg-terracotta/5 text-terracotta font-semibold' : 'text-navy hover:bg-slate-50'}`}
              id="mobile-link-sobre-mi"
            >
              About Me
            </button>
            <button
              onClick={() => scrollTo('precios')}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium text-base ${activeSection === 'precios' ? 'bg-terracotta/5 text-terracotta font-semibold' : 'text-navy hover:bg-slate-50'}`}
              id="mobile-link-precios"
            >
              Rates & Packages
            </button>
            <button
              onClick={() => scrollTo('contacto')}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium text-base ${activeSection === 'contacto' ? 'bg-terracotta/5 text-terracotta font-semibold' : 'text-navy hover:bg-slate-50'}`}
              id="mobile-link-contacto"
            >
              Contact
            </button>
            <div className="pt-2">
              <button
                onClick={() => scrollTo('precios')}
                className="w-full bg-terracotta hover:bg-terracotta-hover text-white text-center py-3 rounded-xl font-semibold transition-all shadow-xs cursor-pointer block"
                id="mobile-btn-cta"
              >
                Book a Lesson Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Margen para compensar la barra fija */}
      <div className="h-18"></div>

      {/* 2. SECCIÓN HERO (INICIO) */}
      <header className="relative py-12 md:py-24 overflow-hidden bg-radial from-orange-50/70 via-bg-warm to-bg-warm" id="hero-section">
        {/* Decoraciones de fondo sutiles */}
        <div className="absolute top-1/4 -left-16 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -right-16 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Contenido Izquierdo */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta-light text-terracotta font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Learn with a Native Spanish Teacher
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-navy leading-tight tracking-tight" id="hero-title">
                Learn Spanish <br />
                <span className="text-terracotta bg-linear-to-r from-terracotta to-orange-600 bg-clip-text text-transparent">at your own pace</span> <br />
                without the stress.
              </h1>

              <p className="text-lg md:text-xl text-navy-light max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed" id="hero-subtitle">
                Private, engaging, and personalized online Spanish lessons tailored to your exact lifestyle and goals. Break the barrier of speaking and express yourself naturally from day one!
              </p>

              {/* Botoneras */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button
                  onClick={() => scrollTo('precios')}
                  className="bg-terracotta hover:bg-terracotta-hover text-white px-8 py-4 rounded-full text-base font-bold shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                  id="hero-cta-btn"
                >
                  View Packages & Book
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollTo('sobre-mi')}
                  className="bg-white hover:bg-slate-50 text-navy border border-slate-200 px-8 py-4 rounded-full text-base font-semibold shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  id="hero-secondary-btn"
                >
                  Meet María
                </button>
              </div>

              {/* Pequeños distintivos */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/60 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="block text-2xl md:text-3xl font-bold text-terracotta">15+ years</span>
                  <span className="text-xs text-navy-light">Experience</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block text-2xl md:text-3xl font-bold text-terracotta">100%</span>
                  <span className="text-xs text-navy-light">Online 1-on-1</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block text-2xl md:text-3xl font-bold text-terracotta">A1-C2</span>
                  <span className="text-xs text-navy-light">All Levels</span>
                </div>
              </div>
            </div>

            {/* Contenido Derecho (Ilustración / Visual de la profesora) */}
            <div className="lg:col-span-5 flex justify-center relative animate-fadeIn" id="hero-visual-container">
              {/* Círculo decorativo de fondo */}
              <div className="absolute inset-0 bg-linear-to-tr from-terracotta/20 to-orange-200/40 rounded-full blur-2xl transform scale-90 -z-10"></div>

              <div className="relative">
                {/* Imagen principal */}
                <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-all duration-500 transform hover:scale-102">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=800"
                    alt="Spanish Teacher María López Hernán smiling with laptop"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    id="hero-teacher-img"
                  />
                </div>

                {/* Tarjetas flotantes interactivas */}
                <div className="absolute -bottom-4 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-navy-light font-medium">Trial Session</span>
                    <span className="block text-sm font-bold text-navy">Get started today!</span>
                  </div>
                </div>


              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 3. SECCIÓN "SOBRE MÍ" (ABOUT ME) */}
      <section className="py-20 bg-white" id="sobre-mi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy">About Me & My Method</h2>
            <div className="w-16 h-1 bg-terracotta mx-auto mt-4 rounded-full"></div>
            <p className="text-navy-light mt-4 text-lg">
              Get to know my background and my personalized approach to teaching Spanish.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Foto e Info Rápida (Col 5) */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left lg:sticky lg:top-24" id="about-photo-block">
              <div className="relative inline-block">
                {/* Photo */}
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-slate-50 shadow-xl mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=600"
                    alt="María López Hernán"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    id="about-profile-img"
                  />
                </div>
                {/* Badge */}
                <div className="absolute bottom-4 right-4 bg-terracotta text-white p-3 rounded-full shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-bg-warm p-6 rounded-2xl border border-orange-100 max-w-md mx-auto lg:mx-0">
                <h4 className="font-display font-bold text-navy mb-2 text-base">My Credentials:</h4>
                <ul className="space-y-2 text-sm text-navy-light text-left">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>Degree in Hispanic Philology (University of Salamanca).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>Master's Degree in Teaching Spanish as a Foreign Language (ELE).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>Accredited DELE examiner for all levels (A1–C2) at the Instituto Cervantes.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Presentación y Método (Col 7) */}
            <div className="lg:col-span-7 space-y-8" id="about-content-block">
              <div className="space-y-4">
                <h3 className="text-3xl font-display font-bold text-navy flex items-center gap-2">
                  Hi! I'm María <Smile className="w-7 h-7 text-terracotta animate-pulse" />
                </h3>
                <p className="text-lg text-navy-light font-light leading-relaxed">
                  I'm a passionate native Spanish teacher from Spain with <strong className="text-navy font-semibold">more than 15 years of experience</strong> helping students from all over the world speak Spanish with confidence.
                </p>
                <p className="text-base text-navy-light font-light leading-relaxed">
                  Whether you're learning Spanish for travel, work, exams, or simply for fun, I'll create a learning experience that is completely tailored to you. Every student has different goals, and that's exactly how I teach.
                </p>
              </div>

              {/* Section cards for key offerings */}
              <div className="space-y-6">

                {/* 1. Adults & Kids */}
                <div className="bg-bg-warm p-6 rounded-2xl border border-slate-100 hover:border-orange-100 transition-all duration-300">
                  <h4 className="font-display font-bold text-navy text-lg flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-terracotta shrink-0" /> Online Spanish Classes for Adults and Kids
                  </h4>
                  <p className="text-sm text-navy-light leading-relaxed">
                    I offer private online Spanish lessons for both adults and children, from complete beginners to advanced learners. My lessons are engaging, practical, and designed to help you communicate naturally in real-life situations.
                  </p>
                  <p className="text-xs text-terracotta font-semibold mt-2">
                    If you're looking for a Spanish tutor online, you're in the right place!
                  </p>
                </div>

                {/* 2. DELE Prep */}
                <div className="bg-bg-warm p-6 rounded-2xl border border-slate-100 hover:border-orange-100 transition-all duration-300">
                  <h4 className="font-display font-bold text-navy text-lg flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-terracotta shrink-0" /> DELE Exam Preparation
                  </h4>
                  <p className="text-sm text-navy-light leading-relaxed">
                    Are you planning to take the DELE exam from the Instituto Cervantes? I provide personalised DELE preparation courses for all levels (A1–C2), helping you improve every exam skill: speaking, listening, reading, and writing. Together, we'll build your confidence and prepare you to achieve your best possible result.
                  </p>
                </div>

                {/* 3. Personalised Lessons */}
                <div className="bg-bg-warm p-6 rounded-2xl border border-slate-100 hover:border-orange-100 transition-all duration-300">
                  <h4 className="font-display font-bold text-navy text-lg flex items-center gap-2 mb-3">
                    <Laptop className="w-5 h-5 text-terracotta shrink-0" /> 100% Private & Personalised Lessons
                  </h4>
                  <p className="text-sm text-navy-light mb-3 leading-relaxed">
                    All lessons are taught online via Zoom in private one-to-one sessions. This means every class is focused on your needs, your pace, and your learning style.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-navy-light">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div>
                      <span>Fully personalised lesson plans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div>
                      <span>Speaking-focused classes from day one</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div>
                      <span>Grammar explained simply and practically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div>
                      <span>Real conversations & authentic materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div>
                      <span>Flexible schedules to fit your lifestyle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div>
                      <span>Continuous support throughout your journey</span>
                    </div>
                  </div>
                </div>

                {/* 4. Philosophy */}
                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/80">
                  <h4 className="font-display font-bold text-navy text-lg flex items-center gap-2 mb-2 text-terracotta">
                    <Heart className="w-5 h-5 text-terracotta fill-terracotta shrink-0" /> My Teaching Philosophy
                  </h4>
                  <p className="text-sm text-navy-light leading-relaxed">
                    Learning Spanish shouldn't feel stressful or overwhelming. My goal is to make every lesson motivating, interactive, and enjoyable so that you feel comfortable making mistakes, asking questions, and speaking with confidence.
                  </p>
                  <p className="text-sm text-navy-light font-medium mt-2">
                    Together, we'll turn Spanish into a language you truly enjoy using.
                  </p>
                </div>

              </div>

              {/* Ready to start CTA */}
              <div className="pt-4 border-t border-slate-100 text-center sm:text-left space-y-4">
                <h4 className="font-display font-bold text-navy text-xl">Ready to start?</h4>
                <p className="text-sm text-navy-light">Book your first lesson today and let's make Spanish part of your life!</p>
                <div>
                  <button
                    onClick={() => scrollTo('contacto')}
                    className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-hover text-white px-6 py-3 rounded-full text-sm font-bold shadow-sm transition-all duration-300 cursor-pointer"
                    id="btn-about-cta"
                  >
                    Book Your First Lesson Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* QUICK LEVEL TEST */}
      <section className="py-16 bg-bg-light border-y border-slate-100" id="test-nivel-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-bl-full pointer-events-none"></div>

            {quizStep === 0 && (
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Spanish Students
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-navy">Not sure about your current Spanish level?</h3>
                <p className="text-navy-light text-base max-w-xl mx-auto font-light">
                  Answer these 3 quick questions based on everyday situations and colloquial Spanish. We'll recommend the ideal package for your skills!
                </p>
                <button
                  onClick={() => setQuizStep(1)}
                  className="bg-navy hover:bg-navy-light text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                  id="start-quiz-btn"
                >
                  Start Quick Quiz (1 Min)
                </button>
              </div>
            )}

            {quizStep >= 1 && quizStep <= 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center text-xs text-navy-light font-medium max-w-md mx-auto mb-2">
                  <span>Question {quizStep} of 3</span>
                  <span className="text-terracotta font-semibold">Progress: {Math.round(((quizStep - 1) / 3) * 100)}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full max-w-md mx-auto overflow-hidden">
                  <div
                    className="bg-terracotta h-full transition-all duration-300"
                    style={{ width: `${((quizStep) / 3) * 100}%` }}
                  ></div>
                </div>

                <h4 className="text-lg md:text-xl font-bold text-navy max-w-2xl mx-auto leading-normal">
                  {quizQuestions[quizStep - 1].question}
                </h4>

                <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto pt-2">
                  {quizQuestions[quizStep - 1].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option.points)}
                      className="text-left p-4 rounded-xl border border-slate-200 hover:border-terracotta hover:bg-orange-50/20 text-sm font-medium text-navy transition-all duration-200 cursor-pointer flex items-center justify-between group"
                    >
                      <span>{option.text}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-terracotta group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto text-2xl font-bold">
                  <Trophy className="w-8 h-8 text-terracotta" />
                </div>
                <div>
                  <span className="text-xs font-bold text-navy-light uppercase tracking-wider block mb-1">Estimated Level</span>
                  <h4 className="text-3xl font-display font-bold text-terracotta">{estimatedLevel}</h4>
                </div>
                <p className="text-navy-light text-base max-w-xl mx-auto font-light leading-relaxed">
                  Based on your answers, this is your estimated level. To help you level up, we suggest the following package: <br />
                  <strong className="text-navy block mt-2 font-semibold">{recommendedBono}</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => scrollTo('precios')}
                    className="bg-terracotta hover:bg-terracotta-hover text-white px-8 py-3 rounded-full font-bold shadow-sm transition-all cursor-pointer"
                    id="quiz-pricing-btn"
                  >
                    View Recommended Packages
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="bg-slate-100 hover:bg-slate-200 text-navy-light px-6 py-3 rounded-full font-medium transition-all cursor-pointer"
                    id="quiz-retry-btn"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN "PRECIOS" (TARIFAS Y BONOS) */}
      <section className="py-20 bg-bg-warm relative" id="precios">
        <div className="absolute inset-0 bg-[radial-gradient(#e05a36_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Main Pricing Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-terracotta font-semibold text-sm tracking-widest uppercase block mb-2">Invest in your Spanish</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy">Spanish Lesson Packages</h2>
            <div className="w-16 h-1 bg-terracotta mx-auto mt-4 rounded-full"></div>
            <p className="text-navy-light mt-6 text-lg leading-relaxed">
              Choose the package that best fits your goals and learn Spanish at your own pace. All lessons are 100% private, fully personalised, and taught online via Zoom.
            </p>
            <p className="text-navy-light/80 mt-3 text-sm leading-relaxed max-w-2xl mx-auto">
              Whether you're learning Spanish for travel, work, everyday communication, or preparing for the DELE exam, each lesson is designed specifically for you.
            </p>
          </div>

          {/* What's Included Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs max-w-4xl mx-auto mb-20">
            <h3 className="font-display font-bold text-navy text-xl mb-6 text-center flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" /> What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                "Private one-to-one online lessons",
                "Personalised learning plan",
                "Native Spanish teacher from Spain",
                "Interactive materials and resources",
                "Speaking, grammar, listening, reading, and writing practice",
                "Flexible scheduling"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-navy-light">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION A: General Spanish Packages */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">General Courses</span>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-navy mt-3">General Spanish Packages</h3>
              <p className="text-navy-light mt-2 text-sm">
                Build confidence and flow in everyday real-world Spanish communication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto" id="pricing-grid-general">
              {bonos.filter(b => b.category === 'general').map((bono) => (
                <div
                  key={bono.id}
                  className={`bg-white rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 border relative ${bono.popular
                      ? 'border-terracotta shadow-xl scale-102 ring-4 ring-terracotta/5'
                      : 'border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md'
                    }`}
                  id={`card-${bono.id}`}
                >
                  {/* Badge Más Popular */}
                  {bono.popular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-terracotta text-white text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                  )}

                  <div>
                    {/* Encabezado Tarjeta */}
                    <div className="mb-6 text-center">
                      <h4 className="text-lg font-display font-bold text-navy">
                        {bono.hours}-Hour Package
                      </h4>

                      {/* Tarifa por hora detallada */}
                      <div className="mt-4 flex items-baseline justify-center gap-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight">
                          €{bono.price}
                        </span>
                      </div>

                      <span className="text-xs text-navy-light block mt-2 font-medium">
                        Just €{bono.pricePerHour.toFixed(2)} / 60-min lesson
                      </span>

                      {bono.savings > 0 ? (
                        <span className="inline-block mt-3 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full">
                          Save €{bono.savings}!
                        </span>
                      ) : (
                        <span className="inline-block mt-3 bg-slate-50 text-slate-500 text-[10px] px-3 py-1 rounded-full">
                          Standard base rate
                        </span>
                      )}
                    </div>

                    {/* Línea divisoria */}
                    <div className="border-t border-slate-100 my-4"></div>

                    <p className="text-xs text-navy-light/90 leading-relaxed text-center mb-6 min-h-[48px] italic">
                      "{bono.description}"
                    </p>
                  </div>

                  {/* Botón Comprar ahora */}
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => setSelectedBono(bono)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 text-center cursor-pointer ${bono.popular
                          ? 'bg-terracotta hover:bg-terracotta-hover text-white shadow-sm hover:shadow-md'
                          : 'bg-navy hover:bg-navy-light text-white'
                        }`}
                      id={`btn-buy-${bono.id}`}
                    >
                      Buy Now
                    </button>
                    <p className="text-[9px] text-center text-slate-400 mt-2">
                      One-time payment, 100% secure via Stripe
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: DELE Prep Packages */}
          <div className="mb-24">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">Official Exams</span>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-navy mt-3">DELE Preparation Packages</h3>
              <p className="text-navy-light mt-4 text-sm leading-relaxed max-w-2xl mx-auto">
                Prepare for the Instituto Cervantes DELE exam with personalised one-to-one lessons focused on the official exam format. We'll work on all four skills—reading, listening, writing, and speaking—using authentic exam materials, practical strategies, and individual feedback to help you achieve your target level.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto" id="pricing-grid-dele">
              {bonos.filter(b => b.category === 'dele').map((bono) => (
                <div
                  key={bono.id}
                  className={`bg-white rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 border relative ${bono.popular
                      ? 'border-terracotta shadow-xl scale-102 ring-4 ring-terracotta/5'
                      : 'border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md'
                    }`}
                  id={`card-${bono.id}`}
                >
                  {/* Badge Más Popular */}
                  {bono.popular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-terracotta text-white text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                  )}

                  <div>
                    {/* Encabezado Tarjeta */}
                    <div className="mb-6 text-center">
                      <h4 className="text-lg font-display font-bold text-navy">
                        {bono.hours}-Hour DELE Package
                      </h4>

                      {/* Tarifa por hora detallada */}
                      <div className="mt-4 flex items-baseline justify-center gap-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight">
                          €{bono.price}
                        </span>
                      </div>

                      <span className="text-xs text-navy-light block mt-2 font-medium">
                        Just €{bono.pricePerHour.toFixed(2)} / 60-min lesson
                      </span>

                      {bono.savings > 0 ? (
                        <span className="inline-block mt-3 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full">
                          Save €{bono.savings}!
                        </span>
                      ) : (
                        <span className="inline-block mt-3 bg-slate-50 text-slate-500 text-[10px] px-3 py-1 rounded-full">
                          Standard base rate
                        </span>
                      )}
                    </div>

                    {/* Línea divisoria */}
                    <div className="border-t border-slate-100 my-4"></div>

                    <p className="text-xs text-navy-light/90 leading-relaxed text-center mb-6 min-h-[48px] italic">
                      "{bono.description}"
                    </p>
                  </div>

                  {/* Botón Comprar ahora */}
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => setSelectedBono(bono)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 text-center cursor-pointer ${bono.popular
                          ? 'bg-terracotta hover:bg-terracotta-hover text-white shadow-sm hover:shadow-md'
                          : 'bg-navy hover:bg-navy-light text-white'
                        }`}
                      id={`btn-buy-${bono.id}`}
                    >
                      Buy Now
                    </button>
                    <p className="text-[9px] text-center text-slate-400 mt-2">
                      One-time payment, 100% secure via Stripe
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* SECTION C: Ready to Start CTA Block */}
          <div className="bg-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl max-w-5xl mx-auto mb-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold">Ready to Start?</h3>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                Choose the package that best suits your goals and start learning Spanish with personalised lessons designed just for you. Whether you want to improve your communication skills or pass the DELE exam, I'll be happy to guide you every step of the way.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => scrollTo('contacto')}
                  className="bg-terracotta hover:bg-terracotta-hover text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  Book Your Pack & Schedule Now
                </button>
              </div>
            </div>
          </div>

          {/* Garantías */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-5xl mx-auto">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-terracotta flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-navy text-sm mb-1">Satisfaction Guarantee</h4>
                <p className="text-xs text-navy-light leading-relaxed">
                  If your first class doesn't meet your expectations, we will refund 100% of your payment immediately, no questions asked.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-terracotta flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-navy text-sm mb-1">No Strict Expiry Date</h4>
                <p className="text-xs text-navy-light leading-relaxed">
                  We understand life gets busy. Packages are valid for up to 1 year, so you can schedule sessions at your own pace.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-terracotta flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-navy text-sm mb-1">Continuous Support</h4>
                <p className="text-xs text-navy-light leading-relaxed">
                  You are not alone between lessons. Feel free to send me short writings or quick questions on WhatsApp for feedback.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-white" id="testimonios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-terracotta font-semibold text-sm tracking-widest uppercase block mb-2">Real student reviews</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy">Success Stories from My Students</h2>
            <div className="w-16 h-1 bg-terracotta mx-auto mt-4 rounded-full"></div>
            <p className="text-navy-light mt-4 text-lg">
              Students from all over the world who have successfully unlocked their Spanish and expanded their opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-bg-light rounded-2xl p-8 border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                id={`testimonial-card-${idx}`}
              >
                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-sm md:text-base text-navy-light font-light italic leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200/50">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-navy text-sm leading-none">{t.name}</h4>
                    <span className="text-xs text-navy-light block mt-1">{t.role}</span>
                    <span className="inline-block mt-2 bg-orange-100/50 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      {t.tags}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section className="py-20 bg-bg-light border-y border-slate-100" id="faqs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-terracotta mx-auto mt-4 rounded-full"></div>
            <p className="text-navy-light mt-4 text-lg">
              Have questions about how classes work? Find quick answers right here.
            </p>
          </div>

          <div className="space-y-4" id="faqs-accordion">
            {[
              {
                q: 'How do I book my lesson dates and times?',
                a: 'Once you purchase a package, you will receive an automatic email with a link to my Calendly calendar. You can easily pick the days and times that work best for you week by week.'
              },
              {
                q: 'What happens if I need to cancel or reschedule a lesson?',
                a: 'No problem! I understand schedules change. You can easily reschedule or cancel for free directly through the booking link, as long as you do so at least 24 hours in advance.'
              },
              {
                q: 'What platform will we use for the sessions?',
                a: 'We mainly connect via Zoom or Google Meet. The link for each class is generated automatically and added to your calendar event. All you need is a computer or tablet with a camera, a stable microphone, and a good internet connection.'
              },
              {
                q: 'Are study materials included, or do I need to buy books?',
                a: 'All learning materials are 100% included in the package cost. In every lesson, we share dynamic PDFs, readings, recordings, and interactive exercises. You will also get a personal Google Drive folder with indefinite access.'
              },
              {
                q: 'Do you offer preparation classes for the DELE exam?',
                a: 'Yes, absolutely! As an accredited DELE examiner for levels A1 through C2 from the Instituto Cervantes, I know the exam structure, criteria, and grading rubrics inside out. I will provide real simulations and key strategies to help you pass.'
              },
              {
                q: 'How is the payment processed?',
                a: 'Payment is made safely via credit or debit card. The payment gateway is fully encrypted and operated by Stripe, the global leader in online payments. We do not store your banking details.'
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left font-semibold text-navy hover:text-terracotta transition-colors flex justify-between items-center cursor-pointer"
                    id={`faq-btn-${index}`}
                  >
                    <span className="text-base leading-tight">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-terracotta shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-navy-light font-light leading-relaxed bg-slate-50/50 animate-fadeIn" id={`faq-ans-${index}`}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section className="py-20 bg-white" id="contacto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

            {/* Left Contact Info (Col 5) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8" id="contact-info-block">
              <div className="space-y-6 text-center lg:text-left">
                <span className="text-terracotta font-semibold text-sm tracking-widest uppercase block">Take the first step</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-navy">Let's discuss your goals!</h2>
                <div className="w-16 h-1 bg-terracotta mx-auto lg:mx-0 mt-4 rounded-full"></div>
                <p className="text-navy-light text-base font-light leading-relaxed">
                  Have a question, want to schedule a free 15-minute introductory call, or need a customized proposal for your company? Fill out the form, and I'll get back to you as soon as possible.
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-6 pt-6 border-t border-slate-100 text-center lg:text-left">
                <div className="space-y-4">
                  <div>
                    <span className="block text-xs font-bold text-navy-light uppercase tracking-wider mb-2">Direct email:</span>
                    <a href="mailto:bespanishonline@gmail.com" className="text-lg font-bold text-terracotta hover:underline">
                      bespanishonline@gmail.com
                    </a>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-navy-light uppercase tracking-wider mb-2">Phone / WhatsApp:</span>
                    <a
                      href="https://wa.me/34669212912"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg font-bold text-navy hover:text-terracotta transition-colors"
                    >
                      <Phone className="w-5 h-5 text-terracotta" />
                      +34 669 212 912
                    </a>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-navy-light uppercase tracking-wider mb-3">Follow me on social media:</span>
                  <div className="flex gap-4 justify-center lg:justify-start">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-terracotta hover:text-white text-navy flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-terracotta hover:text-white text-navy flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-terracotta hover:text-white text-navy flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Contact Form (Col 7) */}
            <div className="lg:col-span-7 bg-bg-light rounded-3xl p-6 sm:p-10 border border-slate-200/60 shadow-sm" id="contact-form-block">
              {submitSuccess ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-6 py-8 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
                    ✓
                  </div>
                  <h3 className="text-2xl font-display font-bold text-navy">Message Sent Successfully!</h3>
                  <p className="text-navy-light text-base max-w-md mx-auto font-light leading-relaxed">
                    Thank you so much for reaching out! I've received your request. I will personally reply to your email within 24 hours. Speak soon!
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-navy hover:bg-navy-light text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer"
                    id="btn-new-contact"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5" id="form-contacto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs font-bold text-navy uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Sarah Jenkins"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition-all text-navy"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-bold text-navy uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g., sarah@example.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition-all text-navy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Level estimate */}
                    <div className="space-y-1.5">
                      <label htmlFor="level" className="block text-xs font-bold text-navy uppercase tracking-wider">
                        What is your Spanish level?
                      </label>
                      <select
                        id="level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-terracotta transition-all text-navy"
                      >
                        <option value="no-sure">I am not sure / I want an evaluation</option>
                        <option value="a1-a2">Beginner (A1 - A2)</option>
                        <option value="b1-b2">Intermediate (B1 - B2)</option>
                        <option value="c1-c2">Advanced (C1 - C2)</option>
                      </select>
                    </div>

                    {/* Goals */}
                    <div className="space-y-1.5">
                      <label htmlFor="goals" className="block text-xs font-bold text-navy uppercase tracking-wider">
                        Main Learning Goal
                      </label>
                      <select
                        id="goals"
                        value={formData.goals}
                        onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-terracotta transition-all text-navy"
                      >
                        <option value="general">General Spanish / Conversation</option>
                        <option value="business">Business Spanish / Workplace</option>
                        <option value="dele">DELE / SIELE Exam Prep</option>
                        <option value="travel">Upcoming travel to Spain / Latin America</option>
                        <option value="other">Other specific reason</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-bold text-navy uppercase tracking-wider">
                      Tell me a bit about yourself and your availability
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your motivation for learning Spanish and which days/times usually work best for your classes."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition-all text-navy"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-terracotta hover:bg-terracotta-hover disabled:bg-slate-400 text-white font-bold py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-sm tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer"
                    id="btn-submit-contacto"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message & Start'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-navy-light">
                    By submitting, you agree to receive a direct reply to your email. No spam, ever.
                  </p>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-navy text-white pt-16 pb-12 border-t border-slate-800" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">

            {/* Col 1: Logo & Info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center text-white font-display font-bold text-lg">
                  ES
                </div>
                <div>
                  <span className="font-display font-bold text-white text-lg block leading-none">Be Spanish</span>
                  <span className="text-[10px] text-orange-200/80 font-medium tracking-wider uppercase">María López Hernán · Spanish Lessons</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm font-light leading-relaxed">
                100% online individual tutoring and personalized lesson plans designed to take your listening and speaking skills to the next level with confidence and fun.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => scrollTo('inicio')} className="hover:text-terracotta cursor-pointer text-left">Home</button>
                </li>
                <li>
                  <button onClick={() => scrollTo('sobre-mi')} className="hover:text-terracotta cursor-pointer text-left">About Me</button>
                </li>
                <li>
                  <button onClick={() => scrollTo('precios')} className="hover:text-terracotta cursor-pointer text-left">Packages</button>
                </li>
                <li>
                  <button onClick={() => scrollTo('faqs')} className="hover:text-terracotta cursor-pointer text-left">FAQs</button>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Security */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Security & Trust</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                All payments are fully encrypted and securely processed through Stripe, the industry standard. Read more about rescheduling policies in our FAQs.
              </p>
              <div className="flex gap-4 text-[11px] text-slate-500 pt-1">
                <span className="hover:text-slate-300 cursor-pointer">Legal Notice</span>
                <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
                <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs text-slate-500 gap-4">
            <p id="copyright">
              © {new Date().getFullYear()} Be Spanish · María López Hernán. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-600">
              Clean, warm, and responsive design optimized for conversion.
            </p>
          </div>

        </div>
      </footer>

      {/* 7. INTERACTIVE STRIPE MODAL */}
      {selectedBono && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn" id="stripe-modal">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-fadeInUp">

            {/* Modal Header */}
            <div className="bg-navy p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center text-sm">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base leading-none">Stripe Payment Gateway</h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Admin Configuration Assistant</span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedBono(null); setIsCopied(false); }}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                id="btn-close-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">

              {/* Selected package info */}
              <div className="bg-bg-light p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Selected Package</span>
                <div className="flex justify-between items-center mt-1">
                  <h4 className="font-display font-bold text-navy text-lg">{selectedBono.hours}-Hour Package ({selectedBono.name})</h4>
                  <span className="text-xl font-extrabold text-terracotta">{selectedBono.price}€</span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-navy-light font-light">
                  <p>✓ 1-on-1 classes via Zoom/Meet</p>
                  <p>✓ Interactive materials and PDFs included</p>
                  {selectedBono.savings > 0 && <p className="text-emerald-600 font-semibold">✓ Special savings of {selectedBono.savings}€ applied</p>}
                </div>
              </div>

              {/* Informative box for the user admin */}
              <div className="bg-amber-50/75 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-2.5 leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Guide to integrate your real Stripe links</span>
                </div>
                <p>
                  To enable real credit card checkout with Stripe, generate a <strong>Payment Link</strong> in your Stripe dashboard and paste it into the application code.
                </p>
                <p>
                  Currently, checkout uses a test placeholder. You can easily update this in the <code>bonos</code> array in <code>/src/App.tsx</code> with your real Stripe URLs.
                </p>
              </div>

              {/* Copiable placeholder link */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-navy uppercase tracking-wider">
                  Stripe Placeholder URL Link:
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedBono.stripeLinkPlaceholder}
                    className="bg-transparent border-none text-xs text-slate-500 w-full focus:outline-hidden font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedBono.stripeLinkPlaceholder)}
                    className="bg-white hover:bg-slate-100 border border-slate-200 p-2 rounded-lg text-slate-600 hover:text-navy transition-all shrink-0 cursor-pointer"
                    title="Copy Link"
                    id="btn-copy-placeholder"
                  >
                    {isCopied ? <span className="text-[10px] font-bold text-emerald-600">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Secure transactions via HTTPS
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedBono(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-150 transition-all cursor-pointer"
                >
                  Go Back
                </button>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulator: Redirecting to Stripe placeholder: \n${selectedBono.stripeLinkPlaceholder}\n\nWhen you replace this with your real Stripe URL in the code, this button will open the real checkout window.`);
                  }}
                  className="w-full sm:w-auto bg-terracotta hover:bg-terracotta-hover text-white px-5 py-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1 transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  Simulate Checkout <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
