"use client"
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { SubmitHandler, useForm } from "react-hook-form";

const SignUpPage = () => {

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'US',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    } );
    const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData) => {
        try {
            
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <h1 className="form-title">Sign Up & Personalize</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <InputField 
                    name="fullName"
                    label="Full Name"
                    placeholder="john doe"
                    register={register}
                    error={errors.fullName}
                    validation={{ required: 'Fullname is required', minLength: 2 }}
                />

                <InputField 
                    name="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\S+@\S+$/i, message: 'Invalid email address' } }
                />

                <InputField 
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter a strong password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <CountrySelectField name="country" label="Country" control={control} error={errors.country} required />

                <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="Select your investment goals"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                />

                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Select your risk level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                />

                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing Up...' : 'Start Your Journey'}
                </Button>

                <FooterLink text="Already have an account" linkText="Sign in" href="/sign-in" />
            </form>
        </>
    )
}

export default SignUpPage