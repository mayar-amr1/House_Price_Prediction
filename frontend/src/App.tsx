import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true" />
            Estimate
          </Link>
          <span className="site-header__tag">House price valuation, India</span>
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>Built for a student ML project — not financial advice.</span>
          <span className="eyebrow">Model v1 · Random Forest</span>
        </div>
      </footer>
    </>
  );
}
