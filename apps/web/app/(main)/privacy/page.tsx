import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Real IELTS privacy policy — how we collect, use, and protect your personal data.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-16 pb-24">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: July 7, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
          <p className="leading-relaxed">
            Real IELTS (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our IELTS practice platform.
          </p>
          <p className="leading-relaxed">
            By using Real IELTS, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
          <p className="leading-relaxed">We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Personal Information:</strong> When you create an account, we collect your name and email address.</li>
            <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our platform, including test attempts, answers submitted, scores, time spent on tasks, and pages visited.</li>
            <li><strong>Device Information:</strong> We may collect your browser type, operating system, IP address, and device type to improve our service.</li>
            <li><strong>Cookies:</strong> We use essential cookies for authentication and session management. Analytics cookies help us understand usage patterns.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">3. How We Use Your Information</h2>
          <p className="leading-relaxed">We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide, maintain, and improve our IELTS practice platform</li>
            <li>To calculate and display your practice test scores and band estimates</li>
            <li>To track your progress and generate performance analytics</li>
            <li>To communicate with you about your account, updates, and support inquiries</li>
            <li>To detect, prevent, and address technical issues or misuse of the platform</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">4. Data Storage and Security</h2>
          <p className="leading-relaxed">
            Your data is stored securely on our servers using industry-standard encryption protocols. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p className="leading-relaxed">
            While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">5. Data Retention</h2>
          <p className="leading-relaxed">
            We retain your personal information for as long as your account is active or as needed to provide you with our services. You may request deletion of your account and associated data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">6. Third-Party Services</h2>
          <p className="leading-relaxed">
            We may use third-party services for authentication (NextAuth), analytics, and cloud storage (Cloudinary). These service providers have access to your information only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">7. Your Rights</h2>
          <p className="leading-relaxed">Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, update, or delete your personal information</li>
            <li>Withdraw consent at any time</li>
            <li>Object to processing of your data</li>
            <li>Request data portability</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          <p className="leading-relaxed">
            To exercise any of these rights, please contact us at the email address below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">8. Disclaimer: Affiliation</h2>
          <p className="leading-relaxed">
            Real IELTS is an independent practice platform and is <strong>not affiliated, endorsed, or approved by Cambridge University Press, Cambridge Assessment English, the British Council, or IDP Education</strong>. IELTS&reg; is a registered trademark of the respective owners. Our practice tests are based on publicly available exam patterns and are designed for educational purposes only. All Cambridge IELTS book references are used for descriptive purposes to identify source material and do not imply any partnership or endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">9. Changes to This Policy</h2>
          <p className="leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date. You are advised to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">10. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="leading-relaxed font-medium text-foreground">
            support@real-ielts.com
          </p>
        </section>
      </div>
    </div>
  )
}
