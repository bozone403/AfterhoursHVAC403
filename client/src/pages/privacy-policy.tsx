import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Lock, Database, Phone } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-100 border border-green-200 rounded-full px-6 py-3 mb-6">
            <Eye className="h-5 w-5 text-green-700 mr-3" />
            <span className="text-green-800 text-lg font-bold">Privacy Policy</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            How AfterHours HVAC collects, uses, and protects your personal information
          </p>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Shield className="h-6 w-6 mr-3" />
              Privacy Protection Framework
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            {/* Section 1: Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Privacy Commitment</h2>
              <p className="text-gray-700 mb-4">
                AfterHours HVAC ("we", "us", "our") is committed to protecting the privacy and security of your 
                personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you use our professional HVAC platform and services.
              </p>
              <p className="text-gray-700">
                We comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) and 
                applicable provincial privacy legislation in Canada.
              </p>
            </section>

            <Separator />

            {/* Section 2: Information Collection */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">2.1 Account Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Professional credentials and licensing information</li>
                  <li>Company information for corporate accounts</li>
                  <li>Billing and payment information (processed securely through Stripe)</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800">2.2 Service Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Emergency service requests and job details</li>
                  <li>Customer information for quotes and service calls</li>
                  <li>Equipment specifications and diagnostic data</li>
                  <li>Project calculations and estimates</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">2.3 Technical Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>IP address, browser type, device information</li>
                  <li>Platform usage patterns and feature interactions</li>
                  <li>Error logs and performance data</li>
                  <li>Location data for emergency service dispatch</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Section 3: Information Use */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">3.1 Service Delivery</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Providing access to professional HVAC tools and calculators</li>
                  <li>Processing emergency service requests and dispatching technicians</li>
                  <li>Generating quotes, estimates, and project documentation</li>
                  <li>Managing subscription billing and account access</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800">3.2 Communication</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Sending service updates and appointment confirmations</li>
                  <li>Providing technical support and customer service</li>
                  <li>Delivering platform updates and new feature announcements</li>
                  <li>Emergency notifications and safety alerts</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">3.3 Platform Improvement</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Analyzing usage patterns to enhance user experience</li>
                  <li>Developing new tools and features based on user needs</li>
                  <li>Maintaining platform security and preventing fraud</li>
                  <li>Ensuring compliance with industry standards and regulations</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Section 4: Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Limited Sharing Policy</h3>
                    <p className="text-blue-700">
                      We do not sell, rent, or trade your personal information to third parties. 
                      Information is only shared as described below or with your explicit consent.
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800">4.1 Service Providers</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Payment processing through Stripe (PCI compliant)</li>
                <li>Cloud hosting and data storage providers</li>
                <li>Emergency dispatch and technician coordination</li>
                <li>Equipment suppliers for quote integration (pricing only)</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800">4.2 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose information when required by law, regulation, or legal process, 
                including compliance with safety codes, building permits, and regulatory inspections.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800">4.3 Corporate Accounts</h3>
              <p className="text-gray-700">
                For corporate memberships, account administrators can access data for users within 
                their organization. This includes usage reports, project data, and billing information.
              </p>
            </section>

            <Separator />

            {/* Section 5: Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">5.1 Technical Safeguards</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>End-to-end encryption for data transmission (TLS 1.3)</li>
                  <li>AES-256 encryption for data storage</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>Regular security audits and penetration testing</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800">5.2 Operational Security</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Employee background checks and security training</li>
                  <li>Role-based access controls and audit logging</li>
                  <li>Secure development practices and code reviews</li>
                  <li>Incident response and breach notification procedures</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">5.3 Data Retention</h3>
                <p className="text-gray-700">
                  Personal information is retained only as long as necessary for service delivery 
                  and legal compliance. Account data is purged 90 days after cancellation, 
                  except where required for warranty, tax, or regulatory purposes.
                </p>
              </div>
            </section>

            <Separator />

            {/* Section 6: Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">6.1 Access and Correction</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to access your personal information and request corrections. 
                  Most account information can be updated directly through your profile settings.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">6.2 Data Portability</h3>
                <p className="text-gray-700 mb-4">
                  You can export your project data, quotes, and service history in standard formats. 
                  Corporate accounts can export data for all users within their organization.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">6.3 Withdrawal of Consent</h3>
                <p className="text-gray-700 mb-4">
                  You may withdraw consent for non-essential data processing at any time. 
                  Note that this may limit access to certain platform features.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">6.4 Account Deletion</h3>
                <p className="text-gray-700">
                  You may request deletion of your account and associated data. We will complete 
                  deletion within 30 days, subject to legal retention requirements.
                </p>
              </div>
            </section>

            <Separator />

            {/* Section 7: Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Online Tracking</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">7.1 Essential Cookies</h3>
                <p className="text-gray-700 mb-4">
                  We use necessary cookies for authentication, security, and basic platform functionality. 
                  These cannot be disabled without affecting service operation.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">7.2 Analytics and Performance</h3>
                <p className="text-gray-700 mb-4">
                  Optional analytics cookies help us understand platform usage and improve performance. 
                  You can manage these preferences in your account settings.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">7.3 Third-Party Integration</h3>
                <p className="text-gray-700">
                  Our platform integrates with Stripe for payments and may use other professional 
                  tools. These services have their own privacy policies governing data handling.
                </p>
              </div>
            </section>

            <Separator />

            {/* Section 8: Changes and Updates */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Policy Updates</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy to reflect changes in our practices, technology, 
                or legal requirements. Material changes will be communicated through email and 
                platform notifications 30 days before taking effect.
              </p>
              <p className="text-gray-700">
                Continued use of the platform after policy updates constitutes acceptance of the 
                new terms. If you disagree with changes, you may cancel your account before they take effect.
              </p>
            </section>

            <Separator />

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy Contact Information</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Privacy Officer</h3>
                    <p className="text-green-800">
                      <strong>Email:</strong> privacy@afterhourshvac.ca<br />
                      <strong>Phone:</strong> (403) 613-6014<br />
                      <strong>Mail:</strong> AfterHours HVAC Privacy Officer<br />
                      Calgary, Alberta, Canada<br />
                      <strong>Response Time:</strong> 30 days for privacy requests
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Compliance Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-3">
                <Database className="h-6 w-6 text-gray-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Compliance</h3>
                  <p className="text-gray-700">
                    This policy complies with the Personal Information Protection and Electronic Documents Act (PIPEDA), 
                    Alberta Personal Information Protection Act (PIPA), and industry-specific regulations for HVAC services. 
                    We maintain documentation to demonstrate compliance with Canadian privacy laws.
                  </p>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last Updated: January 1, 2025 | Version 3.0
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Effective Date: January 1, 2025 | Next Review: July 1, 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}