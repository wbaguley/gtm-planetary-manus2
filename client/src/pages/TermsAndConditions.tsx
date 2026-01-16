import { useLocation } from "wouter";

export default function TermsAndConditions() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2">
            <img src="/logo.png" alt="GTM Planetary" className="h-10 w-10" />
          </button>
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the services provided by GTM Planetary LLC ("Company," "we," "our," or "us"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services Description</h2>
            <p className="mb-4">
              GTM Planetary provides AI-driven automation solutions, custom AI development, consulting services, and related technology solutions exclusively for trade and skill-based businesses. Our services include but are not limited to AI consulting, custom AI solution development, automation implementation, and system optimization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Service Packages and Pricing</h2>
            <p className="mb-4">
              We offer multiple service packages (Standard, Plus, Premium, and Enterprise) with transparent pricing. All packages include specified deliverables, training, and support periods as outlined in our pricing documentation. Pricing is subject to change with notice.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are in USD unless otherwise specified</li>
              <li>Payment terms are specified in individual service agreements</li>
              <li>Financing options may be available upon request</li>
              <li>Additional services and add-ons are billed separately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Client Responsibilities</h2>
            <p className="mb-4">Clients agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information necessary for service delivery</li>
              <li>Cooperate with our team during implementation and training</li>
              <li>Maintain confidentiality of access credentials and system information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Provide timely feedback and approvals as required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              All custom solutions developed by GTM Planetary remain the intellectual property of the Company unless otherwise specified in a written agreement. Clients receive a license to use the developed solutions for their business operations. Pre-existing intellectual property and third-party tools retain their respective ownership.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Confidentiality</h2>
            <p className="mb-4">
              Both parties agree to maintain confidentiality of proprietary information shared during the course of the business relationship. This includes but is not limited to business processes, technical specifications, pricing information, and client data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Support and Maintenance</h2>
            <p className="mb-4">
              Support terms vary by service package. All packages include an initial support period as specified. Ongoing support and maintenance are available through Growth packages (Lite, Core, Max) with defined response times and development hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, GTM Planetary shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services. Our total liability shall not exceed the amount paid by the client for the specific service giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Warranties and Disclaimers</h2>
            <p className="mb-4">
              We warrant that our services will be performed in a professional and workmanlike manner. However, we do not guarantee specific business outcomes or results. Services are provided "as is" without warranties of any kind, express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Termination</h2>
            <p className="mb-4">
              Either party may terminate the service agreement with written notice as specified in the individual service contract. Upon termination, the client remains responsible for payment of services rendered up to the termination date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Governing Law</h2>
            <p className="mb-4">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to our website. Continued use of our services after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="mb-2">GTM Planetary LLC</p>
            <p className="mb-2">Email: support@gtmplanetary.com</p>
            <p className="mb-2">Phone: 888-451-2290</p>
            <p>Website: www.gtmplanetary.com</p>
          </section>
        </div>
      </main>
    </div>
  );
}
