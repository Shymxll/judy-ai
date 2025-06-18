import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CaseCreationForm } from "@/components/case-creation-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaGavel, FaUsers, FaRobot } from "react-icons/fa"

export default function StartCasePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-heading mb-6">Start a New Case</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Present your conflict and let AI create a fair resolution through our three-step process
              </p>

              {/* Process Overview */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="text-center">
                  <CardHeader>
                    <FaUsers className="text-3xl text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">Submit Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Share your perspective and invite the other party
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <FaRobot className="text-3xl text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Our AI analyzes both sides and asks clarifying questions
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <FaGavel className="text-3xl text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">Fair Resolution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Receive a balanced judgment and new legal precedent
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Case Creation Form */}
            <CaseCreationForm />
          </div>
        </div>
      </main>
    </div>
  )
}
