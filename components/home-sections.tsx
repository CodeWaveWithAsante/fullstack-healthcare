import Link from "next/link";
import { Button } from "./ui/button";
import {
  Activity,
  BriefcaseMedical,
  Heart,
  Hospital,
  Pill,
  Shield,
  User,
  Users,
} from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Hospital,
    title: "Hospital Operations",
    description:
      "Streamline daily operations, resource allocation, and staff management.",
  },
  {
    icon: Shield,
    title: "Data Security",
    description:
      "HIPAA-compliant security measures to protect sensitive patient data.",
  },
  {
    icon: Activity,
    title: "Clinical Management",
    description:
      "Comprehensive tools for patient care and clinical workflow optimization.",
  },
];

const stats = [
  { value: "100+", label: "Hospitals" },
  { value: "10K+", label: "Healthcare Professionals" },
  { value: "1M+", label: "Patients Served" },
  { value: "99.9%", label: "System Uptime" },
];

export const UserSection = () => {
  return (
    <section className="px-6 py-16 ">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Dedicated Portals for Every User
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Admin Portal</h3>
              <p className="text-gray-600 mb-6">
                Secure access for administrator to manage hospital resources.
              </p>
              <Button variant="outline">
                <Link href="/sign-in">Admin Login</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Doctor Portal</h3>
              <p className="text-gray-600 mb-6">
                Secure access for doctors to manage patients, appointments,
                diagnosis stc.
              </p>
              <Button variant="outline">
                <Link href="/sign-in">Doctor Login</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Nurses Portal</h3>
              <p className="text-gray-600 mb-6">
                Secure access for nurses to manage patient care, schedules, and
                vital signs.
              </p>
              <Button variant="outline">
                <Link href="/sign-in">Nurses Login</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Patient Portal</h3>
              <p className="text-gray-600 mb-6">
                Easy access for patients to view appointments, medical records,
                and more.
              </p>
              <Button variant="outline">
                <Link href="/sign-in">Patient Login</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <BriefcaseMedical className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Laboratory Portal</h3>
              <p className="text-gray-600 mb-6">
                Secure access for nurses to manage patient care, laboratory
                tests.
              </p>
              <Button variant="outline">
                <Link href="/sign-in">Lab Login</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Pill className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pharmacy Portal</h3>
              <p className="text-gray-600 mb-6">
                Secure access for nurses to manage patient prescriptions,
                inventory and dispensary.
              </p>
              <Button variant="outline">
                <Link href="/sign-in">Pharm Login</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

{
  /* Features Section */
}
export const Features = () => (
  <section className="px-6 py-16">
    <div className="max-w-6xl mx-auto animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Enterprise-Grade Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

{
  /* Statistics Section */
}
export const StatsSection = () => (
  <section className="px-6 py-16 bg-blue-600 text-white animate-fade-in">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
            <div className="text-blue-100">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

{
  /* CTA Section */
}
export const CTA = () => {
  return (
    <section className="px-6 py-16 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Ready to Transform Your Hospital Experience?
        </h2>
        <p className="text-lg mb-8 text-gray-600">
          Take advantage of our awesome services and enjoy rich healthcare
          experience at the comfort of your home.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </div>
    </section>
  );
};
