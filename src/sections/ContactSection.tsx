import React, { useState, useRef, useEffect } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Reveal, HorizontalSlatReveal } from '@/components/motion';
import { submitProjectInquiry } from '@/lib/inquirySubmission';
import { cn } from '@/lib/utils';
import type { InquiryFormData, InquiryFormErrors } from '@/types';

export interface ContactSectionProps {
  readonly className?: string;
}

const SERVICE_OPTIONS = [
  'Website Development',
  'Application Development',
  'SEO Optimization',
  'Meta Advertising',
  'Creative Design & Video',
  'Not sure yet',
] as const;

const GOAL_OPTIONS = [
  'Build something new',
  'Improve an existing digital experience',
  'Generate more qualified leads',
  'Improve online visibility',
  'Strengthen brand presentation',
  'Explore an idea',
] as const;

const BUDGET_OPTIONS = [
  'Under ₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000+',
  'Not decided yet',
] as const;

const TIMELINE_OPTIONS = [
  'As soon as possible',
  'Within 1 month',
  'Within 2–3 months',
  'Flexible / Exploring',
] as const;

type Step = 1 | 2 | 3 | 4 | 'review' | 'success';

const INITIAL_FORM_DATA: InquiryFormData = {
  services: [],
  projectName: '',
  projectDescription: '',
  projectGoal: '',
  budgetRange: '',
  timeline: '',
  fullName: '',
  email: '',
  phone: '',
  message: '',
};

