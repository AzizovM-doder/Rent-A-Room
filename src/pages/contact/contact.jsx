import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl md:text-4xl font-bold">Contact</h1>
        <p className="text-muted-foreground max-w-2xl">
          Got a question, want to list your house/dacha, or need help? Hit us up.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="+992 ..." />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@gmail.com" />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="Tell us what you need..." className="min-h-35" />
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Send
                </Button>
                <p className="text-xs text-muted-foreground">
                  We usually reply within 24 hours.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support@xona.tj</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+992 00 000 0000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">Dushanbe, Tajikistan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Office map</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
  className="h-44 w-full rounded-xl"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.948077748077!2d68.7587617!3d38.5640154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d1e787e0d7f1%3A0xf9e530d3017a4375!2zU29mdGNsdWIgQWNhZGVteQ!5e0!3m2!1sen!2stj!4v1700000000000"
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>

              <p className="mt-3 text-xs text-muted-foreground">
Our address
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;
