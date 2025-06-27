"use client"
import { ArrowRight, Shield, Users, Clock, Star, Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { PharmasphereLogoText } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"

export default function AboutPage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <PharmasphereLogoText />
            <div className="flex gap-3">
              <Button variant="outline" className="hover:bg-blue-50 bg-transparent">
                Login
              </Button>
              <Button className="btn-primary">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center max-w-4xl mx-auto animate-fade-in"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-wide">
            About{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Pharmasphere
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're on a mission to revolutionize healthcare accessibility by connecting patients, pharmacies, and
            healthcare providers through innovative technology.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="animate-slide-up"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Pharmasphere, we believe healthcare should be accessible, transparent, and efficient. Our platform
                bridges the gap between patients and pharmacies, ensuring everyone has access to the medications they
                need, when they need them.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're committed to improving health outcomes through technology, making prescription management simple,
                and building trust between all stakeholders in the healthcare ecosystem.
              </p>
              <Button className="btn-primary text-lg px-8 py-3">
                Join Our Mission
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div
              className="relative animate-fade-in"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Healthcare mission"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">Why Choose Pharmasphere?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the benefits of joining our platform and how we're making healthcare management easier for
            everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Your health data is protected with enterprise-grade security and privacy measures.",
            },
            {
              icon: Clock,
              title: "Medication History",
              description: "Keep track of all your prescriptions and medication history in one convenient place.",
            },
            {
              icon: Star,
              title: "Smart Notifications",
              description: "Receive timely alerts for refills, discounts, and important medication reminders.",
            },
            {
              icon: Users,
              title: "Trusted Network",
              description: "Access a network of verified pharmacies and healthcare providers in your area.",
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="font-heading text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the comprehensive features that make Pharmasphere the leading pharmacy management platform.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Real-time Inventory",
                  description: "Check medicine availability across multiple pharmacies in real-time.",
                },
                {
                  title: "Price Comparison",
                  description: "Compare prices across different pharmacies to find the best deals.",
                },
                {
                  title: "Prescription Management",
                  description: "Upload and manage your prescriptions digitally with ease.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Delivery Tracking",
                  description: "Track your medication deliveries from pharmacy to your doorstep.",
                },
                {
                  title: "Health Analytics",
                  description: "Gain insights into your medication patterns and health trends.",
                },
                {
                  title: "Insurance Integration",
                  description: "Seamlessly integrate with your insurance provider for easy claims.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="lg:row-span-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <img
                src="/placeholder.svg?height=400&width=300"
                alt="Platform features"
                className="rounded-lg shadow-lg w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or need support? We're here to help. Reach out to us through any of the channels below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: Mail,
                title: "Email Support",
                primary: "support@pharmasphere.com",
                secondary: "We typically respond within 24 hours",
              },
              {
                icon: Phone,
                title: "Phone Support",
                primary: "+1 (555) 123-4567",
                secondary: "Monday - Friday, 9 AM - 6 PM EST",
              },
              {
                icon: MapPin,
                title: "Office Address",
                primary: "123 Healthcare Ave, Suite 100",
                secondary: "Medical District, NY 10001",
              },
            ].map((contact, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <contact.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{contact.title}</h3>
                  <p className="text-gray-600 mb-1">{contact.primary}</p>
                  <p className="text-sm text-gray-500">{contact.secondary}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea placeholder="Tell us more about your inquiry..." rows={4} />
                </div>
                <Button className="w-full btn-primary">Send Message</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <PharmasphereLogoText />
              <p className="mt-4 text-gray-400">Connecting health, one prescription at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find Pharmacies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">support@pharmasphere.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pharmasphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
