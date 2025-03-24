import Link from "next/link";
export const runtime = 'edge'
export const metadata = {
    title: 'Privacy Policy | AnySchedule',
    description: 'Privacy Policy for AnySchedule',
}
export default function Privacy() {
    return (
        <div className="mt-24">
        <main className="max-w-xl mx-auto">
            <div className="p-5">
                <Link href="/" className="btn btn-ghost">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                            clipRule="evenodd"
                        />
                    </svg>{" "}
                    Back
                </Link>
                <h1 className="text-3xl font-extrabold pb-6">
                    Privacy Policy for AnySchedule
                </h1>

                <pre
                    className="leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "sans-serif" }}
                >
                    {`
Last Updated: December 14, 2024
Introduction
Welcome to AnySchedule, the advanced AI-powered schedule generation platform. This Privacy Policy outlines how AnySchedule ("we", "our", or "us") collects, uses, and protects your information when you use our schedule generation services (collectively, the "Service").
Information We Collect

Personal Data
We collect the following personal information:


Name
Email address
Payment information (for premium features)
Account preferences
Subscription details

Service Data
We collect and process:

Text descriptions you provide for music generation
Generated music content
Musical style preferences and settings
Usage patterns and generation history
Custom music configurations


Technical Data
We utilize:

Web cookies and similar technologies
Performance analytics
Service usage metrics
Generation parameters
API usage data (for developers)

Data Usage

Service Provision
We use collected data to:

Generate schedules from your text descriptions
Maintain and improve generation quality
Optimize schedule consistency
Provide technical support
Process payments

Service Improvement
Data helps us:

Enhance schedule generation algorithms
Improve text processing
Optimize schedule controls
Develop new features

Data Retention
We retain your personal data and generated schedules only as long as necessary to provide our service and as described in this Privacy Policy:

Active user accounts: Full generation history
Free tier users: Limited history retention (30 days)
Premium users: Extended storage options
API users: Usage logs and generation records

Data Sharing and Third-Party Services
AnySchedule does not sell your personal information. We may share data with:

Cloud computing providers for schedule generation
Payment processors for premium features
Analytics services to improve our technology
Legal authorities when required by law

Your Data Protection Rights
As a AnySchedule user, you have rights regarding your:

Generated schedules and content
Personal information
Text descriptions and inputs
Usage history and preferences
Schedule style configurations

Content Generation Privacy
Our text-to-schedule service:

Processes descriptions securely
Maintains generation privacy
Protects creative content
Ensures user confidentiality
Secures style preferences

Children's Privacy
AnySchedule's text-to-schedule service is not intended for users under 13 years of age. We do not knowingly collect data from children.
Security Measures
We implement security for:

Text description processing
Schedule generation and storage
User account protection
Payment information
API access
Style configurations

Data Protection Practices
We protect your data through:

Encryption at rest and in transit
Secure cloud storage
Regular security audits
Access controls
Monitoring systems

International Data Transfers
When we transfer data internationally, we ensure:

Compliance with data protection laws
Appropriate security measures
Contractual safeguards
Data transfer agreements

Policy Updates
We may update this policy to reflect:

New features and capabilities
Service improvements
Security enhancements
Legal requirements
Technology updates

Your Rights
You have the right to:

Access your personal data
Correct inaccurate data
Request data deletion
Export your data
Restrict processing
Object to processing

Contact Information
For privacy inquiries:
Email: support@anyschedule.app

`}
                </pre>
            </div>
        </main>
        </div>
    )
}
