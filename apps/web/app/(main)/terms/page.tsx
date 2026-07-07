import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Real IELTS terms and conditions — rules, disclaimers, and acceptable use of our IELTS practice platform.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-16 pb-24">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-2">
        Terms and Conditions
      </h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: July 7, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing or using Real IELTS (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">2. Description of Service</h2>
          <p className="leading-relaxed">
            Real IELTS provides an online platform for computer-delivered IELTS exam simulation. Users can access practice tests for Listening, Reading, Writing, and Speaking, receive band score estimates, and review performance diagnostics. The Platform is intended for educational and self-assessment purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">3. User Accounts</h2>
          <p className="leading-relaxed">
            To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.
          </p>
          <p className="leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent, abusive, or illegal activity.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">4. Acceptable Use</h2>
          <p className="leading-relaxed">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Platform for any unlawful purpose or in violation of any applicable laws</li>
            <li>Attempt to manipulate test scores, bypass assessment logic, or exploit system vulnerabilities</li>
            <li>Reproduce, distribute, or publicly display any part of the Platform without our written permission</li>
            <li>Interfere with or disrupt the integrity or performance of the Platform</li>
            <li>Attempt to scrape, crawl, or extract data from the Platform through automated means</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">5. Intellectual Property</h2>
          <p className="leading-relaxed">
            The Real IELTS platform, including its design, code, branding, and original content, is owned by Real IELTS and is protected by applicable copyright and intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our service without prior written consent.
          </p>
          <p className="leading-relaxed">
            Practice test questions and passages are sourced from publicly available Cambridge IELTS materials for educational reference. Cambridge IELTS&reg; is a registered trademark of Cambridge University Press. We do not claim ownership over the original Cambridge test content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">6. Disclaimer: No Affiliation with Cambridge</h2>
          <p className="leading-relaxed">
            <strong>Real IELTS is an independent educational platform and is not affiliated, endorsed, sponsored, or approved by Cambridge University Press, Cambridge Assessment English, the British Council, or IDP Education.</strong>
          </p>
          <p className="leading-relaxed">
            IELTS&reg; is a registered trademark of the British Council, IDP Education, and Cambridge Assessment English. Any references to &ldquo;Cambridge,&rdquo; &ldquo;Cambridge IELTS,&rdquo; &ldquo;IELTS,&rdquo; or specific book titles (e.g., &ldquo;Cambridge IELTS 21&rdquo;) are used solely for descriptive purposes to identify the source material of our practice content. These references do not imply endorsement or partnership.
          </p>
          <p className="leading-relaxed">
            Our practice tests and band score estimations are provided for self-assessment purposes only and are not official IELTS certification. They should not be considered a guarantee of performance on the actual IELTS exam.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">7. Accuracy of Scores and Feedback</h2>
          <p className="leading-relaxed">
            While we strive for accuracy, the band score estimates and feedback provided by Real IELTS are approximations and should be used as a general guide only. They do not represent official IELTS scores. The official IELTS exam may differ in content, difficulty, and scoring methodology.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">8. Limitation of Liability</h2>
          <p className="leading-relaxed">
            Real IELTS is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the Platform. In no event shall Real IELTS be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">9. Third-Party Links</h2>
          <p className="leading-relaxed">
            The Platform may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. Use of such sites is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">10. Termination</h2>
          <p className="leading-relaxed">
            We reserve the right to suspend or terminate your access to the Platform at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, third parties, or our business interests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">11. Changes to Terms</h2>
          <p className="leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Platform after any modifications indicates your acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">12. Governing Law</h2>
          <p className="leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">13. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="leading-relaxed font-medium text-foreground">
            support@real-ielts.com
          </p>
        </section>
      </div>
    </div>
  )
}
