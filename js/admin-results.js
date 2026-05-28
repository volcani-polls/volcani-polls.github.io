import { db } from "./firebase-init.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, calculateResults, escapeHtml, getQueryParam, orderedEntries, requireAdmin, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

await requireAdmin();
wireLogoutButtons();

const lectureId = getQueryParam("id");
const titleEl = $("#lectureTitle");
const metaEl = $("#lectureMeta");
const resultsBox = $("#resultsBox");

function fmt(num) {
  return num === null || num === undefined ? t("no_data") : Number(num).toFixed(2);
}

function createBarChart(canvasId, labels, data, title) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: 'rgba(47, 125, 50, 0.7)',
        borderColor: 'rgba(47, 125, 50, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold',
            family: 'Assistant, Inter, system-ui'
          },
          padding: 20
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            font: {
              family: 'Assistant, Inter, system-ui'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              family: 'Assistant, Inter, system-ui'
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function createDistributionChart(canvasId, questionStats) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  
  // Calculate distribution for all questions
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalVotes = 0;
  
  Object.values(questionStats).forEach(stat => {
    if (stat.distribution) {
      Object.entries(stat.distribution).forEach(([rating, count]) => {
        distribution[rating] = (distribution[rating] || 0) + count;
        totalVotes += count;
      });
    }
  });
  
  const percentages = Object.values(distribution).map(count => 
    totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0
  );
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['⭐ 1', '⭐⭐ 2', '⭐⭐⭐ 3', '⭐⭐⭐⭐ 4', '⭐⭐⭐⭐⭐ 5'],
      datasets: [{
        data: Object.values(distribution),
        backgroundColor: [
          'rgba(180, 35, 24, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(132, 204, 22, 0.8)',
          'rgba(47, 125, 50, 0.8)'
        ],
        borderColor: '#fff',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: 'Assistant, Inter, system-ui',
              size: 13
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: t('rating_distribution') || 'התפלגות דירוגים',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Assistant, Inter, system-ui'
          },
          padding: 20
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const percentage = percentages[context.dataIndex];
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

async function loadResults() {
  if (!lectureId) {
    resultsBox.innerHTML = `<div class="message error">${t("missing_poll_id")}</div>`;
    return;
  }

  resultsBox.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p class="spinner-text">${t("loading")}</p>
    </div>
  `;

  const [lectureSnap, votesSnap] = await Promise.all([
    get(ref(db, `lectures/${lectureId}`)),
    get(ref(db, `votes/${lectureId}`)).catch(() => null)
  ]);

  if (!lectureSnap.exists()) {
    resultsBox.innerHTML = `<div class="message error">${t("poll_not_found")}</div>`;
    return;
  }

  const lecture = lectureSnap.val();
  const votes = votesSnap?.val() || {};
  const stats = calculateResults(lecture, votes);

  titleEl.textContent = lecture.title;
  metaEl.textContent = `${t("lecturer")} ${lecture.author} | ${t("voters_count")}: ${stats.votersCount}`;

  const rows = orderedEntries(stats.questionStats).map(([qid, stat], idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${escapeHtml(stat.text)}</td>
      <td>${stat.count}</td>
      <td><strong style="color: var(--primary);">${fmt(stat.average)}</strong></td>
    </tr>
  `).join("");

  const questionLabels = orderedEntries(stats.questionStats).map(([, stat], idx) => `שאלה ${idx + 1}`);
  const questionAverages = orderedEntries(stats.questionStats).map(([, stat]) => stat.average || 0);

  resultsBox.innerHTML = `
    <div class="result-summary">
      <div class="summary-card">
        <span><i class="fa-solid fa-users"></i> ${t("voters_count")}</span>
        <strong>${stats.votersCount}</strong>
      </div>
      <div class="summary-card">
        <span><i class="fa-solid fa-chart-simple"></i> ${t("total_answers")}</span>
        <strong>${stats.totalAnswers}</strong>
      </div>
      <div class="summary-card">
        <span><i class="fa-solid fa-star"></i> ${t("final_average")}</span>
        <strong style="color: var(--primary);">${fmt(stats.finalAverage)}</strong>
      </div>
    </div>
    
    <div class="panel">
      <h2><i class="fa-solid fa-table"></i> ${t("detailed_results") || "תוצאות מפורטות"}</h2>
      <div class="table-wrap">
        <table class="results-table">
          <thead>
            <tr><th>#</th><th>${t("question_column")}</th><th>${t("voters_column")}</th><th>${t("average_column")}</th></tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="4">${t("no_data_to_display")}</td></tr>`}</tbody>
        </table>
      </div>
    </div>
    
    <div class="charts-grid">
      <div class="chart-container panel">
        <canvas id="averagesChart"></canvas>
      </div>
      <div class="chart-container panel">
        <canvas id="distributionChart"></canvas>
      </div>
    </div>
  `;

  // Create charts after DOM is ready
  setTimeout(() => {
    createBarChart('averagesChart', questionLabels, questionAverages, t('average_by_question') || 'ממוצע לפי שאלה');
    createDistributionChart('distributionChart', stats.questionStats);
  }, 100);
}

loadResults().catch((err) => {
  console.error(err);
  resultsBox.innerHTML = `<div class="message error">${t("lectures_load_error")}</div>`;
});
