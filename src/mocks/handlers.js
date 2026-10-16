import { http, HttpResponse } from "msw";
import { API_BASE } from "../Constants";

const mockFiles = [
    "طلب إجازة اعتيادية",
    "صيانة أجهزة الحاسب الآلي",
    "تحديث بيانات الموظفين",
    "طلب توفير مستلزمات مكتبية",
    "تنظيم المراسلات الرسمية",
    "تطوير إجراءات العمل",
    "متابعة طلبات الصيانة",
    "تحديث سجلات الملفات",
    "توفير أجهزة مكتبية",
    "تنظيم أعمال الأرشيف",
    "مراجعة بيانات الموظفين",
    "متابعة طلبات الإجازة",
].map((subject, index) => ({
    id: index + 1,
    order: index + 1,
    subject,
    isOpen: index % 4 !== 0,
    isFollowed: index % 3 === 0,
    lastModifiedAt: new Date(Date.UTC(2026, 9, 15 - index)).toISOString(),
}));

const searchRecords = [
    {
        topicNumber: "2025/001",
        type: "Topic",
        topicSubject: "طلب إجازة اعتيادية",
    },
    {
        topicNumber: "2025/001",
        type: "Procedure",
        procedureId: 1,
        procedureDescription: "الموافقة على طلب الإجازة",
    },
    {
        topicNumber: "2025/002",
        type: "Topic",
        topicSubject: "صيانة أجهزة الحاسب الآلي",
    },
    {
        topicNumber: "2025/002",
        type: "Procedure",
        procedureId: 2,
        procedureDescription: "إحالة أجهزة الحاسب إلى قسم الصيانة",
    },
    {
        topicNumber: "2025/003",
        type: "Topic",
        topicSubject: "تحديث بيانات الموظفين",
    },
    {
        topicNumber: "2025/003",
        type: "Procedure",
        procedureId: 3,
        procedureDescription: "مراجعة بيانات الموظفين وتحديث السجلات",
    },
    {
        topicNumber: "2025/004",
        type: "Topic",
        topicSubject: "طلب توفير مستلزمات مكتبية",
    },
    {
        topicNumber: "2025/004",
        type: "Procedure",
        procedureId: 4,
        procedureDescription: "استلام المستلزمات المكتبية وتوزيعها",
    },
    {
        topicNumber: "2025/005",
        type: "Topic",
        topicSubject: "تنظيم المراسلات الرسمية",
    },
];

const validScopes = new Set(["both", "topic", "procedure"]);
const validModes = new Set(["exact", "flexible"]);

function matchesQuery(text, query, mode) {
    const normalizedText = text.toLocaleLowerCase();
    const normalizedQuery = query.toLocaleLowerCase();

    if (mode === "exact") {
        return normalizedText.includes(normalizedQuery);
    }

    return normalizedQuery
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => normalizedText.includes(word));
}

export const handlers = [
    http.get(`${API_BASE}/Topic/get-page/:page/:pageSize`, ({ params }) => {
        const page = Number(params.page);
        const pageSize = Number(params.pageSize);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(pageSize) ||
            pageSize < 1
        ) {
            return HttpResponse.json(
                { message: "Page and page size must be positive integers." },
                { status: 400 },
            );
        }

        const startIndex = (page - 1) * pageSize;
        return HttpResponse.json(mockFiles.slice(startIndex, startIndex + pageSize));
    }),
    http.get(`${API_BASE}/Search`, ({ request }) => {
        debugger;
        const url = new URL(request.url);
        const query = url.searchParams.get("query")?.trim() ?? "";
        const scope = url.searchParams.get("scope");
        const mode = url.searchParams.get("mode");

        if (!validScopes.has(scope) || !validModes.has(mode)) {
            return HttpResponse.json(
                { message: "Invalid search scope or mode." },
                { status: 400 },
            );
        }


        if (!query) {
            return HttpResponse.json([]);
        }

        const results = searchRecords.filter((record) => {
            const isTopic = record.type === "Topic";
            if (scope === "topic" && !isTopic) return false;
            if (scope === "procedure" && isTopic) return false;

            const searchableText = isTopic
                ? record.topicSubject
                : record.procedureDescription;

            return matchesQuery(searchableText, query, mode);
        });

        return HttpResponse.json(results);
    }),
];
