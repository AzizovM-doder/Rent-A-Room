import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, CheckCircle, Send, Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { messagesApi } from "../../api/listingsAPI";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.phone.trim()) return toast.error("Phone is required");
    if (!form.message.trim()) return toast.error("Message is required");

    setSending(true);
    try {
      await messagesApi.send({
        name: form.name,
        phone: form.phone,
        message: form.message,
        days: 1,
        listingId: 0,
      });
      setSent(true);
      setForm({ name: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[75vh] px-4 py-8 animate-fade-up">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-8 md:p-12 text-white shadow-xl flex items-center justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl pointer-events-none" />
          
          <div className="relative flex flex-col gap-4 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold border border-white/20 w-fit">
              <Sparkles className="h-4 w-4 text-emerald-300" /> We're here to help
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">Contact Us</h1>
            <p className="text-emerald-100 text-lg md:text-xl font-medium leading-relaxed">
              Got a question, want to list your property, or need help? Send us a message — our entire team reads every one.
            </p>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-5 items-start">
          {/* Main Form Area */}
          <Card className="rounded-3xl shadow-lg border-0 bg-card/80 backdrop-blur lg:col-span-3">
            <CardContent className="p-6 md:p-8">
              {sent ? (
                <div className="flex flex-col items-center gap-5 py-16 text-center animate-scale-in">
                  <div className="h-24 w-24 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold">Message received!</h3>
                    <p className="text-base text-muted-foreground mt-2 max-w-sm mx-auto">We'll get back to you as soon as possible. Thank you for reaching out.</p>
                  </div>
                  <Button variant="outline" className="h-12 rounded-xl px-8 mt-2" onClick={() => setSent(false)}>Send another message</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                      <MessageSquareText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Send a message</h2>
                      <p className="text-sm text-muted-foreground font-medium">We usually reply within 24 hours.</p>
                    </div>
                  </div>

                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Name *</label>
                        <Input placeholder="John Doe" value={form.name} onChange={set("name")} required className="h-12 rounded-xl bg-muted/50" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Phone Number *</label>
                        <Input placeholder="+992 90 000 0000" value={form.phone} onChange={set("phone")} required className="h-12 rounded-xl bg-muted/50" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Message *</label>
                      <Textarea placeholder="Tell us what you need. Be as detailed as possible." className="min-h-[160px] rounded-xl bg-muted/50 resize-y p-4 text-base" value={form.message} onChange={set("message")} required />
                    </div>
                    
                    <Button type="submit" disabled={sending} className="h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-bold shadow-lg shadow-emerald-600/25 transition-all mt-2 w-full sm:w-auto self-start px-10 gap-2">
                      {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      {sending ? "Sending message..." : "Send message"}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            
            <Card className="rounded-3xl shadow-lg border-0 bg-card/80 backdrop-blur sticky top-24">
              <div className="p-6 md:p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-bold">Contact Info</h2>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Other ways to reach us.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {[
                    { icon: Mail, label: "Email Support", value: "support@xona.tj", href: "mailto:support@xona.tj", bg: "bg-emerald-500/10 text-emerald-600" },
                    { icon: MapPin, label: "Office Location", value: "Dushanbe, Tajikistan", href: null, bg: "bg-teal-500/10 text-teal-600" },
                  ].map(({ icon: Icon, label, value, href, bg }) => (
                    <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-md transition-all group">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${bg}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                        {href ? (
                          <a href={href} className="text-sm font-semibold hover:text-emerald-600 hover:underline transition-colors">{value}</a>
                        ) : (
                          <p className="text-sm font-semibold">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl overflow-hidden border shadow-inner mt-2 relative aspect-video w-full bg-muted group">
                  <div className="absolute inset-0 bg-black/5" />
                  <iframe
                    className="absolute inset-0 h-full w-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.948077748077!2d68.7587617!3d38.5640154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d1e787e0d7f1%3A0xf9e530d3017a4375!2zU29mdGNsdWIgQWNhZGVteQ!5e0!3m2!1sen!2stj!4v1700000000000"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                    <p className="text-white text-xs font-bold tracking-wider">SOFTCLUB ACADEMY</p>
                    <p className="text-white/80 text-[10px]">Headquarters</p>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
