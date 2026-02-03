import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";
import logo from '/logo.png'
const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:justify-between md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-15" />
              <div className="flex flex-col leading-tight">
                <p className="font-semibold">Rent.A.Room.tj</p>
                <p className="text-xs text-muted-foreground">
                  Homes • Dachas • Apartments
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              A simple platform to rent houses, dachas, and apartments across
              Tajikistan. Clean listings. No stress.
            </p>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 hover:bg-emerald-600">
                Verified listings
              </Badge>
              <Badge variant="secondary">Support 24/7</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-semibold">Quick links</p>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-semibold">Contact</p>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">support@rentaroom.tj</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+992 00 000 0000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">Dushanbe, Tajikistan</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-semibold">Newsletter</p>
            <p className="text-sm text-muted-foreground">
              Get new listings and updates. No spam.
            </p>

            <div className="flex gap-2">
              <Input placeholder="Your email" />
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Join
              </Button>
            </div>

            <div className="rounded-xl border p-4 mt-3">
              <p className="text-sm font-medium">Want to list your home?</p>
              <p className="text-xs text-muted-foreground">
                Create an account and start posting in minutes.
              </p>
              <Button
                asChild
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Link to="/login">Get started</Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rent.A.Room.tj All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/support"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;