import { XCircle, CheckCircle } from "lucide-react";

interface NotificationProps {
    type: "success" | "error"; // Only two possible values for type
    message: string; // Message is a string
}

export default function Notification({ type, message }: NotificationProps) {
    return (
        <div
            role="alert"
            className={`rounded-xl border border-gray-100 p-4 ${type === "success" ? "bg-green-400" : "bg-red-400"}`}
        >
            <div className="flex items-start gap-4">
                <span className="text-white">
                    {type === "success" ? <CheckCircle /> : <XCircle />}
                </span>

                <div className="flex-1">
                    <strong className="block font-bold text-white">
                        {type === "success" ? "Success" : "Delivery Issue"}
                    </strong>

                    <p className="mt-1 text-sm text-white">{message}</p>
                </div>
            </div>
        </div>
    );
}
