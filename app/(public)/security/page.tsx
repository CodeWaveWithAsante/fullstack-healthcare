import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  FileCheck,
  Lock,
  Server,
  Shield,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

const Security = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Security</h1>
          <p className="text-xl text-gray-600">
            Industry-leading security measures to protect your data
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="p-6">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">HIPAA Compliance</h3>
                <p className="text-gray-600">
                  Full compliance with healthcare data protection regulations
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Lock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Data Encryption</h3>
                <p className="text-gray-600">
                  End-to-end encryption for all sensitive information
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <FileCheck className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Regular Audits</h3>
                <p className="text-gray-600">
                  Continuous security assessments and compliance checks
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Incident Response
                </h3>
                <p className="text-gray-600">
                  24/7 security monitoring and incident response team
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Server className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Secure Infrastructure
                </h3>
                <p className="text-gray-600">
                  Enterprise-grade infrastructure with multiple redundancies
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <UserCheck className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Access Control</h3>
                <p className="text-gray-600">
                  Role-based access control and user authentication
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Our Security Commitment
          </h2>
          <p className="text-gray-600 mb-8">
            At Kinda HMS, we take security seriously. Our platform is built with
            multiple layers of security to ensure your hospital's data remains
            protected. We regularly update our security measures to stay ahead
            of potential threats and maintain compliance with industry
            standards.
          </p>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Security;
