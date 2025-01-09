"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addReview } from "@/app/actions/general-actions";
import { useAuth } from "@clerk/nextjs";
import { z } from "zod";
import { Button } from "../ui/button";
import { CardDescription, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const reviewSchema = z.object({
  patient_id: z.string(),
  staff_id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters long")
    .max(500, "Review must not exceed 500 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function ReviewForm({ staffId }: { staffId: string }) {
  const user = useAuth();
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      patient_id: user?.userId!,
      staff_id: staffId,
      rating: 0,
      comment: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOnSubmit = async (values: ReviewFormValues) => {
    try {
      setIsLoading(true);
      const resp = await addReview(values);

      if (resp.success) {
        toast.success("Review added successfully!");

        router.refresh();

        form.reset();
      } else if (resp.error) {
        toast.error(resp.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="px-4 py-2 rounded-lg bg-black/10 text-black text-[14px] hover:bg-transparent font-light"
          >
            <Plus size={22} className="text-gray-500" /> Add New Review
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CardHeader className="px-0">
            <DialogTitle>Rate Doctor & Services</DialogTitle>
            <CardDescription>
              Ensure accurate readings are perform as this may affect the
              diagnosis and other medical processes.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-8 w-8 cursor-pointer ${
                              star <= field.value
                                ? "text-yellow-600 fill-yellow-600"
                                : "text-gray-400"
                            }`}
                            onClick={() => field.onChange(star)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Rate your experience from 1 to 5 stars
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your review here..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your review should be between 10 and 500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
