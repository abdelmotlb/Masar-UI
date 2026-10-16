import { useEffect } from "react";
import { Link } from "react-router";
import { RoutePaths } from "../../Constants";
import Search from "./search/Search";

function HomeHeader({
    openCreateModal,
    onSearchStateChange,
    isViewingSearchResults,
    isSearchStateActive,
}) {
    useEffect(() => {
        if (!isViewingSearchResults) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onSearchStateChange({ isLoading: false, results: null });
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isViewingSearchResults, onSearchStateChange]);

    const closeSearchResults = () => {
        onSearchStateChange({ isLoading: false, results: null });
    };

    return (
        <div className={`header-bottom${isViewingSearchResults ? " search-results-active" : ""}`}>
            {!isViewingSearchResults && (
                <button className="compose" onClick={openCreateModal}>
                    + إنشاء ملف جديد
                </button>
            )}
            <div className="home-search-with-help">
                <Search onSearchStateChange={onSearchStateChange} />
                {!isSearchStateActive && (
                    <Link
                        className="search-help-link"
                        to={`${RoutePaths.ABOUT}#search-help`}
                        aria-label="مساعدة البحث"
                        title="مساعدة البحث"
                    >
                        <span aria-hidden="true">؟</span>
                        <span>مساعدة</span>
                    </Link>
                )}
            </div>
            {isViewingSearchResults && (
                <button
                    className="search-results-close"
                    type="button"
                    aria-label="العودة إلى الملفات"
                    title="العودة إلى الملفات"
                    onClick={closeSearchResults}
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default HomeHeader;
