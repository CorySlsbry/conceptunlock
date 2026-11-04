export const metadata = {
  title: "Privacy Policy — ConceptUnlock",
  description: "How ConceptUnlock collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toISOString().split("T")[0]}
      </p>

      <section className="space-y-6 text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            1. Information We Collect
          </h2>
          <p>
            When you create an account, we collect your email address and name
            for authentication purposes. If you subscribe to a paid plan, payment
            processing is handled securely by Stripe — we never store your credit
            card number, CVV, or full card details on our servers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and maintain ConceptUnlock&apos;s services</li>
            <li>To process your subscription and billing</li>
            <li>To send transactional emails (account confirmation, password reset)</li>
            <li>To improve our product based on aggregated usage data</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            3. Data Storage and Security
          </h2>
          <p>
            Your data is stored securely using Supabase (PostgreSQL) with
            row-level security policies. All data is encrypted in transit via
            HTTPS/TLS. We do not sell, rent, or share your personal information
            with third parties for marketing purposes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            4. Third-Party Services
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Stripe</strong> — payment processing (
              <a href="https://stripe.com/privacy" className="underline">
                Stripe Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Supabase</strong> — database and authentication (
              <a href="https://supabase.com/privacy" className="underline">
                Supabase Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Vercel</strong> — hosting and deployment (
              <a href="https://vercel.com/legal/privacy-policy" className="underline">
                Vercel Privacy Policy
              </a>
              )
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            5. Your Rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time by contacting us. You can delete your
            account from the app settings, which permanently removes your data
            from our systems.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            6. Children&apos;s Privacy
          </h2>
          <p>
            ConceptUnlock is not directed to children under 13. We do not knowingly
            collect personal information from children under 13. If we discover
            we have collected such information, we will delete it promptly.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. We will notify
            you of any material changes by posting the new policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            8. Contact
          </h2>
          <p>
            If you have questions about this privacy policy, contact us at{" "}
            <a
              href="mailto:support@noadappsutah.com"
              className="underline"
            >
              support@noadappsutah.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
