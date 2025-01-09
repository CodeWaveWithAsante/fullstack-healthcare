import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Footer } from "@/components/footer";
import {
  CTA,
  Features,
  StatsSection,
  UserSection,
} from "@/components/home-sections";
import { Button } from "@/components/ui/button";
import { getRole } from "@/utils/roles";
import Image from "next/image";
import { checkAndAddNewUser } from "./actions/general-actions";
import { Banner, Banner1 } from "@/components/banner";
import { ThemeSwitcher } from "@/components/theme-switcher";

const Home = async () => {
  const { userId } = await auth();
  const userRole = await getRole();

  if (userId && userRole) {
    checkAndAddNewUser();
    redirect(`/${userRole}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full flex justify-end p-4">
        <ThemeSwitcher />
      </div>

      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Welcome to <br />
              <span className="text-blue-700 text-5xl md:text-6xl">
                Kinda HMS
              </span>
            </h1>
          </div>

          <div className="text-center max-w-xl flex flex-col items-center justify-center">
            <p className="mb-8">
              Manage your hospital operations, patient records, and more with
              our powerful hospital management system.
            </p>

            <div className="flex gap-4">
              {userId ? (
                <Button asChild>
                  <Link href={"/patient"}>View Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button className="md:text-base font-light">
                      New Patient
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      variant="outline"
                      className="md:text-base underline hover:text-blue-600"
                    >
                      Login to account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <Banner />

        <UserSection />

        <Features />

        <Banner1 />

        <StatsSection />

        <CTA />

        <Footer />
      </div>
    </div>
  );
};

export default Home;
