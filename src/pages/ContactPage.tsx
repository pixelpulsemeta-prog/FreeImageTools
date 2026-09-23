import React, { useState } from 'react';
import { Link } from '../context/RouterContext';
import { PAGES_SEO } from '../utils/seoData';
import { Mail, MessageSquare, Send, Copy, CheckCircle, Info } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const seo = PAGES_SEO['/contact'];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feature suggestion or feedback');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const contactEmail = 'hello@freeimagetools.org';

  const handleOpenEmailClient = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
      `[FreeImageTools] ${subject} from ${name || 'User'}`
    )}&body=${encodeURIComponent(
      `From: ${name} (${email || 'No email provided'})\n\nMessage:\n${message}`
    )}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyMessage = () => {
    const textToCopy = `To: ${contactEmail}\nSubject: [FreeImageTools] ${subject}\n\nFrom: ${name} (${email})\n\n${message}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-slate-900 dark:text-white">Contact</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Contact Us
      </h1>
      <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        Have feedback, questions, or ideas for new image processing tools? We’d love to hear from you.
      </p>

      {/* Honest Frontend Notice Banner */}
      <div className="my-6 rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/30 flex items-start gap-3 text-xs sm:text-sm text-blue-800 dark:text-blue-300">
        <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <strong className="font-semibold">Direct Email & Frontend Notice:</strong> FreeImageTools runs with zero unnecessary backend servers. Submitting the form below creates a pre-filled draft in your default email client (or lets you copy your formatted message) to send directly to <span className="font-mono font-semibold">{contactEmail}</span>.
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleOpenEmailClient} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 space-y-5 shadow-xs">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Your Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Subject
          </label>
          <select
            id="contact-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Feature suggestion or feedback">Feature suggestion or feedback</option>
            <option value="Bug or tool issue report">Bug or tool issue report</option>
            <option value="Format compatibility question">Format compatibility question</option>
            <option value="Other inquiry">Other inquiry</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think or describe the feature you'd like to see..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all"
          >
            <Send className="h-4 w-4" />
            Send via Email Client
          </button>

          <button
            type="button"
            onClick={handleCopyMessage}
            disabled={!message}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors disabled:opacity-50"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Copied Message to Clipboard!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Message Text
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
