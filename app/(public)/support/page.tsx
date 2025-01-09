import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileQuestion, Headset } from "lucide-react";
import Link from "next/link";

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-gray-600">
            We're here to help you succeed
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center">
            <CardContent>
              <Headset className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 mb-4">
                Our support team is available around the clock
              </p>
              <Button variant="outline">Contact Support</Button>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent>
              <FileQuestion className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">FAQ</h3>
              <p className="text-gray-600 mb-4">
                Find answers to common questions
              </p>
              <Button variant="outline">View FAQ</Button>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardContent>
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Documentation</h3>
              <p className="text-gray-600 mb-4">
                Detailed guides and documentation
              </p>
              <Button variant="outline">View Docs</Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I reset my password?</AccordionTrigger>
              <AccordionContent>
                You can reset your password by clicking on the "Forgot Password"
                link on the login page. Follow the instructions sent to your
                email to create a new password.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What training resources are available?
              </AccordionTrigger>
              <AccordionContent>
                We offer comprehensive training resources including video
                tutorials, documentation, and live training sessions for
                hospital staff.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How secure is patient data?</AccordionTrigger>
              <AccordionContent>
                We implement industry-leading security measures including
                encryption, regular security audits, and HIPAA compliance to
                ensure patient data is protected.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Support;
