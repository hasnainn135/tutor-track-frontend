import { useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface SurveyFormData {
  role: string;
  familiarity: string;
  understandingPurpose: number;
  meetExpectations: number;
  intuitiveNavigation: number;
  featuresAccessible: number;
  easeNavigateStudent: number;
  easeNavigateTutor: number;
  visuallyAppealing: number;
  colorTypography: number;
  iconsClear: number;
  textReadability: number;
  layoutOrganized: number;
  mostAppealing: string;
  confusingAspects: string;
  difficultyTasks: string;
  missingFeatures: string;
  complexProcesses: string;
  confusingDesignElements: string;
}

const ratingQuestions = [
  { name: 'understandingPurpose', label: 'How easy was it to understand the overall purpose of the platform?' },
  { name: 'meetExpectations',    label: 'Does the platform meet your expectations for a tutor-student management system?' },
  { name: 'intuitiveNavigation', label: 'How intuitive is the navigation between the student and tutor sections?' },
  { name: 'featuresAccessible',  label: 'Are the features (e.g., scheduling, time tracking, wage calculation) clearly explained and accessible?' },
  { name: 'easeNavigateStudent', label: 'How easy was it to navigate the platform as a student?' },
  { name: 'easeNavigateTutor',   label: 'How easy was it to navigate the platform as a tutor?' },
  { name: 'visuallyAppealing',   label: 'How visually appealing is the overall design?' },
  { name: 'colorTypography',     label: 'Does the platform’s color scheme and typography feel professional and aligned with its purpose?' },
  { name: 'iconsClear',          label: 'Are the icons, buttons, and labels easy to understand?' },
  { name: 'textReadability',     label: 'How clear and readable is the text on the platform?' },
  { name: 'layoutOrganized',     label: 'Do you feel the platform’s layout (sections for students and tutors) is organized well?' },
];

const textQuestions = [
  { name: 'mostAppealing',           label: 'What aspects of the platform were most appealing or helpful?' },
  { name: 'confusingAspects',        label: 'What aspects of the platform were confusing or unnecessary?' },
  { name: 'difficultyTasks',         label: 'Did you experience any difficulty performing the following tasks?' },
  { name: 'missingFeatures',         label: 'Are there any features that feel missing or incomplete?' },
  { name: 'complexProcesses',        label: 'Were there any interactions or processes that felt unnecessarily complex or time-consuming?' },
  { name: 'confusingDesignElements', label: 'Are there any design elements that you found particularly confusing or distracting?' },
];

export default function SurveyPage() {
  const initial: SurveyFormData = {
    role: '', familiarity: '',
    understandingPurpose: 3, meetExpectations: 3, intuitiveNavigation: 3,
    featuresAccessible: 3, easeNavigateStudent: 3, easeNavigateTutor: 3,
    visuallyAppealing: 3, colorTypography: 3, iconsClear: 3,
    textReadability: 3, layoutOrganized: 3,
    mostAppealing: '', confusingAspects: '', difficultyTasks: '',
    missingFeatures: '', complexProcesses: '', confusingDesignElements: '',
  };

  const [formData, setFormData] = useState<SurveyFormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'survey'), {
        ...formData,
        createdAt: Timestamp.now(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
        <p>Your response has been recorded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">TutorTrack Design Evaluation</h1>
      <div className="space-y-4">
        <p><strong>Student UI UX:</strong> <a href="https://www.figma.com/proto/fF68idlNuo8Vt6stFTNDXP/TutorTrack-Design?node-id=43-8374&p=f&t=qQPX5Vuh2aVJzLlT-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=43%3A8374&show-proto-sidebar=1" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">View prototype</a></p>
        <p><strong>Tutor UI UX:</strong> <a href="https://www.figma.com/proto/fF68idlNuo8Vt6stFTNDXP/TutorTrack-Design?node-id=43-10604&p=f&t=qQPX5Vuh2aVJzLlT-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=43%3A10604&show-proto-sidebar=1" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">View prototype</a></p>
        <h2 className="text-xl font-semibold">Purpose of the Survey</h2>
        <p>This survey is being conducted as part of a final-year dissertation/project at University of Hertfordshire. The purpose is to evaluate the design and usability of &quot;TutorTrack,&quot; a tutor-student management platform.</p>
        <h2 className="text-xl font-semibold">Confidentiality Statement</h2>
        <p>Your responses will remain confidential and will only be used for academic purposes. No personally identifiable information will be shared outside this research project.</p>
        <h2 className="text-xl font-semibold">Voluntary Participation</h2>
        <p>Participation is entirely voluntary. You can skip questions or withdraw at any time without consequence.</p>
        <h2 className="text-xl font-semibold">Use of Data</h2>
        <p>Data will be used to improve TutorTrack’s design and will form part of the final dissertation. Aggregate results may be shown to examiners but will never identify individuals.</p>
        <p className="italic">By clicking “Submit,” you confirm that you’ve read and understood this information and agree to participate.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role */}
        <div>
          <label htmlFor="role" className="block font-medium mb-1">Who are you testing this platform as?</label>
          <select
            id="role" name="role" required
            value={formData.role} onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select one</option>
            <option value="Student">Student</option>
            <option value="Tutor">Tutor</option>
          </select>
        </div>

        {/* Familiarity */}
        <div>
          <label htmlFor="familiarity" className="block font-medium mb-1">
            How familiar are you with similar platforms (e.g., tutor marketplaces, scheduling apps)?
          </label>
          <select
            id="familiarity" name="familiarity" required
            value={formData.familiarity} onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select one</option>
            <option value="Very familiar">Very familiar</option>
            <option value="Somewhat familiar">Somewhat familiar</option>
            <option value="Not familiar">Not familiar</option>
          </select>
        </div>

        {/* Rating questions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Please rate each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree):
          </h2>
          {ratingQuestions.map(q => (
            <div key={q.name} className="mb-4">
              <p className="font-medium mb-2">{q.label}</p>
              <div className="flex space-x-4">
                {[1,2,3,4,5].map(n => (
                  <label key={n} className="flex items-center space-x-1">
                    <input
                      type="radio" name={q.name}
                      value={n}
                      checked={formData[q.name as keyof SurveyFormData] === n}
                      onChange={handleChange}
                      required
                    />
                    <span>{n}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Open-ended */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Open-ended Feedback</h2>
          {textQuestions.map(t => (
            <div key={t.name} className="mb-4">
              <label htmlFor={t.name} className="block font-medium mb-1">{t.label}</label>
              <textarea
                id={t.name} name={t.name}
                value={formData[t.name as keyof SurveyFormData] as string}
                onChange={handleChange}
                rows={4} required
                className="w-full border rounded p-2"
              />
            </div>
          ))}
        </div>

        <button
          type="submit" disabled={submitting}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  );
}