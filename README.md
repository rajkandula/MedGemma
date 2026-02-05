# MedGemma

**[MedGemma Impact Challenge on Kaggle](https://www.kaggle.com/competitions/med-gemma-impact-challenge)**

MedGemma is a next-generation healthcare coordination platform powered by a multi-agent AI system. It is designed to simulate a comprehensive **Clinical Intake Squad**, transforming the patient experience from the moment they walk in (virtually) to their consultation.

## 🚀 Features

### 🤖 AI-Powered Clinical Intake Squad
MedGemma employs a sophisticated team of 5 specialized AI agents to handle the end-to-end patient journey:

1.  **Onboarding & Registration Agent (Front Desk)**: 
    - Verifies identity, validates insurance (simulated), and secures HIPAA consent.
    - Ensuring a "clean" patient profile before clinical intake begins.

2.  **Medical Scribe Agent (Symptom Collector)**:
    - Conducts a thorough distinct Review of Systems (ROS).
    - Generates a structured History of Present Illness (HPI) for the doctor.

3.  **Triage & Vitality Agent**:
    - Analyzes symptoms for "Red Flags" (e.g., chest pain) to direct emergency cases immediately.
    - Integrates with wearable data (simulated) for vital sign checks.

4.  **Context/History Agent**:
    - Scans longitudinal records for relevant medical history, surgeries, and drug interactions.
    - Provides context to the doctor and flags potential risks.

5.  **Scheduling & Notification Agent**:
    - Manages the hand-off to the doctor.
    - Handles appointment scheduling and "Doctor is ready" notifications.

### 💬 Interactive Chat Interface
- **Real-time Consultation**: Engage in natural language conversations with the AI medical team.
- **Dynamic Reasoning**: View the underlying thought process of the agents via the "Reasoning Indicator," offering transparency into how conclusions are reached.

### 👤 User Management
- **Comprehensive Profiles**: Manage personal health details, medical history, and preferences.
- **Secure Authentication**: Robust signup and login system to protect sensitive user data.

## 🏗️ Architecture

The following diagram illustrates the **Clinical Intake Squad** workflow:

```mermaid
graph TD
    User([Patient]) -->|Starts Session| Onboarding[Onboarding & Registration Agent]
    Onboarding -->|Verified & Consented| Scribe[Medical Scribe Agent]
    
    subgraph "Clinical Intake Squad"
        Scribe -->|Symptom Details (HPI)| Triage[Triage & Vitality Agent]
        Triage -- Red Flag --> Emergency([🚨 EMERGENCY / ER])
        Triage -->|Stable| History[Context/History Agent]
        History -->|Enriched Context| Scheduling[Scheduling & Notification Agent]
    end
    
    Scheduling -->|Ready| Doctor[Doctor Agent]
    Doctor -->|Care Plan| User
```

### 📋 Prescription & Care Plans
- **Digital Records**: Access generated care plans and suggested prescriptions (simulated).
- **History Tracking**: Review past consultations and medical advice.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Model**: [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/) (via Google Generative AI SDK)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: Custom JWT-based auth with JOSE
- **Storage**: AWS S3 compatible storage (R2) for media assets

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rajkandula/MedGemma.git
    cd MedGemma/home-doc
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the root directory and add the following variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key
    # Add other necessary keys for R2, etc.
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE)
