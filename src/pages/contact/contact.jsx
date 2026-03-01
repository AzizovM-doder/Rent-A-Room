import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, CheckCircle, Send, Loader2, MessageSquareText, Sparkles, Navigation } from "lucide-react";
import { messagesApi } from "../../api/listingsAPI";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.name.trim()) return toast.error("Please provide your name.");
    if (!form.phone.trim()) return toast.error("Please provide your phone number.");
    if (!form.message.trim()) return toast.error("Please include a message.");

    setSending(true);
    try {
      await messagesApi.send({
        name: form.name,
        phone: form.phone,
        message: form.message,
        days: 1,
        listingId: 0, // General contact message
      });
      setSent(true);
      setForm({ name: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send the message. Please try again or use direct email.");
    } finally {
      setSending(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen px-4 py-8 overflow-hidden relative">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-7xl flex flex-col gap-10">
        
        {/* ── Hero Section ───────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 md:p-16 text-white shadow-2xl shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-[80px] pointer-events-none" />
          
          <div className="relative flex flex-col gap-5 z-10 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 w-fit mx-auto md:mx-0 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> Client Services
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">Let's Connect.</h1>
            <p className="text-emerald-100/70 text-lg md:text-xl font-medium leading-relaxed">
              Whether you're looking to host an incredible space or find your perfect stay, our dedicated support team is available around the clock.
            </p>
          </div>
          
          <div className="relative z-10 hidden lg:block">
            <div className="h-40 w-40 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl relative">
               <div className="absolute inset-2 rounded-full border border-dashed border-white/20 animate-spin-slow" />
               <MessageSquareText className="h-16 w-16 text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12 items-start relative z-10">
          
          {/* Main Form Area */}
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <Card className="rounded-[2.5rem] shadow-2xl border-0 bg-card/80 backdrop-blur-xl h-full shadow-emerald-500/5 overflow-hidden">
              <CardContent className="p-8 md:p-12 h-full">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center gap-6 py-20 text-center h-full"
                    >
                      <div className="h-28 w-28 rounded-[2rem] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shadow-xl mb-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <CheckCircle className="h-14 w-14 text-emerald-600 dark:text-emerald-500 relative z-10" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-foreground">Transmission Successful</h3>
                        <p className="text-lg text-muted-foreground font-medium mt-3 max-w-sm mx-auto leading-relaxed">Our support concierges have received your message and will be in touch shortly.</p>
                      </div>
                      <Button variant="outline" className="h-14 rounded-2xl px-10 mt-6 font-bold shadow-sm hover:border-emerald-500 transition-colors" onClick={() => setSent(false)}>
                        Send Additional Inquiry
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col gap-10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
                          <Navigation className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black">Direct Message</h2>
                          <p className="text-base text-muted-foreground font-medium mt-1">We guarantee a response within 24 hours.</p>
                        </div>
                      </div>

                      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="flex flex-col gap-2 relative">
                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground pl-1">Full Legal Name</label>
                            <Input 
                              placeholder="e.g. Eleanor Shellstrop" 
                              value={form.name} 
                              onChange={set("name")} 
                              required 
                              className="h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all font-semibold text-base px-4" 
                            />
                          </div>
                          <div className="flex flex-col gap-2 relative">
                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground pl-1">Primary Phone</label>
                            <Input 
                              placeholder="+1 (555) 000-0000" 
                              value={form.phone} 
                              onChange={set("phone")} 
                              required 
                              className="h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all font-semibold text-base px-4" 
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 relative">
                          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground pl-1">Your Inquiry</label>
                          <Textarea 
                            placeholder="Please explain how we can assist you today. The more details provided, the faster we can resolve your request..." 
                            className="min-h-[200px] rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all font-medium text-base p-5 resize-y leading-relaxed" 
                            value={form.message} 
                            onChange={set("message")} 
                            required 
                          />
                        </div>
                        
                        <div className="pt-2">
                          <Button type="submit" disabled={sending} className="w-full md:w-auto h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-lg font-black shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-0.5 px-12 border-0 flex items-center gap-3">
                            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            {sending ? "Transmitting..." : "Submit Inquiry"}
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Sidebar - Contact Info & Map */}
          <motion.div variants={fadeUp} className="lg:col-span-5 flex flex-col gap-6">
            
            <Card className="rounded-[2.5rem] shadow-2xl border-0 bg-card/80 backdrop-blur-xl sticky top-28 overflow-hidden shadow-emerald-500/5">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="p-8 md:p-10 flex flex-col gap-8 relative z-10">
                
                <div>
                  <h2 className="text-2xl font-black">Headquarters</h2>
                  <p className="text-base text-muted-foreground font-medium mt-2">Additional communication channels.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {[
                    { icon: Mail, label: "VIP Support Desk", value: "support@rentaroom.tj", href: "mailto:support@rentaroom.tj", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                    { icon: MapPin, label: "Physical Location", value: "Dushanbe, Tajikistan", href: null, bg: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
                  ].map(({ icon: Icon, label, value, href, bg }) => (
                    <div key={label} className="flex items-center gap-5 p-5 rounded-2xl border bg-background hover:shadow-lg transition-all group shadow-sm border-border/50">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner border ${bg}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
                        {href ? (
                          <a href={href} className="text-base font-bold text-foreground hover:text-emerald-600 transition-colors">{value}</a>
                        ) : (
                          <p className="text-base font-bold text-foreground">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[2rem] overflow-hidden border border-border/50 shadow-xl mt-4 relative w-full bg-muted group" style={{ paddingBottom: '75%' }}>
                  <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none group-hover:bg-transparent transition-colors" />
                  <iframe
                    className="absolute inset-0 w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 z-0"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.948077748077!2d68.7587617!3d38.5640154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d1e787e0d7f1%3A0xf9e530d3017a4375!2zU29mdGNsdWIgQWNhZGVteQ!5e0!3m2!1sen!2stj!4v1700000000000"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end z-20 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-sm font-black tracking-widest drop-shadow-md flex items-center gap-2">
                       <MapPin className="h-4 w-4" /> GLOBAL HQ
                    </p>
                    <p className="text-white/80 text-xs font-medium mt-1 drop-shadow-md ml-6">Softclub Academy, Dushanbe</p>
                  </div>
                </div>

              </div>
            </Card>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
