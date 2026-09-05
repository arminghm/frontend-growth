const $ = (selector) => document.querySelector(selector);

function levelValue(domain) {
  if (typeof domain.level === 'number') return domain.level;
  if (Array.isArray(domain.levelRange)) {
    return (domain.levelRange[0] + domain.levelRange[1]) / 2;
  }
  return 0;
}

function levelLabel(domain) {
  if (typeof domain.level === 'number') return String(domain.level);
  if (Array.isArray(domain.levelRange)) return domain.levelRange.join('–');
  return '—';
}

function renderDomains(domains) {
  $('#domains').innerHTML = domains.map((domain) => {
    const value = levelValue(domain);
    return `
      <article class="domain-card">
        <div class="domain-top">
          <div class="domain-name">${domain.name}</div>
          <div class="score">${levelLabel(domain)}</div>
        </div>
        <div class="bar" aria-label="${domain.name} proficiency ${levelLabel(domain)} out of 5">
          <span style="width:${Math.max(0, Math.min(100, value / 5 * 100))}%"></span>
        </div>
        <p class="assessment">${domain.assessment}</p>
      </article>
    `;
  }).join('');
}

function renderSkillGroups(groups) {
  $('#skillGroups').innerHTML = groups.map((group) => `
    <article class="skill-group">
      <h3>${group.name}</h3>
      <div class="chips">
        ${group.subskills.map((skill) => `
          <span class="chip ${skill.status}">
            <i class="dot"></i>${skill.name}
          </span>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function renderRoadmap(roadmap) {
  $('#roadmap').innerHTML = roadmap.map((item) => `
    <article class="roadmap-item">
      <p class="item-title">${item.title}</p>
      <span class="badge ${item.status}">${item.status}</span>
    </article>
  `).join('');
}

function renderMilestones(milestones) {
  $('#milestones').innerHTML = milestones.map((item) => `
    <article class="milestone-item">
      <div>
        <p class="item-title">${item.title}</p>
        ${item.date ? `<div class="item-meta">${item.date}</div>` : ''}
      </div>
      <span class="badge ${item.status}">${item.status}</span>
    </article>
  `).join('');
}

function renderTimeline(timeline) {
  $('#timeline').innerHTML = [...timeline].reverse().map((item) => `
    <article class="timeline-entry">
      <div class="timeline-date">${item.date} · ${item.type}</div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
    </article>
  `).join('');
}

function render(data) {
  $('#updatedAt').textContent = `Updated ${data.updatedAt}`;
  $('#focusTitle').textContent = data.currentFocus.title;
  $('#focusObjective').textContent = data.currentFocus.objective;
  $('#nextAction').textContent = data.currentFocus.nextAction;
  $('#priorities').innerHTML = data.currentFocus.priorities.map((item) => `<li>${item}</li>`).join('');
  renderDomains(data.domains);
  renderSkillGroups(data.skillGroups);
  renderRoadmap(data.roadmap);
  renderMilestones(data.milestones);
  renderTimeline(data.timeline);
}

async function init() {
  try {
    const response = await fetch('./progress/progress.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    render(data);
  } catch (error) {
    document.querySelector('main').innerHTML = `
      <div class="error">
        <h1>Dashboard data unavailable</h1>
        <p>Could not load <code>progress/progress.json</code>.</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}

init();
