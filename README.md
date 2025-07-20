# IdeaCheck: AI-Powered Patentability Analysis

IdeaCheck is a web application that leverages the power of Google's Gemini AI to provide instant analysis of patent ideas. Users can describe their invention and receive a detailed report on its potential patentability, including prior art analysis, novelty assessment, and suggestions for improvement.

## Features

- **AI-Powered Analysis**: Utilizes Google's Gemini model to perform in-depth analysis of your patent ideas.
- **Instant Feedback**: Get a patentability report in seconds, including a status, summary, and cited resources.
- **Improvement Suggestions**: Receive actionable advice on how to strengthen your invention's patentability.
- **Prior Art Search**: The AI searches for existing patents and publications that may be relevant to your idea.
- **Modern & Responsive UI**: A clean, intuitive, and dark-themed interface built for a great user experience.

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) & [Google AI](https://ai.google.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- [npm](https://www.npmjs.com/get-npm) or a compatible package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of your project and add your Google AI API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```
    You can obtain an API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    This command starts the Next.js application.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

5.  **Run the Genkit development server:**
    In a separate terminal, run this command to start the Genkit development server, which handles the AI flows.
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit developer UI, typically on port `4000`.

## Project Structure

The project follows a standard Next.js App Router structure, with key directories organized as follows:

-   `src/app/`: Contains all the application pages and routes.
    -   `layout.tsx`: The root layout for all pages, including the header and footer.
    -   `page.tsx`: The main landing page.
    -   `check/page.tsx`: The page containing the patentability checking tool.
    -   `globals.css`: Global styles and Tailwind CSS theme configuration.
-   `src/ai/`: Contains all Genkit-related files.
    -   `genkit.ts`: The main Genkit configuration file, where the AI model is defined.
    -   `flows/`: Directory for all AI-powered workflows (e.g., `patent-idea-analysis.ts`).
-   `src/components/`: Contains reusable React components.
    -   `ui/`: Auto-generated UI components from Shadcn/ui.
-   `src/hooks/`: Contains custom React hooks (e.g., `use-toast.ts`).
-   `src/lib/`: Contains utility functions (e.g., `utils.ts` for `cn`).
-   `public/`: Contains static assets like images and fonts.
