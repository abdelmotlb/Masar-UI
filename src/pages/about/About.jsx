import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { RoutePaths } from "../../Constants";
import "./About.css";

const functionalities = [
  {
    number: "01",
    icon: "▣",
    title: "إدارة الملفات",
    description:
      "إنشاء الملفات وتنظيمها ومتابعة حالتها مع ترقيم الملفات بشكل منظم.",
  },
  {
    number: "02",
    icon: "⇋",
    title: "إدارة المراسلات",
    description:
      "تسجيل وتنظيم المراسلات المتبادلة وربطها بالملفات ذات الصلة.",
  },
  {
    number: "03",
    icon: "⚙",
    title: "متابعة الإجراءات",
    description:
      "تسجيل الإجراءات المتخذة ومتابعة آخر تحديثات وإجراءات كل ملف.",
  },
  {
    number: "04",
    icon: "⌕",
    title: "البحث الذكي",
    description:
      "البحث السريع داخل الملفات والإجراءات مع دعم البحث باللغة العربية.",
  },
  {
    number: "05",
    icon: "◇",
    title: "المتابعة والتنظيم",
    description:
      "عرض الملفات ومتابعتها بطريقة واضحة تساعد على الوصول السريع للمعلومات.",
  },
  {
    number: "06",
    icon: "◎",
    title: "الأمان والتحكم",
    description:
      "تأمين الوصول إلى النظام وإدارة هوية المستخدمين وصلاحياتهم.",
  },
];

const developers = [
    "جندي / عبدالرحمن محمد محمد عبدالمطلب",
    "جندي / عبدالرحمن محمد السيد مكي",
];

const stakeholders = [
  {
    icon: "◈",
    title: "مبادر فكرة المشروع",
    position: "صاحب المبادرة",
    description: "طرح فكرة المشروع والمساهمة في تحديد أهدافه واحتياجاته.",
  },
  {
    icon: "◈",
    title: "الجهة المالكة",
    position: "الجهة الراعية للمشروع",
    description: "تحديد أهداف النظام ومتطلبات العمل والإشراف على المشروع.",
  },
  {
    icon: "◎",
    title: "الإدارة",
    position: "الإشراف الإداري",
    description: "متابعة سير العمل والحصول على المعلومات اللازمة لاتخاذ القرار.",
  },
  {
    icon: "◇",
    title: "المستخدمون",
    position: "المستخدم النهائي",
    description: "استخدام النظام لإدارة الملفات والمراسلات والإجراءات اليومية.",
  },
  {
    icon: "⚙",
    title: "مسؤولو النظام",
    position: "إدارة وتشغيل النظام",
    description: "إدارة المستخدمين ومتابعة تشغيل النظام ودعم العمليات.",
  },
];

const technologyGroups = [
  {
    title: "الواجهة الأمامية",
    technologies: ["React", "Vite", "Tauri"],
  },
  {
    title: "الواجهة الخلفية",
    technologies: [".NET 10", "ASP.NET Core", "Entity Framework Core"],
  },
  {
    title: "قاعدة البيانات",
    technologies: ["SQLite", "FTS5"],
  },
];

