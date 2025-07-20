export default function ContactPage() {
  return (
    <div className="flex flex-1 justify-center py-5 px-6">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Have questions, feedback, or need support? We'd love to hear from you.
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Email</h2>
            <a href="mailto:support@ideacheck.com" className="text-primary hover:underline">
              support@ideacheck.com
            </a>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Follow Us</h2>
            <p className="text-muted-foreground">Stay updated on our latest features and news.</p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-primary hover:underline">Twitter</a>
              <a href="#" className="text-primary hover:underline">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
