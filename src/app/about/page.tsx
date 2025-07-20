export default function AboutPage() {
  return (
    <div className="flex flex-1 justify-center py-5 px-6">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <h1 className="text-4xl font-bold mb-4">About IdeaCheck</h1>
        <p className="text-lg text-muted-foreground mb-4">
          IdeaCheck is a revolutionary tool designed to empower innovators, entrepreneurs, and creators by providing instant, AI-powered feedback on the patentability of their ideas.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          Our mission is to democratize the initial stages of the patent process, making it accessible and understandable for everyone. By leveraging cutting-edge artificial intelligence, we analyze your idea against a vast database of existing patents and publications to give you a preliminary assessment of its novelty and potential.
        </p>
        <p className="text-lg text-muted-foreground">
          We believe that every great invention starts with a simple idea, and we're here to help you take that crucial first step with confidence.
        </p>
      </div>
    </div>
  );
}
