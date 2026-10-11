
import { useEffect, useState } from "react";
import axios from "axios";
import "./CampaignHistory.css";

const API_URL = "http://localhost:5000";

function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/campaigns/history`)
      .then((response) => {
        setCampaigns(response.data.campaigns || []);
      })
      .catch(() => {
        setError("Unable to load campaign history.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalRecipients = campaigns.reduce(
    (total, campaign) => total + (campaign.recipientCount || 0),
    0
  );

  const sentCampaigns = campaigns.filter(
    (campaign) => campaign.status === "Sent"
  ).length;

  return (
    <div className="history-page">
      <header className="history-header">
        <div>
          <span className="history-eyebrow">MAILFLOW DASHBOARD</span>
          <h1>Campaign History</h1>
          <p>Track and manage your previous email campaigns.</p>
        </div>

        <a className="history-back" href="/">
          ← Back to Dashboard
        </a>
      </header>

      {loading ? (
        <div className="history-message">Loading your campaigns...</div>
      ) : error ? (
        <div className="history-message">{error}</div>
      ) : (
        <>
          <section className="history-summary">
            <div className="history-stat">
              <div className="history-stat-label">Total Campaigns</div>
              <div className="history-stat-value">{campaigns.length}</div>
              <div className="history-stat-note">
                All recorded campaigns
              </div>
            </div>

            <div className="history-stat">
              <div className="history-stat-label">Recipients</div>
              <div className="history-stat-value">{totalRecipients}</div>
              <div className="history-stat-note">
                Total recipient entries
              </div>
            </div>

            <div className="history-stat">
              <div className="history-stat-label">Sent Campaigns</div>
              <div className="history-stat-value">{sentCampaigns}</div>
              <div className="history-stat-note">
                Recorded with Sent status
              </div>
            </div>
          </section>

          <section className="history-table-card">
            <div className="history-table-heading">
              <h2>Recent Campaigns</h2>
              <span className="history-count">
                {campaigns.length} campaigns
              </span>
            </div>

            {campaigns.length === 0 ? (
              <div className="history-empty">
                <h3>No campaigns yet</h3>
                <p>Your sent campaigns will appear here.</p>
                <a className="history-back" href="/">
                  Create a Campaign
                </a>
              </div>
            ) : (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Campaign Subject</th>
                      <th>Recipients</th>
                      <th>Status</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign._id}>
                        <td className="history-subject">
                          {campaign.subject}
                        </td>

                        <td>{campaign.recipientCount}</td>

                        <td>
                          <span className="history-status">
                            {campaign.status}
                          </span>
                        </td>

                        <td>
                          {new Date(
                            campaign.createdAt
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default CampaignHistory;
