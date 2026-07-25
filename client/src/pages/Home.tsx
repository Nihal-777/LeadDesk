import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  Activity,
  CheckSquare,
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import api from '../services/api.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Select } from '../components/ui/Select.js';
import { Card, CardContent } from '../components/ui/Card.js';

// Zod Validation Schema
const leadFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Must be a valid email address' }),
  budget: z.string().min(1, { message: 'Budget range is required' }),
  message: z.string().min(20, { message: 'Message must be at least 20 characters long' }),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

export const Home: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      budget: '',
      message: '',
    },
  });

  // Submit Lead Mutation using TanStack Query
  const submitLeadMutation = useMutation({
    mutationFn: async (data: LeadFormValues) => {
      const response = await api.post('/leads', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Your message has been received! We will be in touch shortly.');
      reset();
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Failed to submit form. Please try again.';
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    submitLeadMutation.mutate(data);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Decorative Blur Blobs */}
      <div className="glow-blob top-20 left-[-100px] bg-blue-500" />
      <div className="glow-blob top-[60%] right-[-100px] bg-indigo-500" />

      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200/55 bg-white/70 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-950/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-550 shadow-md shadow-brand-500/20 text-white font-extrabold text-lg">
                LM
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                LeadDesk<span className="text-brand-550">.</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection('features')}
                className="hidden md:inline-flex border-none hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                Features
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection('testimonials')}
                className="hidden md:inline-flex border-none hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                Testimonials
              </Button>
              <Link to="/login">
                <Button variant="primary" size="sm" className="rounded-xl">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-900/50 dark:bg-brand-950/30 dark:text-brand-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-550" />
            Empowering modern businesses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white"
          >
            Grow Your Business{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">
              Faster
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium"
          >
            Capture, organize, and manage customer leads from one dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollToSection('capture-form')}
              className="group rounded-xl shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('features')}
              className="rounded-xl glass-panel"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-100/50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Why LeadDesk Mini?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-slate-400">
              We provide all the tools you need to streamline client acquisitions in a single elegant platform.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="transition-transform duration-300"
            >
              <Card className="h-full border border-slate-200/50 dark:border-slate-800/40">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 mb-5">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lead Capture</h3>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Convert landing page visitors into prospective clients via our beautiful, responsive capture forms.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="transition-transform duration-300"
            >
              <Card className="h-full border border-slate-200/50 dark:border-slate-800/40">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 mb-5">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lead Tracking</h3>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Get deep insights into lead distribution, client budgets, and engagement trends in real-time.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="transition-transform duration-300"
            >
              <Card className="h-full border border-slate-200/50 dark:border-slate-800/40">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 mb-5">
                    <CheckSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Status Management</h3>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Instantly update pipeline stages from New to Contacted or Closed to maintain sales momentum.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="py-16 bg-gradient-to-r from-brand-900 to-indigo-950 text-white relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div>
              <div className="flex justify-center text-brand-300 mb-2">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-4xl font-extrabold">500+</div>
              <div className="mt-2 text-sm font-semibold tracking-wider uppercase text-brand-200">Active Clients</div>
            </div>
            <div>
              <div className="flex justify-center text-brand-300 mb-2">
                <Briefcase className="h-8 w-8" />
              </div>
              <div className="text-4xl font-extrabold">20K+</div>
              <div className="mt-2 text-sm font-semibold tracking-wider uppercase text-brand-200">Leads Managed</div>
            </div>
            <div>
              <div className="flex justify-center text-brand-300 mb-2">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="text-4xl font-extrabold">98%</div>
              <div className="mt-2 text-sm font-semibold tracking-wider uppercase text-brand-200">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Trusted by Growth Teams
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-slate-400">
              Read how scaling brands leverage LeadDesk Mini to optimize their customer pipeline.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="border border-slate-200/50 dark:border-slate-800/40">
              <CardContent className="pt-6 flex flex-col justify-between h-full">
                <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                  "LeadDesk Mini completely transformed our outbound process. We went from messy spreadsheets to a polished central interface in under a day. The lead capture form is incredibly easy to set up."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah Koenig</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Operations Director, ScalingFlow</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border border-slate-200/50 dark:border-slate-800/40">
              <CardContent className="pt-6 flex flex-col justify-between h-full">
                <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                  "The UI is gorgeous and responsive. My team updates status changes directly on the floor using their tablets. The real-time filtering helps us focus on hot leads instantly. Highly recommended!"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 text-white font-bold text-sm">
                    MA
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Marcus Aurelius</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sales Lead, Horizon Tech</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border border-slate-200/50 dark:border-slate-800/40">
              <CardContent className="pt-6 flex flex-col justify-between h-full">
                <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                  "Having visual charts of budget distributions and statuses helps me plan monthly allocations. The CSV export is also incredibly handy for sharing reports with external stakeholders."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold text-sm">
                    EL
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Elena Rostova</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Founder, Spark Agency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. LEAD CAPTURE FORM SECTION */}
      <section id="capture-form" className="py-20 bg-slate-100/50 dark:bg-slate-900/20 relative">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-slate-200/60 shadow-xl dark:border-slate-800/60 p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Connect With Us</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Submit your inquiry and we'll reply with a custom quote within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                id="name"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                id="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Select
                label="Budget Range"
                id="budget"
                options={[
                  { value: '', label: 'Select budget range' },
                  { value: 'Under $500', label: 'Under $500' },
                  { value: '$500–$1000', label: '$500–$1000' },
                  { value: '$1000–$5000', label: '$1000–$5000' },
                  { value: 'Above $5000', label: 'Above $5000' },
                ]}
                error={errors.budget?.message}
                {...register('budget')}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us about your project requirements in detail..."
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-all duration-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                    errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  {...register('message')}
                />
                {errors.message && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 rounded-xl py-3 text-sm font-semibold shadow-md"
                isLoading={submitLeadMutation.isPending}
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800/60 py-8 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-550 text-white font-extrabold text-xs">
                LM
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                LeadDesk Mini
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Built for <a href="https://digitalheroes.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-550 hover:underline">Digital Heroes</a> Training Task
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
