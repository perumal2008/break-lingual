import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  // Simulated data from backend (/progress and /recommendations APIs)
  const learningStats = {
    hoursSpent: 12.5,
    quizzesTaken: 8,
    materialsRead: 5,
    averageScore: 78
  };

  const adaptiveAnalysis = {
    strengths: [
      { topic: "Cellular Energy", proficiency: 92 },
      { topic: "Basic Spanish Greetings", proficiency: 95 }
    ],
    weaknesses: [
      { topic: "Protein Synthesis", proficiency: 45 },
      { topic: "Spanish Past Tense", proficiency: 55 }
    ]
  };

  const recentActivity = [
    { id: 1, action: "Completed Quiz", subject: "Cell Biology", date: "Today" },
    { id: 2, action: "Read Document", subject: "El Principito", date: "Yesterday" },
    { id: 3, action: "Generated Video", subject: "Mitochondria Explained", date: "3 days ago" }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome back, Student! 👋</h2>
        <p>Here is your personalized learning progress and AI analysis.</p>
      </div>

      {/* High-Level Stats */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>{learningStats.hoursSpent}h</h3>
            <p>Time Learned</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{learningStats.quizzesTaken}</h3>
            <p>Quizzes Completed</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{learningStats.materialsRead}</h3>
            <p>Documents Read</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h3>{learningStats.averageScore}%</h3>
            <p>Average Score</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Adaptive Learning Section */}
        <div className="adaptive-section card">
          <div className="section-title">
            <h3>🧠 AI Performance Analysis</h3>
            <span className="badge ai-badge">Adaptive Learning Active</span>
          </div>
          
          <div className="analysis-grid">
            <div className="analysis-col">
              <h4 className="text-success">Strong Concepts</h4>
              <p className="text-muted">You have mastered these topics.</p>
              <div className="skill-list">
                {adaptiveAnalysis.strengths.map((item, idx) => (
                  <div key={idx} className="skill-item">
                    <div className="skill-header">
                      <span>{item.topic}</span>
                      <span>{item.proficiency}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill success" style={{ width: `${item.proficiency}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analysis-col">
              <h4 className="text-warning">Concepts to Review</h4>
              <p className="text-muted">AI recommends focusing on these areas.</p>
              <div className="skill-list">
                {adaptiveAnalysis.weaknesses.map((item, idx) => (
                  <div key={idx} className="skill-item">
                    <div className="skill-header">
                      <span>{item.topic}</span>
                      <span>{item.proficiency}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill warning" style={{ width: `${item.proficiency}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Personalized Recommendations */}
          <div className="recommendations-box">
            <h4>💡 Personalized Next Steps</h4>
            <div className="rec-actions">
              <Link to="/video" className="btn btn-outline">
                Generate Video on "Protein Synthesis"
              </Link>
              <Link to="/tutor" className="btn btn-outline">
                Practice "Spanish Past Tense" with AI Tutor
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="recent-activity card">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {recentActivity.map(activity => (
              <li key={activity.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-subject">{activity.subject}</p>
                </div>
                <span className="activity-date">{activity.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;