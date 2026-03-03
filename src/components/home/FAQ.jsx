import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
  const faqs = [
    {
      q: t("faq.q1", "How do I book a property?"),
      a: t("faq.a1", "Simply browse our listings, select your desired dates, and click 'Contact to Book'. The host will receive your request and respond shortly to confirm your stay.")
    },
    {
      q: t("faq.q2", "Are the hosts verified?"),
      a: t("faq.a2", "Yes, every host on Rent-A-Room undergoes a strict verification process including identity checks and property assessments to ensure your safety and comfort.")
    },
    {
      q: t("faq.q3", "What payment methods are supported?"),
      a: t("faq.a3", "Currently, payments are handled directly between you and the host via our secure messaging system or upon arrival, depending on the host's policy.")
    },
    {
      q: t("faq.q4", "Can I cancel a booking?"),
      a: t("faq.a4", "Cancellation policies vary by host. You can view the specific cancellation terms on each property's detail page before making a booking.")
    }
  ];

  return (
    <section className="relative w-full py-24 md:py-32 bg-muted/20 border-t border-border/50">
      <div className="relative z-10 w-full max-w-[50rem] mx-auto px-4 md:px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 shadow-inner">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{t("faq.title", "Frequently Asked Questions")}</h2>
          <p className="text-muted-foreground text-lg font-medium">{t("faq.subtitle", "Everything you need to know about renting with us.")}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-card border border-border/50 p-6 md:p-8 rounded-[2rem] shadow-xl"
        >
          <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50 border rounded-2xl px-6 bg-background/50 hover:bg-background transition-colors data-[state=open]:bg-background data-[state=open]:shadow-md">
                <AccordionTrigger className="text-base md:text-lg font-bold hover:no-underline py-5 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 text-left">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

      </div>
    </section>
  );
};

export default FAQ;
