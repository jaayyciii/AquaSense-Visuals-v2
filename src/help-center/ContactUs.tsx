import { useState } from "react";
import { useAuth } from "../AuthContext";

type ContactUsProps = {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

type MessageType = {
  email: string;
  subject: string;
  message: string;
};

export default function ContactUs({ setPrompt }: ContactUsProps) {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState<MessageType>({
    email: currentUser?.email || "",
    subject: "",
    message: "",
  });

  function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPrompt("Your message has been successfully sent!");
    setMessage({
      ...message,
      subject: "",
      message: "",
    });
  }

  return (
    <div className="w-100">
      <h4 className="text-primary-emphasis mb-2" id="cu">
        <i className="bi bi-envelope me-2" style={{ fontSize: "24px" }} />
        Contact Us
      </h4>
      <p className="fw-light my-3" style={{ fontSize: "16px" }}>
        Have inquiries about AquaSense Visuals? Send us a message!
      </p>
      <div className="d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "800px" }}>
          <form onSubmit={(e) => handleSendMessage(e)}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="float1"
                value={message.subject}
                placeholder="Enter your email subject"
                onChange={(e) =>
                  setMessage({
                    ...message,
                    subject: e.target.value,
                  })
                }
                required
              />
              <label className="text-muted" htmlFor="float1">
                Subject
              </label>
            </div>
            <div className="form-floating">
              <textarea
                className="form-control"
                id="float2"
                placeholder="Enter your feedback, inquiries, and concerns"
                style={{ height: "275px" }}
                onChange={(e) =>
                  setMessage({
                    ...message,
                    message: e.target.value,
                  })
                }
                required
              />
              <label className="text-muted" htmlFor="float2">
                Message Body
              </label>
            </div>
            <div className="d-flex justify-content-end my-3">
              <button className="btn btn-primary w-25" type="submit">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
