"use client";
import { useState } from "react";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/shared/hooks/use-toast";
import { RegisterForm } from "@/shared/components/register-form";
import { EmailVerificationSuccess } from "@/shared/components/email-verification-success";
import {
  GalleryVerticalEnd,
  Building2,
  CheckCircle2,
  Shield,
  User,
  Sparkles,
  ArrowRight,
  MessageSquareText,
  Clock,
  Heart,
  Map,
} from "lucide-react";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendingVerification, setResendingVerification] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { user } = await register(formData.email, formData.password, {
        username: formData.username,
        role: "user",
      });

      setUserEmail(formData.email);

      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRegistrationComplete(true);

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
        variant: "success",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendingVerification(true);
      // This would call your actual resend verification endpoint
      // await auth.resendVerificationEmail(userEmail);

      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Verification email sent",
        description: "A new verification email has been sent to your inbox.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend verification",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setResendingVerification(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const benefits = [
    {
      title: "Property Alerts",
      description: "Get notified when new properties match your criteria",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      title: "Saved Searches",
      description: "Save your searches and filters for quick access",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      title: "Secure Account",
      description: "Your data is protected with enterprise-grade security",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Connect with Agents",
      description: "Directly message top-rated real estate agents",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const extendedBenefits = [
    {
      title: "Virtual Tours",
      description: "Explore properties from the comfort of your home",
      icon: <Map className="h-5 w-5" />,
    },
    {
      title: "Market Insights",
      description: "Access exclusive market data and trend analysis",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      title: "Fast Communication",
      description: "Real-time messaging with property owners",
      icon: <MessageSquareText className="h-5 w-5" />,
    },
    {
      title: "Scheduled Viewings",
      description: "Book property viewings with just a few clicks",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Favorites Collection",
      description: "Save and organize your favorite properties",
      icon: <Heart className="h-5 w-5" />,
    },
  ];

  // Handle updating form data through steps
  const handleFormUpdate = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Handle moving to the next step
  const handleNextStep = () => {
    setRegistrationStep((prev) => prev + 1);
  };

  return (
    <div className="max-h-screen overflow-hidden w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950 transition-colors duration-700 p-20 overflow-x-hidden  ">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-full h-64 bg-blue-600 dark:bg-indigo-900 -z-10 opacity-5 blur-3xl rounded-full transform -translate-y-1/2 scale-x-150"></div> */}
      {/* <div className="absolute bottom-0 right-0 w-full h-64 bg-indigo-600 dark:bg-blue-900 -z-10 opacity-5 blur-3xl rounded-full transform translate-y-1/2 scale-x-150"></div> */}

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-blue-400 dark:bg-blue-600 opacity-20"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 1],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {registrationComplete ? (
          <motion.div
            key="verification"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <EmailVerificationSuccess
              email={userEmail}
              onResendVerification={handleResendVerification}
              isResending={resendingVerification}
            />
          </motion.div>
        ) : (
          <motion.div
            key="registration"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-6 gap-1 w-full rounded-2xl overflow-hidden shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/30 dark:border-zinc-800/50 "
          >

            <motion.div
              variants={itemVariants}
                className="flex flex-col items-center justify-center w-full p-3 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none relative overflow-hidden col-span-2"
            >
              {/* Progress steps - only show when not complete */}
              <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                      registrationStep === 1
                        ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                        : "border-green-500 bg-green-500 text-white"
                    }`}
                  >
                    {registrationStep > 1 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <div
                    className={`h-0.5 w-8 ${
                      registrationStep > 1
                        ? "bg-green-500"
                        : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  ></div>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                      registrationStep === 2
                        ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                        : registrationStep > 2
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {registrationStep > 2 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      "2"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center mt-14 mb-6">
                <motion.div
                  className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-3 shadow-md relative"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <GalleryVerticalEnd className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  <motion.div
                    className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-indigo-600 w-4 h-4 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Sparkles className="h-2.5 w-2.5 text-white" />
                  </motion.div>
                </motion.div>
                <motion.h1
                  className="text-2xl sm:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-500 dark:to-indigo-400"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Create Your Account
                </motion.h1>
                <motion.p
                  className="text-zinc-500 dark:text-zinc-400 text-center text-sm mt-2 max-w-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Join our community to discover exclusive properties and enjoy
                  premium features
                </motion.p>
              </div>

              <AnimatePresence mode="wait">
                {registrationStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center w-full p-3 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none relative overflow-hidden col-span-2"

                  >
                    <div className="space-y-4 w-full">
                      <div className="grid gap-3">
                        <label className="text-sm font-medium">Username</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) =>
                            handleFormUpdate({ username: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800/70 transition-all duration-200"
                          placeholder="johndoe"
                          required
                        />
                      </div>

                      <div className="grid gap-3">
                        <label className="text-sm font-medium">
                          Email address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleFormUpdate({ email: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800/70 transition-all duration-200"
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <motion.button
                        onClick={handleNextStep}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium text-sm shadow-md mt-6"
                        whileHover={{
                          y: -2,
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                        }}
                        whileTap={{
                          y: 0,
                          boxShadow: "0 0px 0px rgba(59, 130, 246, 0)",
                        }}
                        disabled={!formData.username || !formData.email}
                      >
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {registrationStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center w-full p-3 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none relative overflow-hidden col-span-2"

                  >
                    <div className="space-y-4 w-full">
                      <div className="grid gap-3">
                        <label className="text-sm font-medium">Password</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            handleFormUpdate({ password: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800/70 transition-all duration-200"
                          placeholder="Create a strong password"
                          required
                        />
                      </div>

                      <div className="grid gap-3">
                        <label className="text-sm font-medium">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleFormUpdate({
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800/70 transition-all duration-200"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>

                      <motion.button
                        onClick={() => handleRegister(formData)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium text-sm shadow-md mt-6"
                        whileHover={{
                          y: -2,
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                        }}
                        whileTap={{
                          y: 0,
                          boxShadow: "0 0px 0px rgba(59, 130, 246, 0)",
                        }}
                        disabled={
                          isSubmitting ||
                          !formData.password ||
                          !formData.confirmPassword
                        }
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>Creating account...</span>
                          </span>
                        ) : (
                          <>
                            <span>Create account</span>
                            <Sparkles className="h-4 w-4" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-8">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center gap-1 hover:gap-2 transition-all duration-200"
                >
                  <span>Sign in here</span>
                  <span className="text-xs">→</span>
                </Link>
              </div>

            </motion.div>

            <motion.div
              variants={itemVariants}
              className="hidden md:block col-span-4 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white p-10 rounded-r-2xl relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold mb-3 text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text">
                      Discover Your Dream Home
                    </h2>
                    <p className="text-blue-100 text-lg">
                      Join thousands of users who have found their perfect
                      property through our platform.
                    </p>
                  </motion.div>

                  <div className="space-y-5">
                    <motion.h3
                      className="text-xl font-semibold flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Sparkles className="h-5 w-5 text-blue-300" />
                      Premium Features
                    </motion.h3>

                    <div className="grid grid-cols-1 gap-4">
                      {benefits.map((benefit, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.15 }}
                          className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors duration-300 cursor-pointer group"
                        >
                          <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                            {benefit.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{benefit.title}</h4>
                            <p className="text-sm text-blue-100">
                              {benefit.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="flex justify-center mt-6"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm backdrop-blur-sm">
                    <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                    <span>3,500+ active users this week</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>


          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
