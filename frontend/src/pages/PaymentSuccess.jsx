import { CheckCircle, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const jobId = searchParams.get("jobId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full bg-card border rounded-3xl p-8 text-center shadow-xl">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />

        <h1 className="text-4xl font-bold mb-3">
          Payment Successful 🎉
        </h1>

        <p className="text-muted-foreground mb-6">
          Your payment has been completed successfully and the project has been
          marked as completed.
        </p>

        {sessionId && (
          <div className="bg-muted rounded-xl p-3 mb-6 text-xs break-all text-left">
            <span className="font-semibold">Session ID:</span>
            <br />
            {sessionId}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {jobId && (
            <Link
              to={`/client-dashboard/job/${jobId}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              View Project
              <ArrowRight size={18} />
            </Link>
          )}

          <Link
            to="/client-dashboard"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;