"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useToast } from "@/shared/hooks/use-toast";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className="bg-zinc-800/50 dark:bg-zinc-700/50 border-zinc-700 dark:border-zinc-600 rounded-md focus:border-zinc-500 text-white h-12 placeholder:text-zinc-500"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    className="bg-zinc-800/50 dark:bg-zinc-700/50 border-zinc-700 dark:border-zinc-600 rounded-md focus:border-zinc-500 text-white h-12 placeholder:text-zinc-500"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Phone"
                    type="tel"
                    {...field}
                    className="bg-zinc-800/50 dark:bg-zinc-700/50 border-zinc-700 dark:border-zinc-600 rounded-md focus:border-zinc-500 text-white h-12 placeholder:text-zinc-500"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* Subject Field */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Subject"
                    {...field}
                    className="bg-zinc-800/50 dark:bg-zinc-700/50 border-zinc-700 dark:border-zinc-600 rounded-md focus:border-zinc-500 text-white h-12 placeholder:text-zinc-500"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* Message Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your interests in"
                  rows={5}
                  {...field}
                  className="bg-zinc-800/50 dark:bg-zinc-700/50 border-zinc-700 dark:border-zinc-600 rounded-md focus:border-zinc-500 text-white resize-none placeholder:text-zinc-500"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-base rounded-md transition-colors"
          >
            {isSubmitting ? "Sending..." : "Send to us"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
