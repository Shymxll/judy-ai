export function Footer() {
  return (
    <footer className="border-t-4 border-border bg-foreground text-secondary-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-heading mb-4">JudyAI</h3>
            <p className="font-base">Creating fair laws through artificial intelligence for everyday conflicts.</p>
          </div>

          <div>
            <h4 className="text-lg font-heading mb-4">Quick Links</h4>
            <ul className="space-y-2 font-base">
              <li>
                <a href="/start-case" className="hover:underline">
                  Start a Case
                </a>
              </li>
              <li>
                <a href="/browse-laws" className="hover:underline">
                  Browse Laws
                </a>
              </li>
              <li>
                <a href="/my-cases" className="hover:underline">
                  My Cases
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading mb-4">Legal</h4>
            <ul className="space-y-2 font-base">
              <li>
                <a href="/privacy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About AI Laws
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-secondary-background mt-8 pt-8 text-center">
          <p className="font-base">© 2025 JudyAI. All rights reserved. Laws created by AI for educational purposes.</p>
        </div>
      </div>
    </footer>
  )
}
