import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, AlertTriangle, Phone } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-6">
            <FileText className="h-5 w-5 text-blue-700 mr-3" />
            <span className="text-blue-800 text-lg font-bold">Legal Documents</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            AfterHours HVAC Professional Services Platform - Effective Date: January 1, 2025
          </p>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Shield className="h-6 w-6 mr-3" />
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            {/* Section 1: Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and AfterHours HVAC 
                ("Company", "we", "us", or "our") regarding your use of our professional HVAC platform and services.
              </p>
              <p className="text-gray-700">
                By accessing or using our platform, you agree to be bound by these Terms. If you do not agree with 
                these Terms, you must not access or use our services.
              </p>
            </section>

            <Separator />

            {/* Section 2: Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Professional HVAC Services</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">2.1 Platform Services</h3>
                <p className="text-gray-700">
                  Our platform provides professional HVAC tools including diagnostic assistants, quote builders, 
                  material calculators, emergency service tracking, and industry-specific resources.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">2.2 Membership Tiers</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Basic Access:</strong> Limited access to public calculators and resources</li>
                  <li><strong>Pro Membership:</strong> $49/month, $499/year, or $1,500 lifetime access to advanced tools</li>
                  <li><strong>Corporate Membership:</strong> $5,000/year for up to 10 users with enterprise features</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">2.3 Emergency Services</h3>
                <p className="text-gray-700">
                  24/7 emergency HVAC services are provided through licensed technicians. Response times and 
                  availability may vary based on location and weather conditions.
                </p>
              </div>
            </section>

            <Separator />

            {/* Section 3: User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">3.1 Professional Use</h3>
                <p className="text-gray-700">
                  Our platform is designed for professional HVAC contractors, technicians, and industry professionals. 
                  Users must possess appropriate licensing and qualifications for HVAC work in their jurisdiction.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">3.2 Account Security</h3>
                <p className="text-gray-700">
                  You are responsible for maintaining the confidentiality of your account credentials and for all 
                  activities under your account. Corporate accounts must manage user access appropriately.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">3.3 Compliance</h3>
                <p className="text-gray-700">
                  Users must comply with all applicable local, provincial, and federal regulations including building 
                  codes, safety standards, and environmental regulations specific to Alberta and Canada.
                </p>
              </div>
            </section>

            <Separator />

            {/* Section 4: Payment Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment and Billing</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">4.1 Subscription Fees</h3>
                <p className="text-gray-700">
                  All fees are in Canadian Dollars (CAD). Pro memberships auto-renew unless cancelled. 
                  Lifetime memberships are one-time payments with no recurring charges.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">4.2 Emergency Service Billing</h3>
                <p className="text-gray-700">
                  Emergency services are billed separately based on diagnostic fees, labor rates, and materials. 
                  A $199 diagnostic fee applies to all emergency calls, credited toward repairs if work is completed.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">4.3 Refund Policy</h3>
                <p className="text-gray-700">
                  Monthly subscriptions may be cancelled anytime. Annual subscriptions are non-refundable after 30 days. 
                  Lifetime memberships are final sale. Emergency service fees are non-refundable once service begins.
                </p>
              </div>
            </section>

            <Separator />

            {/* Section 5: Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitations and Disclaimers</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Professional Judgment Required</h3>
                    <p className="text-yellow-700">
                      Our diagnostic tools and calculators are aids to professional judgment, not replacements for 
                      qualified HVAC expertise. Always verify calculations and follow local codes.
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800">5.1 Warranty Disclaimer</h3>
              <p className="text-gray-700 mb-4">
                The platform and tools are provided "as is" without warranties. We do not guarantee accuracy of 
                calculations, compatibility with all systems, or fitness for specific purposes.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800">5.2 Liability Limitations</h3>
              <p className="text-gray-700">
                Our liability is limited to the amount paid for services. We are not liable for consequential damages, 
                business losses, or damages from equipment failure or improper installation.
              </p>
            </section>

            <Separator />

            {/* Section 6: Privacy and Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                We collect and process personal information in accordance with our Privacy Policy and applicable 
                Canadian privacy laws including PIPEDA. Customer data is encrypted and stored securely.
              </p>
              <p className="text-gray-700">
                Corporate accounts maintain control over user data within their organization. We do not share 
                customer information with third parties except as required by law or for service delivery.
              </p>
            </section>

            <Separator />

            {/* Section 7: Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate the agreement with 30 days notice. We may immediately terminate accounts 
                for violation of terms, illegal activities, or misuse of the platform.
              </p>
              <p className="text-gray-700">
                Upon termination, access to the platform ceases immediately. Data export options are available 
                for 90 days after termination for paid accounts.
              </p>
            </section>

            <Separator />

            {/* Section 8: Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law and Disputes</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of Alberta, Canada. Any disputes will be resolved through 
                arbitration in Calgary, Alberta, or through the Alberta courts.
              </p>
              <p className="text-gray-700">
                For technical disputes related to HVAC work, the Technical Safety BC and Alberta Safety Codes 
                Authority standards apply where applicable.
              </p>
            </section>

            <Separator />

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">AfterHours HVAC</h3>
                    <p className="text-blue-800">
                      <strong>Phone:</strong> (403) 613-6014<br />
                      <strong>Email:</strong> Jordan@Afterhourshvac.ca<br />
                      <strong>Business Hours:</strong> 24/7 Emergency Service<br />
                      <strong>Location:</strong> Calgary, Alberta, Canada
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Last Updated */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last Updated: January 1, 2025 | Version 3.0
              </p>
              <p className="text-sm text-gray-500 mt-2">
                These terms supersede all previous agreements and may be updated with 30 days notice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}