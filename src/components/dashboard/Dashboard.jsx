import './Dashboard.css'

export default function DashboardLayout({
    headerTop,
    headerBottom,
    children
}) {
    return (
        <div className="dashboard" dir="rtl">
            <header className="header">
                {headerTop()}
                {headerBottom}
            </header>
            {children}
        </div>
    );
}