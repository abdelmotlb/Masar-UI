import "./LoadingSpinner.css";

export default function LoadingSpinner({ message }) {

    return (
        <div className="loading-overlay" role="status" aria-live="polite">
            <div className="loading-content">
                <div className="spinner" aria-hidden="true"></div>
                <span className="loading-message" dir="rtl">{message}</span>
            </div>
        </div>
    );
}
