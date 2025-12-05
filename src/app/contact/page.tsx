'use client';

import { useState, FormEvent } from 'react';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail size={24} />,
    label: 'Email',
    value: 'support@premium-hardware.co',
    href: 'mailto:support@premium-hardware.co',
  },
  {
    icon: <Phone size={24} />,
    label: 'Phone',
    value: '1-800-PREMIUM',
    href: 'tel:1-800-773-6486',
  },
  {
    icon: <MapPin size={24} />,
    label: 'Headquarters',
    value: 'San Francisco, CA',
    href: '#',
  },
];

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-foreground mb-6">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance? We are here to help you find the
            perfect Premium solution.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.href}
              className="flex flex-col items-center p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                {info.icon}
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {info.label}
              </h2>
              <p className="text-muted-foreground">{info.value}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
              Send Us a Message
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below and our team will get back to you within
              24 hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center p-8 rounded-2xl bg-primary/10 border border-primary/20">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Message Sent!
              </h3>
              <p className="text-muted-foreground">
                Thank you for reaching out. We will respond to your inquiry
                shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="returns">Returns & Warranty</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </SectionWrapper>

      {/* Business Hours */}
      <SectionWrapper background="muted" className="text-center">
        <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
          Business Hours
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Our support team is available to assist you during the following hours.
        </p>
        <div className="inline-block rounded-2xl border border-border bg-card p-8">
          <div className="space-y-3 text-left">
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Monday - Friday</span>
              <span className="font-medium text-foreground">9:00 AM - 8:00 PM EST</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Saturday</span>
              <span className="font-medium text-foreground">10:00 AM - 6:00 PM EST</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Sunday</span>
              <span className="font-medium text-foreground">Closed</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            * Flagship product owners have access to 24/7 priority support
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
