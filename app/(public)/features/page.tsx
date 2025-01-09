import { Card, CardContent } from "@/components/ui/card";
import {
  Hospital,
  Users,
  Calendar,
  FileText,
  Activity,
  Database,
  Shield,
  MessageSquare,
  BarChart,
  Clock,
} from "lucide-react";
import Link from "next/link";

const Features = () => {
  const features = [
    {
      icon: Hospital,
      title: "Hospital Management",
      description:
        "Comprehensive tools for managing hospital operations, resources, and staff.",
    },
    {
      icon: Users,
      title: "Patient Management",
      description:
        "Complete patient records, history, and care management system.",
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description:
        "Efficient scheduling system for patients and healthcare providers.",
    },
    {
      icon: FileText,
      title: "Electronic Health Records",
      description:
        "Secure and accessible electronic health records management.",
    },
    {
      icon: Activity,
      title: "Clinical Management",
      description: "Advanced tools for clinical workflow and patient care.",
    },
    {
      icon: Database,
      title: "Inventory Management",
      description: "Track and manage medical supplies and equipment.",
    },
    {
      icon: Shield,
      title: "Security Features",
      description:
        "HIPAA-compliant security measures to protect sensitive data.",
    },
    {
      icon: MessageSquare,
      title: "Communication Tools",
      description: "Integrated messaging system for staff and patients.",
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Comprehensive reporting and analytics dashboard.",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Instant updates and notifications for critical information.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Features</h1>
          <p className="text-xl text-gray-600">
            Discover the powerful features that make Kinda HMS the leading
            choice for healthcare providers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
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

export default Features;
