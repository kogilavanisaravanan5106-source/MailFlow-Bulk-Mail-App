
import axios from "axios";
import { useState } from "react";
import {
  LayoutDashboard,
  Mail,
  History,
  Settings,
  Users,
  Send,
  Plus,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import "./Dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const recipientList = recipients
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const invalidEmails = recipientList.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (recipientList.length === 0) {
      setMessage("Please enter at least one recipient.");
      setMessageType("error");
      return;
    }

    if (invalidEmails.length > 0) {
      setMessage("Please check these email addresses: " + invalidEmails.join(", "));
      setMessageType("error");
      return;
    }

    setSending(true);

    try {
      const response = await axios.post(`${API_URL}/api/campaigns/send`, {
        recipients: recipientList,
        subject,
        body,
      });

      setMessage(response.data.message || "Campaign request completed.");
      setMessageType("success");
      setRecipients("");
      setSubject("");
      setBody("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to send the campaign. Check that the backend is running."
      );
      setMessageType("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Mail size={23} /></div>
          <span>MailFlow</span>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav className="nav-menu">
          <a className="nav-item active" href="#dashboard">
            <LayoutDashboard size={19} /> Dashboard
          </a>
          <a className="nav-item" href="#compose">
            <Mail size={19} /> Compose Mail
          </a>
          <a className="nav-item" href="/history">
            <History size={19} /> Email History
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-item" href="#contacts">
            <Users size={19} /> Contacts
          </a>
          <a className="nav-item" href="#settings">
            <Settings size={19} /> Settings
          </a>

          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Admin User</strong>
              <small>Workspace Admin</small>
            </div>
            <ChevronDown size={17} />
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Dashboard</div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Search">
              <Search size={19} />
            </button>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="top-avatar">A</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">EMAIL WORKSPACE</p>
              <h1>Good to see you, Admin! 👋</h1>
              <p className="subtitle">
                Create and manage your email campaigns in one place.
              </p>
            </div>
            <div className="date-pill">
              <Sparkles size={16} /> Your communication hub
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple"><Send size={20} /></div>
              <p>Total Campaigns</p>
              <h2>0</h2>
              <small>Campaigns created</small>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><Mail size={20} /></div>
              <p>Emails Sent</p>
              <h2>0</h2>
              <small>Emails processed</small>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><Users size={20} /></div>
              <p>Total Recipients</p>
              <h2>0</h2>
              <small>Recipients added</small>
            </div>
          </div>

          <div className="composer-card" id="compose">
            <div className="composer-heading">
              <div>
                <h2>Compose a new email</h2>
                <p>Prepare your message and reach your audience.</p>
              </div>
              <div className="draft-badge">New campaign</div>
            </div>

            <form onSubmit={handleSendCampaign}>
              <label htmlFor="recipients">Recipients</label>
              <div className="input-wrap">
                <Users size={18} />
                <input
                  id="recipients"
                  type="text"
                  placeholder="Enter emails separated by commas"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="add-button"
                  onClick={() => setRecipients((old) => old.trim())}
                  aria-label="Confirm recipients"
                >
                  <Plus size={18} />
                </button>
              </div>
              <small className="field-hint">
                Example: alex@example.com, sam@example.com
              </small>

              <label htmlFor="subject">Email subject</label>
              <input
                id="subject"
                className="text-input"
                type="text"
                placeholder="Enter an engaging subject line"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <div className="body-label">
                <label htmlFor="email-body">Message</label>
                <span>Plain text</span>
              </div>
              <textarea
                id="email-body"
                placeholder="Write your email message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={7}
                required
              />

              {message && (
                <p role="status" className={`campaign-message ${messageType}`}>
                  {message}
                </p>
              )}

              <div className="composer-footer">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={sending}
                  onClick={() => {
                    setRecipients("");
                    setSubject("");
                    setBody("");
                    setMessage("");
                  }}
                >
                  Clear form
                </button>

                <button
                  type="submit"
                  className="send-button"
                  disabled={sending}
                >
                  {sending ? (
                    <LoaderCircle size={17} />
                  ) : (
                    <Send size={17} />
                  )}
                  {sending ? "Sending..." : "Send Campaign"}
                </button>
              </div>
            </form>
          </div>

          <div className="bottom-note">
            <Sparkles size={17} />
            <span>
              <strong>Tip:</strong> Always verify recipient addresses before
              sending a campaign.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
