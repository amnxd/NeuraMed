import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export const ResearchPage: React.FC = () => {
  const renderContent = () => {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow p-8 min-h-64"
        >
          <h3 className="text-xl font-semibold mb-2">Sleep and Mood Study</h3>
          <p className="text-sm text-slate-600 mb-4">
            A short survey and a week of passive data collection to study the
            relationship between sleep patterns and mood. Compensation provided.
          </p>
          <a
            href="#"
            className="inline-block px-4 py-2 rounded-full bg-purple-600 text-white text-sm"
          >
            Learn more
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-8 min-h-64"
        >
          <h3 className="text-xl font-semibold mb-2">Mindfulness Intervention Trial</h3>
          <p className="text-sm text-slate-600 mb-4">
            Participate in a guided mindfulness program and help evaluate its
            impact on anxiety and stress levels.
          </p>
          <a
            href="#"
            className="inline-block px-4 py-2 rounded-full bg-purple-600 text-white text-sm"
          >
            Learn more
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-8 min-h-64"
        >
          <h3 className="text-xl font-semibold mb-2">Importance of Fidget Tools in Mental Health</h3>
          <p className="text-sm text-slate-600 mb-4">
            Explore how fidget tools (e.g., stress balls, spinners) can help
            manage anxiety, improve focus, and support emotional regulation in
            therapeutic contexts.
          </p>
          <a
            href="#"
            className="inline-block px-4 py-2 rounded-full bg-purple-600 text-white text-sm"
          >
            Learn more
          </a>
        </motion.div>
      </div>
    );
  };

  return (
    <section className="min-h-screen py-32 px-6 relative overflow-hidden">
      {/* Background decoration similar to Mindfulness */}
      <motion.div
        className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10 bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-200"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-purple-600" />
            </motion.div>
            <span className="text-purple-700 font-semibold tracking-wide">
              AI-Powered Research Helper
            </span>
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6 text-center"
        >
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Participate in
          </span>
          {' '}
          <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Research
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10"
        >
          Help advance mental health science by participating in our partner studies.
          All participants are compensated for their time.
        </motion.p>

        {/* Container where dynamic content will be rendered */}
        <div className="space-y-6 max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </section>
  );
};

export function Research() {
  return (
    <section id="research" className="w-full py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Research</h2>
        <p className="mt-4 text-gray-600">
          Evidence-backed insights driving NeuraMed. Explore studies, methods, and ongoing work.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-900">Study 1</h3>
            <p className="mt-2 text-sm text-gray-600">Brief description of a key finding or methodology.</p>
            <a href="#" className="mt-3 inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium">Read more →</a>
          </article>
          <article className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-900">Study 2</h3>
            <p className="mt-2 text-sm text-gray-600">Brief description of a key finding or methodology.</p>
            <a href="#" className="mt-3 inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium">Read more →</a>
          </article>
          <article className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-900">Ongoing Research</h3>
            <p className="mt-2 text-sm text-gray-600">What we are testing next and how to participate.</p>
            <a href="#" className="mt-3 inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium">Get involved →</a>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ResearchPage;