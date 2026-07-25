import { Link } from "react-router-dom";
import CornerMarks from "../components/CornerMarks";

export default function NotFoundPage() {
  return (
    <div className="empty-state">
      <CornerMarks />
      <span className="eyebrow">Survey error · 404</span>
      <h2>This parcel doesn't exist</h2>
      <p>The page you're looking for has been rezoned or never platted.</p>
      <Link className="btn-primary" to="/">
        Back to the valuation desk
      </Link>
    </div>
  );
}