export default function About() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.hash) return;

    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({ block: "start" });
  }, [location.hash]);

  return (
    <div className="about-page" dir="rtl">
      {/* HERO */}
      <section className="about-hero">
        <div className="hero-background-number">01</div>

        <div className="hero-content">
          <div className="system-label">
            <span className="label-line" />
            <span>SYSTEM INFORMATION</span>
          </div>

          <h1>مَسار</h1>

          <p className="hero-subtitle">
            نظام متابعة الملفات والمراسلات
          </p>

          <p className="hero-description">
            منصة رقمية متكاملة لتنظيم الملفات والمراسلات ومتابعة الإجراءات
            وتسهيل الوصول إلى المعلومات.
          </p>

          <div className="hero-meta">
            <span>نظام إدارة ومتابعة</span>
            <span className="meta-separator">•</span>
            <span>الإصدار 1.0</span>
          </div>

          <div className="about-page-actions">
            <Link className="about-page-action" to={RoutePaths.HOME}>
              الرئيسية
            </Link>
            <button
              className="about-page-action"
              type="button"
              onClick={() =>
                navigate(window.history.state?.idx > 0 ? -1 : RoutePaths.HOME)
              }
            >
              رجوع
            </button>
          </div>
        </div>

        <div className="hero-decoration">
          <span />
          <span />
          <span />
        </div>
      </section>

      <nav className="about-section-nav" aria-label="أقسام صفحة عن النظام">
        <a href="#introduction">عن النظام</a>
        <a href="#functionalities">وظائف النظام</a>
        <a href="#search-help">دليل البحث</a>
        <a href="#stakeholders">أصحاب المصلحة</a>
        <a href="#technology">التقنيات</a>
        <a href="#developers">فريق التطوير</a>
      </nav>

      {/* ABOUT SYSTEM */}
      <section className="about-section introduction-section" id="introduction">
        <div className="section-heading">
          <span className="section-number">01</span>

          <div>
            <span className="section-kicker">THE SYSTEM</span>
            <h2>عن النظام</h2>
          </div>
        </div>

        <div className="introduction-content">
          <div className="intro-accent">
            <span />
          </div>

          <p>
            تم تطوير <strong>مَسار</strong> ليكون بيئة موحدة لإدارة ومتابعة
            الملفات والمراسلات، حيث يجمع بين تنظيم البيانات وسهولة الوصول
            إليها ومتابعة الإجراءات المرتبطة بكل ملف.
          </p>

          <p>
            يهدف النظام إلى تقليل التعقيد في دورة العمل، وتحسين وضوح حالة
            الملفات، وتوفير وسيلة أكثر كفاءة لمتابعة المراسلات والإجراءات.
          </p>
        </div>
      </section>

      {/* FUNCTIONALITIES */}
      <section className="about-section" id="functionalities">
        <div className="section-heading">
          <span className="section-number">02</span>

          <div>
            <span className="section-kicker">CAPABILITIES</span>
            <h2>وظائف النظام</h2>
          </div>
        </div>

        <div className="functionality-grid">
          {functionalities.map((item) => (
            <article className="functionality-card" key={item.number}>
              <div className="card-top">
                <span className="function-number">{item.number}</span>
                <span className="function-icon">{item.icon}</span>
              </div>

              <div className="function-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div className="card-line" />
            </article>
          ))}
        </div>
      </section>

      {/* SEARCH HELP */}
      <section className="about-section search-help-section" id="search-help">
        <div className="section-heading">
          <span className="section-number">03</span>

          <div>
            <span className="section-kicker">SEARCH GUIDE</span>
            <h2>دليل البحث</h2>
          </div>
        </div>

        <p className="section-intro">
          اكتب كلمة أو عبارة، ثم اختر نطاق البحث وطريقته. اضغط زر البحث أو
          Enter لعرض النتائج، ويمكن ترك النطاق على «الكل» للبحث في الموضوعات
          والإجراءات معاً.
        </p>

        <div className="search-guide-grid">
          <article className="search-guide-card">
            <h3>نطاق البحث</h3>
            <ul>
              <li><strong>الكل:</strong> ابحث في موضوعات الملفات ووصف الإجراءات. مثال: <code>إجازة</code></li>
              <li><strong>الموضوع:</strong> ابحث في موضوع الملف فقط. مثال: <code>طلب إجازة اعتيادية</code></li>
              <li><strong>الإجراءات:</strong> ابحث في وصف الإجراء فقط. مثال: <code>الموافقة على طلب الإجازة</code></li>
            </ul>
          </article>

          <article className="search-guide-card">
            <h3>طريقة البحث</h3>
            <ul>
              <li><strong>عبارة:</strong> يبحث عن النص كعبارة متصلة، ويمكن أن تكون جزءاً من النص. مثال: <code>طلب إجازة</code></li>
              <li><strong>كلمات:</strong> يشترط وجود كل كلمة، ولو لم تكن متجاورة أو بنفس الترتيب. مثال: <code>إجازة طلب</code></li>
            </ul>
          </article>

          <article className="search-guide-card search-guide-example">
            <h3>أمثلة عملية</h3>
            <ul>
              <li><strong>الكل + عبارة:</strong> <code>تحديث بيانات الموظفين</code></li>
              <li><strong>الكل + كلمات:</strong> <code>الموظفين تحديث</code></li>
              <li><strong>الموضوع + عبارة:</strong> <code>طلب إجازة اعتيادية</code></li>
              <li><strong>الموضوع + كلمات:</strong> <code>إجازة طلب</code></li>
              <li><strong>الإجراءات + عبارة:</strong> <code>الموافقة على طلب الإجازة</code></li>
              <li><strong>الإجراءات + كلمات:</strong> <code>الإجازة الموافقة</code></li>
            </ul>
          </article>

          <article className="search-guide-card">
            <h3>نصائح</h3>
            <ul>
              <li>تُزال المسافات الزائدة من بداية البحث ونهايته.</li>
              <li>إذا لم تظهر نتائج، جرّب «الكل» أو استخدم كلمات أقل.</li>
              <li>تظهر النتائج مع رقم الملف ونوع المطابقة والنص المطابق.</li>
            </ul>
          </article>
        </div>

        <Link className="search-guide-back-link" to={RoutePaths.HOME}>
          العودة إلى البحث
        </Link>
      </section>

      {/* STAKEHOLDERS */}
      <section className="about-section stakeholders-section" id="stakeholders">
        <div className="section-heading">
          <span className="section-number">04</span>

          <div>
            <span className="section-kicker">THE STAKEHOLDERS</span>
            <h2>أصحاب المصلحة</h2>
          </div>
        </div>

        <p className="section-intro">
          الجهات والأطراف المرتبطة بتشغيل النظام والاستفادة من مخرجاته.
        </p>

        <div className="stakeholders-layout">
          <div className="stakeholder-core">
            <div className="core-ring ring-one" />
            <div className="core-ring ring-two" />

            <div className="core-content">
              <span>مَسار</span>
              <small>SYSTEM</small>
            </div>
          </div>

          <div className="stakeholders-list">
            {stakeholders.map((stakeholder, index) => (
              <article className="stakeholder-item" key={stakeholder.title}>
                <div className="stakeholder-number">
                  0{index + 1}
                </div>

                <div className="stakeholder-icon">
                  {stakeholder.icon}
                </div>

                <div className="stakeholder-info">
                  <h3>{stakeholder.title}</h3>
                  <span className="stakeholder-position">{stakeholder.position}</span>
                  <p>{stakeholder.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="about-section technology-section" id="technology">
        <div className="section-heading">
          <span className="section-number">05</span>

          <div>
            <span className="section-kicker">TECHNOLOGY</span>
            <h2>التقنيات المستخدمة</h2>
          </div>
        </div>

        <div className="technology-grid">
          {technologyGroups.map((group) => (
            <article className="technology-card" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* DEVELOPERS */}
      <section className="about-section developers-section" id="developers">
        <div className="section-heading">
          <span className="section-number">06</span>

          <div>
            <span className="section-kicker">THE PEOPLE</span>
            <h2>فريق التطوير</h2>
          </div>
        </div>

        <div className="developers-list">
          {developers.map((developer, index) => (
            <div className="developer-name-card" key={`${developer}-${index}`}>
              {developer}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <section className="about-footer">
        <div className="footer-line" />

        <h2>مَسار</h2>

        <p>نظام متابعة الملفات والمراسلات</p>

        <div className="footer-meta">
          <span>DESIGNED & DEVELOPED</span>
          <span>•</span>
          <span>2026</span>
        </div>
      </section>
    </div>
  );
}