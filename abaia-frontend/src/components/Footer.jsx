import { Crown } from "lucide-react";
import { useLang } from "../context/LangContext";

const Footer = () => {
  const { t, lang } = useLang();
  return (
    <footer className="bg-base-100 border-t border-base-200 px-4 sm:px-6 lg:px-8 py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-base-content/50">
        <p>© {new Date().getFullYear()} {t("brand")}. {t("allRightsReserved")}</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">{t("privacyPolicy")}</a>
          <a href="#" className="hover:text-primary transition-colors">{t("termsConditions")}</a>
          <span className="text-base-content/20">|</span>
          <Crown size={14} className="text-warning" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
