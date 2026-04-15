"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const signupSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    studentId: z.string().min(5, "Valid Student ID is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
type SignupForm = z.infer<typeof signupSchema>;
export default function SignupPage() {
    const [idCard, setIdCard] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIdCard(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const onSubmit = async (data: SignupForm) => {
        if (!idCard) {
            setError("Please upload a photo of your Student ID card for verification.");
            return;
        }
        if (!data.email.toLowerCase().endsWith("@niet.co.in")) {
            setError("Only students with an @niet.co.in email address can register.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    idPhoto: preview
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Signup failed");
            }
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }
        catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    if (success) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your profile is under verification. Our admin will review your ID card shortly.
            Redirecting to login...
          </p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-600 h-full animate-progress" style={{ width: "100%" }}></div>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the NIET Event Community
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input {...register("fullName")} className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="John Doe"/>
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input {...register("studentId")} className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="0241csai000"/>
                {errors.studentId && <p className="mt-1 text-xs text-red-500">{errors.studentId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input {...register("email")} className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="0241csai000@niet.co.in"/>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input {...register("password")} type="password" className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="••••••••"/>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID Card Photo (For Verification)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-primary transition-colors cursor-pointer relative overflow-hidden">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                <div className="space-y-1 text-center">
                  {preview ? (<div className="relative w-full h-40">
                      <img src={preview} alt="ID Preview" className="w-full h-full object-contain rounded-lg"/>
                    </div>) : (<>
                      <Camera className="mx-auto h-12 w-12 text-gray-400"/>
                      <div className="flex text-sm text-gray-600">
                        <span className="text-primary font-bold">Upload a photo</span>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>)}
                </div>
              </div>
            </div>
          </div>

          {error && (<div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400"/>
              <p className="text-sm text-red-700">{error}</p>
            </div>)}

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg hover:shadow-xl disabled:opacity-50">
              {loading ? (<Loader2 className="w-5 h-5 animate-spin"/>) : ("Register Account")}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>);
}
