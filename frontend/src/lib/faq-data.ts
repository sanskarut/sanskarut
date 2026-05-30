export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What services does Sanskarut Tech Team specialize in?",
    answer: "We specialize in custom web application engineering, scalable SaaS platform architecture, high-performance API integrations, and cloud database optimization. Our engineers handle everything from concept designs to production-grade deployment and ongoing systems maintenance.",
  },
  {
    question: "What technology stack do you use for web and SaaS development?",
    answer: "Our standard primary stack includes Next.js, React, TypeScript, Tailwind CSS, Node.js, and Postgres/MongoDB. We select the technology configuration tailored to each project's unique requirements, prioritizing performance, SEO capability, and rapid scale.",
  },
  {
    question: "How do you approach search engine optimization (SEO) and speed?",
    answer: "We prioritize technical SEO by employing semantic HTML structure, proper meta-tag configurations, structured JSON-LD schemas (Organization, FAQPage), dynamically compiled sitemaps, and strict robots routing. We optimize core web vitals through Next.js static generation, optimized image serving, and minimal CSS/JS bundle sizes.",
  },
  {
    question: "How does the project management and communication workflow operate?",
    answer: "We operate on agile development cycles, organizing work in active bi-weekly sprints. We set up shared Slack or Teams channels for real-time collaboration and maintain interactive dashboards so you can track roadmap execution and sprint progress at any moment.",
  },
  {
    question: "Do you offer post-launch support and hosting maintenance?",
    answer: "Yes, we provide flexible support agreements to keep your application fast, secure, and up-to-date. This includes automated uptime monitoring, server security patching, database optimization, periodic dependency updates, and continuous integration adjustments.",
  },
];
