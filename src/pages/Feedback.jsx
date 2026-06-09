import TutorIANavbar from '../components/shared/TutorIANavbar.jsx'
import FeedbackHero from '../components/Feedback/FeedbackHero'
import FeedbackResumen from '../components/Feedback/FeedbackResumen'
import FeedbackExplicacion from '../components/Feedback/FeedbackExplicacion'
import FeedbackAcciones from '../components/Feedback/FeedbackAcciones'
import FeedbackSidebar from '../components/Feedback/FeedbackSidebar'
import { feedbackData } from '../components/Feedback/feedbackData'
import './Feedback.css'

export default function Feedback() {
    return (
        <div className="feedback-page">
            <TutorIANavbar breadcrumb={[
                { label: 'Dashboard', path: '/dashboard' },
                { label: feedbackData.modulo, path: '/dashboard' },
                { label: feedbackData.ejercicio, path: '/ejercicio' },
                { label: 'Retroalimentación' }
            ]} />

            <div className="feedback-page__body">
                <div className="feedback-page__main">
                    <div className="feedback-animar" style={{ animationDelay: '0ms' }}>
                        <FeedbackHero />
                    </div>
                    <div className="feedback-animar" style={{ animationDelay: '80ms' }}>
                        <FeedbackResumen />
                    </div>
                    <div className="feedback-animar" style={{ animationDelay: '160ms' }}>
                        <FeedbackExplicacion />
                    </div>
                    <div className="feedback-animar" style={{ animationDelay: '240ms' }}>
                        <FeedbackAcciones />
                    </div>
                </div>
                <div className="feedback-animar" style={{ animationDelay: '120ms' }}>
                    <FeedbackSidebar />
                </div>
            </div>
        </div>
    )
}