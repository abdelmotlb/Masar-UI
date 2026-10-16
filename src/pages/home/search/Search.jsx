import { useEffect, useRef, useState } from "react";
import { searchAPI } from "../../../apis/Search-api";
import { useAuth } from "../../../components/Authentication/AuthProvider";
import DataTable from "../../../components/DataTable/DataTable";
import useClientPagination from "../../../components/DataTable/pagination/useClientPagination";
import { TablePageSize } from "../../../Constants";
import { httpErrorHandler } from "../../../ErrorHandler/ErrorHandler";
import { useNotification } from "../../../components/notifier/NotificationProvider";
import "./Search.css";
import { useLoadingSpinner } from "../../../components/loader/LoadingSpinnerProvider";

const SEARCH_SCOPES = {
    BOTH: "both",
    TOPIC: "topic",
    PROCEDURE: "procedure",
};

const SEARCH_MODES = {
    EXACT: "exact",
    FLEXIBLE: "flexible",
};


function SearchDropdown({ label, value, options, onChange, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    return (
        <div className="search-dropdown" ref={dropdownRef}>
            <button
                className="search-option"
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
                onClick={() => setIsOpen((open) => !open)}
            >
                <span>{selectedOption?.label}</span>
                <span className={`search-option-arrow${isOpen ? " is-open" : ""}`} aria-hidden="true" />
            </button>
            {isOpen && (
                <div className="search-option-menu" role="listbox" aria-label={label}>
                    {options.map((option) => (
                        <button
                            className={`search-option-item${option.value === value ? " is-selected" : ""}`}
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function Search({ onSearchStateChange }) {
    const [query, setQuery] = useState("");
    const [scope, setScope] = useState(SEARCH_SCOPES.BOTH);
    const [mode, setMode] = useState(SEARCH_MODES.EXACT);
    const [isLoading, setIsLoading] = useState(false);
    const notify = useNotification();
    const { logout } = useAuth();
    const loader = useLoadingSpinner();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const searchQuery = query.trim();

        if (!searchQuery) {
            onSearchStateChange({ isLoading: false, results: null });
            return;
        }

        onSearchStateChange({ isLoading: true, results: null });
        loader.show("جارٍ البحث...");
        try {
            const results = await searchAPI(searchQuery, scope, mode);
            onSearchStateChange({ isLoading: false, results });
        } catch (error) {
            onSearchStateChange({ isLoading: false, results: null });
            httpErrorHandler({
                err: error,
                notify,
                logout,
            });
        } finally {
            loader.hide();
        }
    };


return (
    <div className="search-control">
        <form
            id="home-search-form"
            className="search-form"
            onSubmit={handleSubmit}
            role="search"
        >
            <input
                className="search-field"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن ملف..."
                aria-label="نص البحث"
            />

            <div className="search-filters">
                <SearchDropdown
                    label="نطاق البحث"
                    value={scope}
                    onChange={setScope}
                    options={[
                        { value: SEARCH_SCOPES.BOTH, label: "الكل" },
                        { value: SEARCH_SCOPES.TOPIC, label: "الموضوع" },
                        { value: SEARCH_SCOPES.PROCEDURE, label: "الإجراءات" },
                    ]}
                />

                <SearchDropdown
                    label="طريقة البحث"
                    value={mode}
                    onChange={setMode}
                    options={[
                        { value: SEARCH_MODES.EXACT, label: "عبارة" },
                        { value: SEARCH_MODES.FLEXIBLE, label: "كلمات" },
                    ]}
                />
            </div>

            <button
                className="search-submit"
                type="submit"
                aria-label="بحث"
                title="بحث"
            >
                <svg
                    viewBox="0 0 24 24"
                    width="21"
                    height="21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="10.8" cy="10.8" r="6.5" />
                    <path d="m16 16 4 4" />
                </svg>
            </button>
        </form>
    </div>
);
}

export function SearchResults({ results }) {
    const data = results.map((result, index) => ({
        ...result,
        order: `${result.type}-${result.procedureId ?? result.topicNumber}-${index}`,
    }));
    const { paginatedData, pagination } = useClientPagination(data, TablePageSize);

    const columns = [
        {
            key: "topicNumber",
            title: "رقم الملف",
            width: "20%",
            align: "center",
        },
        {
            key: "type",
            title: "نوع النتيجة",
            width: "25%",
            align: "center",
            render: (type) => (
                <span className={`search-result-tag ${type === "Topic" ? "topic" : "procedure"}`}>
                    {type === "Topic" ? "موضوع الملف" : "وصف الإجراء"}
                </span>
            ),
        },
        {
            key: "searchOutput",
            title: "نتيجة البحث",
            width: "55%",
            render: (_, result) =>
                result.type === "Topic"
                    ? result.topicSubject
                    : result.procedureDescription,
        },
    ];

    return (
        <DataTable
            title="نتائج البحث"
            columns={columns}
            data={paginatedData}
            pagination={pagination}
        />
    );
}

export default Search;