export const ContactSection: React.FC<ContactSectionProps> = ({ className }) => {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<InquiryFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Focus step heading on step change for accessibility (skip on initial page load to prevent scrolling down)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (stepHeadingRef.current) {
      stepHeadingRef.current.focus({ preventScroll: true });
    }
  }, [step]);

  // Validation rules for current step
  const validateStep = (currentStep: Step): boolean => {
    const newErrors: InquiryFormErrors = {};

    if (currentStep === 1) {
      if (formData.services.length === 0) {
        newErrors.services = 'Please select at least one relevant service or choice.';
      }
    } else if (currentStep === 2) {
      if (!formData.projectName.trim()) {
        newErrors.projectName = 'Project or business name is required.';
      }
      if (!formData.projectDescription.trim()) {
        newErrors.projectDescription = 'Please provide a short description of what you want to build.';
      } else if (formData.projectDescription.trim().length < 10) {
        newErrors.projectDescription = 'Description should be at least 10 characters.';
      }
      if (!formData.projectGoal) {
        newErrors.projectGoal = 'Please select your primary project goal.';
      }
    } else if (currentStep === 3) {
      // Step 3 (budget & timeline) is optional, no required errors
    } else if (currentStep === 4) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required.';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (typeof step === 'number') {
      if (validateStep(step)) {
        if (step === 4) {
          setStep('review');
        } else {
          setStep((step + 1) as Step);
        }
      }
    }
  };

  const handleBack = () => {
    if (step === 'review') {
      setStep(4);
    } else if (typeof step === 'number' && step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const toggleService = (service: string) => {
    setFormData((prev) => {
      let updated: string[];
      if (service === 'Not sure yet') {
        updated = prev.services.includes('Not sure yet') ? [] : ['Not sure yet'];
      } else {
        const filtered = prev.services.filter((s) => s !== 'Not sure yet');
        if (filtered.includes(service)) {
          updated = filtered.filter((s) => s !== service);
        } else {
          updated = [...filtered, service];
        }
      }
      return { ...prev, services: updated };
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 'review') {
      return;
    }
    if (isSubmitting) return;

    // Validate all required steps before transmission
    if (!validateStep(1) || !validateStep(2) || !validateStep(4)) {
      setSubmissionError('Please complete all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const result = await submitProjectInquiry(formData);

    setIsSubmitting(false);
    if (result.success) {
      setInquiryId(result.inquiryId || `INQ-${Date.now().toString(36).toUpperCase()}`);
      setStep('success');
    } else {
      setSubmissionError(result.message || result.error || 'Failed to submit inquiry.');
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmissionError(null);
    setInquiryId(null);
    setStep(1);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={cn(
        'relative w-full overflow-hidden scroll-mt-24 lg:scroll-mt-28',
        'px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-36',
        'border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] transition-colors duration-250',
        className,
      )}
    >
      {/* 1. Atmospheric Ambient & Technical Background Language */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[400px] rounded-full blur-[140px] opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(53, 232, 91, 0.25) 0%, rgba(23, 26, 24, 0.1) 60%, transparent 80%)',
          }}
        />

        {/* Precision Geometric Technical Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line-color) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* Technical Framing Boundary Markers */}
        <div className="hidden lg:block absolute top-10 left-12 font-mono text-[11px] text-[var(--text-muted)] tracking-widest uppercase">
          SEC // 05.CONTACT
        </div>
        <div className="hidden lg:block absolute top-10 right-12 font-mono text-[11px] text-[var(--text-muted)] tracking-widest uppercase">
          FLOW // 04.STEPS
        </div>
      </div>

      {/* 2. Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal variant="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-neon-green)]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--text-accent)]">
                Initiate Project
              </span>
            </div>
          </Reveal>

          <HorizontalSlatReveal
            as="h2"
            id="contact-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.025em] text-[var(--text-primary)] leading-[1.12]"
            delay={60}
            slatCount={6}
          >
            Have a project in mind? Let's build something purposeful.
          </HorizontalSlatReveal>

          <Reveal variant="fade-up" delay={160}>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
              Tell us what you're working towards. Share a little about your business, your goals, and the digital experience you want to create.
            </p>
          </Reveal>
        </div>

        {/* 3. Multi-Step Inquiry Form Shell */}
        <Reveal variant="card" delay={180} duration={750}>
          <div className="max-w-4xl mx-auto rounded-3xl bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-[var(--shadow-card)] p-6 sm:p-10 lg:p-12 relative overflow-hidden backdrop-blur-md">
            {/* Top Step Progress Bar (Shown during steps 1-4 & review) */}
            {step !== 'success' && (
              <div className="mb-8 sm:mb-10 pb-6 border-b border-[var(--divider-color)]">
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-[var(--text-accent)] uppercase tracking-wider font-semibold">
                    {step === 'review'
                      ? 'REVIEW // CONFIRMATION'
                      : `STEP 0${step} OF 04 // ${
                          step === 1
                            ? 'PROJECT TYPE'
                            : step === 2
                            ? 'PROJECT DETAILS'
                            : step === 3
                            ? 'SCOPE & TIMELINE'
                            : 'YOUR DETAILS'
                        }`}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {step === 'review' ? '100% COMPLETE' : `${step * 25}% COMPLETE`}
                  </span>
                </div>

                {/* Visual Step Progress Track */}
                <div
                  className="w-full h-1 bg-[var(--divider-color)] rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={step === 'review' ? 100 : step * 25}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Inquiry form progress"
                >
                  <div
                    className="h-full bg-[var(--brand-neon-green)] transition-all duration-300 ease-out"
                    style={{
                      width: step === 'review' ? '100%' : `${step * 25}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Screen reader live notification for step updates */}
            <div className="sr-only" aria-live="polite">
              {step === 'success'
                ? 'Your project inquiry has been successfully transmitted.'
                : step === 'review'
                ? 'Review step: confirm your project parameters before submission.'
                : `Active inquiry step ${step} of 4.`}
            </div>

            {/* Form Steps */}
            <form onSubmit={handleSubmit} noValidate>
              {/* STEP 1: Project Type */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <h3
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="text-2xl sm:text-3xl font-medium text-[var(--text-primary)] tracking-tight focus:outline-none"
                    >
                      What are you looking to build?
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Select one or more capabilities that align with your requirements.
                    </p>
                  </div>

                  {errors.services && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono"
                    >
                      {errors.services}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {SERVICE_OPTIONS.map((service) => {
                      const isSelected = formData.services.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          aria-pressed={isSelected}
                          className={cn(
                            'p-4 rounded-xl text-left border transition-all duration-200 flex items-center justify-between',
                            isSelected
                              ? 'bg-[var(--brand-neon-green)]/15 border-[var(--brand-neon-green)] text-[var(--text-primary)] shadow-[var(--glow-neon-subtle)]'
                              : 'bg-[var(--tag-bg)] border-[var(--tag-border)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)]',
                          )}
                        >
                          <span className="font-medium text-sm sm:text-base">{service}</span>
                          <span
                            className={cn(
                              'w-5 h-5 rounded-md flex items-center justify-center border text-xs',
                              isSelected
                                ? 'bg-[var(--brand-neon-green)] border-[var(--brand-neon-green)] text-black font-bold'
                                : 'border-[var(--border-medium)] bg-transparent text-transparent',
                            )}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Project Details */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <h3
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="text-2xl sm:text-3xl font-medium text-[var(--text-primary)] tracking-tight focus:outline-none"
                    >
                      Tell us a little about your project.
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Share the context and the primary outcome you want to achieve.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Project Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="projectName" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                        Project or Business Name <span className="text-[var(--brand-neon-green)]">*</span>
                      </label>
                      <input
                        id="projectName"
                        type="text"
                        maxLength={100}
                        value={formData.projectName}
                        onChange={(e) => {
                          setFormData((p) => ({ ...p, projectName: e.target.value }));
                          if (errors.projectName) setErrors((p) => ({ ...p, projectName: undefined }));
                        }}
                        placeholder="e.g. Acme Corp or Next-Gen Design Studio"
                        className={cn(
                          'w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]',
                          'focus:outline-none focus:border-[var(--brand-neon-green)] focus:ring-1 focus:ring-[var(--brand-neon-green)] transition-colors',
                          errors.projectName ? 'border-red-500/60' : 'border-[var(--input-border)]',
                        )}
                      />
                      {errors.projectName && (
                        <p role="alert" className="text-xs text-red-400 font-mono mt-1">
                          {errors.projectName}
                        </p>
                      )}
                    </div>

                    {/* Project Description */}
                    <div className="space-y-1.5">
                      <label htmlFor="projectDescription" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                        Project Summary <span className="text-[var(--brand-neon-green)]">*</span>
                      </label>
                      <textarea
                        id="projectDescription"
                        rows={3}
                        maxLength={500}
                        value={formData.projectDescription}
                        onChange={(e) => {
                          setFormData((p) => ({ ...p, projectDescription: e.target.value }));
                          if (errors.projectDescription) setErrors((p) => ({ ...p, projectDescription: undefined }));
                        }}
                        placeholder="Briefly describe what you are looking to build, improve, or solve..."
                        className={cn(
                          'w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none',
                          'focus:outline-none focus:border-[var(--brand-neon-green)] focus:ring-1 focus:ring-[var(--brand-neon-green)] transition-colors',
                          errors.projectDescription ? 'border-red-500/60' : 'border-[var(--input-border)]',
                        )}
                      />
                      <div className="flex justify-between items-center text-[11px] font-mono text-[var(--text-muted)]">
                        {errors.projectDescription ? (
                          <span role="alert" className="text-red-400">
                            {errors.projectDescription}
                          </span>
                        ) : (
                          <span>Min. 10 characters</span>
                        )}
                        <span>{formData.projectDescription.length}/500</span>
                      </div>
                    </div>

                    {/* Primary Goal */}
                    <div className="space-y-2 pt-2">
                      <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                        Primary Project Goal <span className="text-[var(--brand-neon-green)]">*</span>
                      </span>
                      {errors.projectGoal && (
                        <p role="alert" className="text-xs text-red-400 font-mono">
                          {errors.projectGoal}
                        </p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {GOAL_OPTIONS.map((goal) => {
                          const isSelected = formData.projectGoal === goal;
                          return (
                            <button
                              key={goal}
                              type="button"
                              onClick={() => {
                                setFormData((p) => ({ ...p, projectGoal: goal }));
                                if (errors.projectGoal) setErrors((p) => ({ ...p, projectGoal: undefined }));
                              }}
                              className={cn(
                                'p-3 rounded-xl text-left border text-xs sm:text-sm transition-all',
                                isSelected
                                  ? 'bg-[var(--brand-neon-green)]/15 border-[var(--brand-neon-green)] text-[var(--text-primary)]'
                                  : 'bg-[var(--tag-bg)] border-[var(--tag-border)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)]',
                              )}
                            >
                              {goal}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Scope & Timeline (Optional) */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <h3
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="text-2xl sm:text-3xl font-medium text-[var(--text-primary)] tracking-tight focus:outline-none"
                    >
                      Let's understand the scope.
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      These planning preferences help us prepare for our discussion. All choices are flexible.
                    </p>
                  </div>

                  {/* Budget Choices */}
                  <div className="space-y-2.5">
                    <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                      Estimated Budget Range (Optional)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {BUDGET_OPTIONS.map((budget) => {
                        const isSelected = formData.budgetRange === budget;
                        return (
                          <button
                            key={budget}
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                budgetRange: p.budgetRange === budget ? '' : budget,
                              }))
                            }
                            className={cn(
                              'p-3 rounded-xl text-center border text-xs sm:text-sm font-mono transition-all',
                              isSelected
                                ? 'bg-[var(--brand-neon-green)]/15 border-[var(--brand-neon-green)] text-[var(--text-primary)]'
                                : 'bg-[var(--tag-bg)] border-[var(--tag-border)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)]',
                            )}
                          >
                            {budget}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline Choices */}
                  <div className="space-y-2.5 pt-2">
                    <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                      Desired Timeline (Optional)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TIMELINE_OPTIONS.map((timeline) => {
                        const isSelected = formData.timeline === timeline;
                        return (
                          <button
                            key={timeline}
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                timeline: p.timeline === timeline ? '' : timeline,
                              }))
                            }
                            className={cn(
                              'p-3 rounded-xl text-center border text-xs sm:text-sm font-mono transition-all',
                              isSelected
                                ? 'bg-[var(--brand-neon-green)]/15 border-[var(--brand-neon-green)] text-[var(--text-primary)]'
                                : 'bg-[var(--tag-bg)] border-[var(--tag-border)] text-[var(--text-secondary)] hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-neon-green)]',
                            )}
                          >
                            {timeline}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] font-mono pt-2">
                    Note: Budget ranges and timelines are preliminary parameters for project alignment, not binding commitments.
                  </p>
                </div>
              )}

              {/* STEP 4: Your Details */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <h3
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="text-2xl sm:text-3xl font-medium text-[var(--text-primary)] tracking-tight focus:outline-none"
                    >
                      Where can we reach you?
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Provide your contact details so our team can follow up with your inquiry.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="fullName" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                          Full Name <span className="text-[var(--brand-neon-green)]">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          maxLength={100}
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData((p) => ({ ...p, fullName: e.target.value }));
                            if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
                          }}
                          placeholder="Your Name"
                          className={cn(
                            'w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]',
                            'focus:outline-none focus:border-[var(--brand-neon-green)] focus:ring-1 focus:ring-[var(--brand-neon-green)] transition-colors',
                            errors.fullName ? 'border-red-500/60' : 'border-[var(--input-border)]',
                          )}
                        />
                        {errors.fullName && (
                          <p role="alert" className="text-xs text-red-400 font-mono mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                          Email Address <span className="text-[var(--brand-neon-green)]">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          maxLength={100}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData((p) => ({ ...p, email: e.target.value }));
                            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                          }}
                          placeholder="name@company.com"
                          className={cn(
                            'w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]',
                            'focus:outline-none focus:border-[var(--brand-neon-green)] focus:ring-1 focus:ring-[var(--brand-neon-green)] transition-colors',
                            errors.email ? 'border-red-500/60' : 'border-[var(--input-border)]',
                          )}
                        />
                        {errors.email && (
                          <p role="alert" className="text-xs text-red-400 font-mono mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                        Phone Number (Optional)
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        maxLength={20}
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 or country code with number"
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-neon-green)] focus:ring-1 focus:ring-[var(--brand-neon-green)] transition-colors"
                      />
                    </div>

                    {/* Additional Message */}
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                        Additional Context or Notes (Optional)
                      </label>
                      <textarea
                        id="message"
                        rows={2}
                        maxLength={500}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        placeholder="Any additional details, links, or specific questions..."
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--brand-neon-green)] focus:ring-1 focus:ring-[var(--brand-neon-green)] transition-colors"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal pt-1">
                    Privacy Reassurance: Your information is handled securely and used solely to evaluate your project inquiry. We respect your inbox and never send unsolicited marketing.
                  </p>
                </div>
              )}

              {/* REVIEW STEP: Summary of all entered details */}
              {step === 'review' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <h3
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="text-2xl sm:text-3xl font-medium text-[var(--text-primary)] tracking-tight focus:outline-none"
                    >
                      Review Your Project Inquiry
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Confirm your parameters before transmission. You can edit any section below.
                    </p>
                  </div>

                  {submissionError && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-mono space-y-2"
                    >
                      <div className="font-semibold uppercase tracking-wider">Transmission Notice</div>
                      <div>{submissionError}</div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Section 1: Services */}
                    <div className="p-4 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-[var(--text-accent)] uppercase tracking-wider font-semibold">
                          01 // Selected Services
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {formData.services.map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 rounded bg-[var(--tag-bg)] border border-[var(--tag-border)] text-xs font-mono text-[var(--text-primary)]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        aria-label="Edit selected services"
                        className="text-xs font-mono uppercase text-[var(--text-accent)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded px-1 font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Section 2: Project Details */}
                    <div className="p-4 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] flex items-start justify-between gap-4">
                      <div className="space-y-1 text-xs sm:text-sm">
                        <span className="text-[11px] font-mono text-[var(--text-accent)] uppercase tracking-wider block mb-1 font-semibold">
                          02 // Project Details
                        </span>
                        <div>
                          <span className="text-[var(--text-muted)]">Name: </span>
                          <span className="text-[var(--text-primary)] font-medium">{formData.projectName}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Goal: </span>
                          <span className="text-[var(--text-primary)]">{formData.projectGoal}</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-[var(--text-muted)] block">Summary:</span>
                          <p className="text-[var(--text-secondary)] text-xs leading-relaxed mt-0.5">
                            {formData.projectDescription}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        aria-label="Edit project details"
                        className="text-xs font-mono uppercase text-[var(--text-accent)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded px-1 font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Section 3: Scope & Timeline */}
                    <div className="p-4 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] flex items-start justify-between gap-4">
                      <div className="space-y-1 text-xs sm:text-sm">
                        <span className="text-[11px] font-mono text-[var(--text-accent)] uppercase tracking-wider block mb-1 font-semibold">
                          03 // Scope & Timeline
                        </span>
                        <div>
                          <span className="text-[var(--text-muted)]">Estimated Budget: </span>
                          <span className="text-[var(--text-primary)] font-mono">{formData.budgetRange || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Timeline: </span>
                          <span className="text-[var(--text-primary)] font-mono">{formData.timeline || 'Flexible'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        aria-label="Edit scope and timeline"
                        className="text-xs font-mono uppercase text-[var(--text-accent)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded px-1 font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Section 4: Contact Information */}
                    <div className="p-4 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] flex items-start justify-between gap-4">
                      <div className="space-y-1 text-xs sm:text-sm">
                        <span className="text-[11px] font-mono text-[var(--text-accent)] uppercase tracking-wider block mb-1 font-semibold">
                          04 // Contact Details
                        </span>
                        <div>
                          <span className="text-[var(--text-muted)]">Name: </span>
                          <span className="text-[var(--text-primary)] font-medium">{formData.fullName}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Email: </span>
                          <span className="text-[var(--text-primary)] font-mono">{formData.email}</span>
                        </div>
                        {formData.phone && (
                          <div>
                            <span className="text-[var(--text-muted)]">Phone: </span>
                            <span className="text-[var(--text-primary)] font-mono">{formData.phone}</span>
                          </div>
                        )}
                        {formData.message && (
                          <div className="pt-1">
                            <span className="text-[var(--text-muted)] block">Notes:</span>
                            <p className="text-[var(--text-secondary)] text-xs leading-relaxed mt-0.5">
                              {formData.message}
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        aria-label="Edit contact details"
                        className="text-xs font-mono uppercase text-[var(--text-accent)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-neon-green)] rounded px-1 font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUCCESS STATE */}
              {step === 'success' && (
                <div className="text-center py-8 sm:py-12 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-[var(--brand-neon-green)]/15 border border-[var(--brand-neon-green)] flex items-center justify-center mx-auto text-[var(--text-accent)] text-2xl shadow-[var(--glow-neon-subtle)]">
                    ✓
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-2xl sm:text-3xl font-medium text-[var(--text-primary)] tracking-tight">
                      Inquiry Successfully Received
                    </h3>
                    {inquiryId && (
                      <div className="font-mono text-xs text-[var(--text-accent)] uppercase tracking-widest pt-1 font-semibold">
                        REFERENCE // {inquiryId}
                      </div>
                    )}
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-2">
                      Thank you for sharing your project parameters. Our engineering and creative leads will analyze your scope and follow up promptly.
                    </p>
                  </div>

                  <div className="pt-4">
                    <SecondaryButton onClick={handleReset}>
                      Submit Another Inquiry
                    </SecondaryButton>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              {step !== 'success' && (
                <div className="pt-8 mt-8 border-t border-[var(--divider-color)] flex items-center justify-between gap-4">
                  {(typeof step === 'number' && step > 1) || step === 'review' ? (
                    <SecondaryButton type="button" onClick={handleBack} disabled={isSubmitting}>
                      ← Back
                    </SecondaryButton>
                  ) : (
                    <div />
                  )}

                  {step === 'review' ? (
                    <PrimaryButton
                      key="submit-button"
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[180px]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                          <span>Transmitting...</span>
                        </span>
                      ) : submissionError ? (
                        'Retry Submission'
                      ) : (
                        'Submit Project Inquiry'
                      )}
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      key="next-button"
                      type="button"
                      onClick={handleNext}
                      className="min-w-[140px]"
                    >
                      {step === 4 ? 'Review Inquiry →' : 'Continue →'}
                    </PrimaryButton>
                  )}
                </div>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
