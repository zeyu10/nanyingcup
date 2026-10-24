define(function (require, exports, module) {
  'use strict';

  var STORAGE_DATA = 'nanying.tournamentData.v1';
  var STORAGE_MATCH = 'nanying.currentMatch.v1';
  var LOGO_DIR = 'assets/logo/';
  var PLACEHOLDER_LOGO = 'assets/images/team-placeholder.svg';

  var KNOWN_LOGOS = [
    '上海交通大学.webp',
    '上海健康医学院.webp',
    '中国人民大学.webp',
    '中国海洋大学.webp',
    '中山大学.webp',
    '北京工业大学.webp',
    '北京林业大学.webp',
    '华东师范大学.webp',
    '厦门大学.webp',
    '厦门大学马来西亚分校.webp',
    '四川大学.webp',
    '武汉大学.webp',
    '浙江大学.webp',
    '浙江理工大学.webp',
    '湖南大学.jpg',
    '重庆大学.webp',
    '博特拉大学.png',
    '悉尼大学.png',
    '新南威尔士大学.webp',
    '新加坡国立大学.png',
    '马来亚大学.png',
    '杜伦大学.png',
    '台北科技大学.png',
    '墨尔本大学.png',
    '伦敦政治经济学院.png',
    '双溪威拉曼大学.png',
    '复旦大学.webp'
  ];

  var sourceData = normalizeData(window.TOURNAMENT_DATA);
  var sourceFingerprint = fingerprint(sourceData);
  var data = loadData();
  var currentMatchId = '';
  var toastTimer = null;
  var els = {};

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function fingerprint(value) {
    var source = JSON.stringify(value);
    var hash = 5381;
    for (var i = 0; i < source.length; i += 1) {
      hash = ((hash << 5) + hash) + source.charCodeAt(i);
    }
    return String(hash >>> 0) + ':' + source.length;
  }

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  function text(value) {
    return value === null || value === undefined ? '' : String(value);
  }

  function trim(value) {
    return text(value).trim();
  }

  function escapeHtml(value) {
    return text(value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function each(list, fn) {
    Array.prototype.forEach.call(list || [], fn);
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return (root || document).querySelectorAll(selector);
  }

  function createEl(tag, className, content) {
    var el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (content !== undefined) {
      el.textContent = content;
    }
    return el;
  }

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      // 本地文件模式下部分浏览器会禁用 localStorage，不影响页面本次使用。
    }
  }

  function safeRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      // ignore
    }
  }

  function normalizeData(raw) {
    raw = raw && typeof raw === 'object' ? raw : {};

    var event = raw.event && typeof raw.event === 'object' ? raw.event : {};
    var teams = [];
    each(raw.teams, function (team, index) {
      if (!team || typeof team !== 'object') {
        return;
      }
      teams.push({
        code: trim(team.code) || ('T' + (index + 1)),
        school: trim(team.school) || '待定',
        logo: trim(team.logo),
        logos: normalizeLogoList(team.logos)
      });
    });

    var groups = [];
    each(raw.groups, function (group, groupIndex) {
      if (!group || typeof group !== 'object') {
        return;
      }

      var groupId = trim(group.id) || String.fromCharCode(65 + groupIndex);
      var teamCodes = [];
      each(group.teamCodes, function (code) {
        if (trim(code)) {
          teamCodes.push(trim(code));
        }
      });

      var matches = [];
      each(group.matches, function (match, matchIndex) {
        if (!match || typeof match !== 'object') {
          return;
        }
        matches.push({
          id: trim(match.id) || (groupId + '-' + (matchIndex + 1)),
          round: Number(match.round) || (matchIndex + 1),
          home: trim(match.home) || teamCodes[0] || '',
          away: trim(match.away) || teamCodes[1] || '',
          date: trim(match.date),
          time: trim(match.time)
        });
      });

      if (!matches.length && teamCodes.length >= 3) {
        matches = [
          { id: groupId + '-1', round: 1, home: teamCodes[0], away: teamCodes[1], date: '', time: '' },
          { id: groupId + '-2', round: 2, home: teamCodes[1], away: teamCodes[2], date: '', time: '' },
          { id: groupId + '-3', round: 3, home: teamCodes[2], away: teamCodes[0], date: '', time: '' }
        ];
      }

      groups.push({
        id: groupId,
        name: trim(group.name) || (groupId + '组'),
        topic: trim(group.topic) || '待定辩题',
        proTopic: trim(group.proTopic),
        conTopic: trim(group.conTopic),
        teamCodes: teamCodes,
        matches: matches
      });
    });

    var extraMatches = [];
    each(raw.extraMatches, function (match, matchIndex) {
      if (!match || typeof match !== 'object') {
        return;
      }
      extraMatches.push({
        id: trim(match.id) || ('KO-' + (matchIndex + 1)),
        stage: trim(match.stage) || '额外场次',
        round: Number(match.round) || (matchIndex + 1),
        home: normalizeExtraTeam(match.home),
        away: normalizeExtraTeam(match.away),
        date: trim(match.date),
        time: trim(match.time),
        topic: trim(match.topic) || '待定辩题',
        proTopic: trim(match.proTopic),
        conTopic: trim(match.conTopic)
      });
    });

    return {
      event: {
        name: trim(event.name) || '南萤杯国际华语辩论赛',
        stage: trim(event.stage) || '小组赛',
        sponsor: trim(event.sponsor) || 'Yellow Duck Capital Sdn. Bhd'
      },
      teams: teams,
      groups: groups,
      extraMatches: extraMatches
    };
  }

  function normalizeLogoList(logos) {
    var list = [];
    each(logos, function (name) {
      list.push(trim(name));
    });
    return list.length > 2 ? list.slice(0, 2) : list;
  }

  function normalizeExtraTeam(team) {
    if (team && typeof team === 'object') {
      return {
        code: trim(team.code),
        school: trim(team.school) || '待定',
        logo: trim(team.logo),
        logos: normalizeLogoList(team.logos)
      };
    }
    return {
      code: '',
      school: trim(team) || '待定',
      logo: '',
      logos: []
    };
  }

  function loadData() {
    var stored = safeGet(STORAGE_DATA);
    if (stored) {
      try {
        var parsed = JSON.parse(stored);
        if (
          parsed &&
          parsed.version === 1 &&
          parsed.fingerprint === sourceFingerprint &&
          parsed.data &&
          isArray(parsed.data.groups)
        ) {
          return normalizeData(parsed.data);
        }
      } catch (err) {
        // 存储内容损坏时回退到文件数据。
      }
    }
    return clone(sourceData);
  }

  function saveData() {
    safeSet(STORAGE_DATA, JSON.stringify({
      version: 1,
      fingerprint: sourceFingerprint,
      data: data
    }));
  }

  function buildTeamMap() {
    var map = {};
    each(data.teams, function (team) {
      map[team.code] = team;
    });
    return map;
  }

  function findTeam(code) {
    var result = null;
    each(data.teams, function (team) {
      if (team.code === code) {
        result = team;
      }
    });
    return result;
  }

  function findGroup(id) {
    var result = null;
    each(data.groups, function (group) {
      if (group.id === id) {
        result = group;
      }
    });
    return result;
  }

  function teamFor(code, map) {
    return (map || buildTeamMap())[code] || { code: code, school: '待定', logo: '' };
  }

  function findMatch(id) {
    var result = null;
    each(data.groups, function (group) {
      each(group.matches, function (match) {
        if (match.id === id) {
          result = { group: group, match: match, isExtra: false };
        }
      });
    });
    each(data.extraMatches, function (match) {
      if (match.id === id) {
        result = { group: { name: match.stage }, match: match, isExtra: true };
      }
    });
    return result;
  }

  function firstMatchId() {
    var id = '';
    each(data.groups, function (group) {
      if (!id && group.matches.length) {
        id = group.matches[0].id;
      }
    });
    if (!id && data.extraMatches.length) {
      id = data.extraMatches[0].id;
    }
    return id;
  }

  function teamsOfMatch(found) {
    if (found.isExtra) {
      return {
        home: normalizeExtraTeam(found.match.home),
        away: normalizeExtraTeam(found.match.away)
      };
    }
    var map = buildTeamMap();
    return {
      home: teamFor(found.match.home, map),
      away: teamFor(found.match.away, map)
    };
  }

  function matchLabel(found) {
    if (found.isExtra) {
      return found.match.stage + ' · 第' + found.match.round + '场';
    }
    return found.group.name + ' · 第' + found.match.round + '轮';
  }

  function matchRoundLabel(found) {
    return found.isExtra ? ('第' + found.match.round + '场') : ('第' + found.match.round + '轮');
  }

  function matchDateTime(match) {
    var date = trim(match.date);
    var time = trim(match.time);
    if (date && time) {
      return date + ' ' + time;
    }
    return date || time;
  }

  function ensureCurrentMatch() {
    if (!findMatch(currentMatchId)) {
      currentMatchId = firstMatchId();
    }
  }

  function logoFileUrl(filename) {
    var logo = trim(filename);
    if (!logo) {
      return PLACEHOLDER_LOGO;
    }
    if (/^(https?:|data:|\/)/i.test(logo)) {
      return logo;
    }
    if (logo.indexOf('assets/') === 0) {
      return logo;
    }
    return LOGO_DIR + encodeURI(logo);
  }

  function setLogoPreview(preview, filename) {
    preview.onerror = function () {
      if (preview.src.indexOf('team-placeholder.svg') === -1) {
        preview.src = PLACEHOLDER_LOGO;
      }
    };
    preview.src = logoFileUrl(filename);
  }

  function bindLogoPreview(input, preview) {
    function update() {
      setLogoPreview(preview, input.value);
    }
    input.addEventListener('input', update);
    input.addEventListener('change', update);
    update();
  }

  function createLogoPreview() {
    var preview = createEl('img', 'logo-preview');
    preview.alt = '';
    return preview;
  }

  function teamLogos(team) {
    if (isArray(team.logos) && team.logos.length >= 2) {
      return normalizeLogoList(team.logos);
    }
    var logo = trim(team.logo);
    return logo ? [logo] : [];
  }

  function ensureTeamLogos() {
    each(qsa('.bianfang_image'), function (img) {
      if (img.classList.contains('bianfang_image--secondary')) {
        return;
      }
      if (img.nextElementSibling && img.nextElementSibling.classList.contains('bianfang_image--secondary')) {
        return;
      }
      var secondary = img.cloneNode(false);
      secondary.classList.add('bianfang_image--secondary');
      secondary.removeAttribute('id');
      secondary.alt = '';
      secondary.style.display = 'none';
      img.parentNode.insertBefore(secondary, img.nextSibling);
    });
  }

  function setImages(selector, team) {
    var logos = teamLogos(team);

    each(qsa(selector), function (img) {
      if (img.classList.contains('bianfang_image--secondary')) {
        return;
      }

      var secondary = img.nextElementSibling;
      if (!secondary || !secondary.classList.contains('bianfang_image--secondary')) {
        secondary = null;
      }

      var clearfix = img.parentNode;
      img.alt = team.school;
      img.onerror = function () {
        img.onerror = null;
        img.src = PLACEHOLDER_LOGO;
      };

      if (logos.length >= 2) {
        img.src = logoFileUrl(logos[0]);
        img.style.display = '';
        if (secondary) {
          secondary.src = logoFileUrl(logos[1]);
          secondary.onerror = function () {
            secondary.onerror = null;
            secondary.src = PLACEHOLDER_LOGO;
          };
          secondary.style.display = '';
        }
        if (clearfix && clearfix.classList) {
          clearfix.classList.add('has-double-logo');
        }
      } else {
        img.src = logoFileUrl(logos[0] || '');
        img.style.display = '';
        if (secondary) {
          secondary.style.display = 'none';
        }
        if (clearfix && clearfix.classList) {
          clearfix.classList.remove('has-double-logo');
        }
      }
    });
  }

  function splitTopic(topic) {
    var parts = text(topic).split(/\s*\/\s*/);
    if (parts.length >= 2) {
      return {
        pro: parts[0],
        con: parts.slice(1).join(' / ')
      };
    }
    return { pro: text(topic), con: text(topic) };
  }

  function formatBigTopic(topic) {
    return text(topic).replace(/\s*\/\s*/g, ' / ').trim();
  }

  function topicInfo(found) {
    var source = found.isExtra ? found.match : found.group;
    var topic = trim(source.topic);
    var pro = trim(source.proTopic);
    var con = trim(source.conTopic);
    var parts = splitTopic(topic);

    if (!topic) {
      topic = parts.pro + (parts.con ? ' / ' + parts.con : '');
    }
    if (!pro) {
      pro = parts.pro;
    }
    if (!con) {
      con = parts.con;
    }

    return { topic: topic, pro: pro, con: con };
  }

  function schoolNameText(school) {
    var value = text(school);
    var parts = value.split(/\s*&\s*/);
    if (parts.length >= 2) {
      return parts[0] + ' &\n' + parts.slice(1).join(' & ');
    }
    return value;
  }

  function eventTitleText() {
    var name = trim(data.event.name);
    var sponsor = trim(data.event.sponsor);
    if (!sponsor || name.indexOf(sponsor) !== -1) {
      return name;
    }
    var match = name.match(/^(\d{4})\s+(.+)$/);
    if (match) {
      return match[1] + ' ' + sponsor + ' ' + match[2];
    }
    return sponsor + ' ' + name;
  }

  function wrapSideHeading(heading, side) {
    if (!heading || !heading.parentNode) {
      return;
    }
    if (heading.parentNode.classList.contains('team-side')) {
      return;
    }

    var wrapper = createEl('div', 'team-side team-side--' + side);
    heading.parentNode.insertBefore(wrapper, heading);
    heading.classList.remove('pull-right');
    heading.classList.remove('pull-left');
    wrapper.appendChild(heading);
  }

  function appendSideTopic(heading, side) {
    var host = heading.parentNode;
    while (host && host.classList && !host.classList.contains('col-lg-5') && !host.classList.contains('col-lg-12')) {
      host = host.parentNode;
    }
    if (!host || !host.classList || qs('.side-topic--' + side, host)) {
      return;
    }
    host.appendChild(createEl('p', 'side-topic side-topic--' + side));
  }

  function ensureTeamSideWrappers() {
    each(qsa('.pull-right.bian_name_left_head, .pull-right.bian_name_left'), function (heading) {
      wrapSideHeading(heading, 'left');
      appendSideTopic(heading, 'left');
    });

    each(qsa('.pull-left.bian_name_right_head, .pull-left.bian_name_right'), function (heading) {
      wrapSideHeading(heading, 'right');
      appendSideTopic(heading, 'right');
    });
  }

  function ensurePageMatchInfo() {
    each(qsa('.main > .container-fluid'), function (section) {
      if (qs('#eventName', section) || qs('#judgeEventName', section) || qs('.page-match-info', section)) {
        return;
      }

      var wrapper = createEl('div', 'row text-center page-match-info');
      var title = createEl('h1', 'event-title page-event-title');
      title.appendChild(document.createTextNode('········· '));
      title.appendChild(createEl('strong', 'page-event-name'));
      title.appendChild(document.createTextNode(' ·········'));
      wrapper.appendChild(title);
      wrapper.appendChild(createEl('h2', 'current-match-label page-match-label'));
      wrapper.appendChild(createEl('p', 'current-match-topic page-match-topic'));
      section.insertBefore(wrapper, section.firstChild);
    });
  }

  function setTextAll(selector, value) {
    each(qsa(selector), function (el) {
      el.textContent = value;
    });
  }

  function formatSideTopic(value) {
    return text(value)
      .replace(/\\n/g, '\n')
      .replace(/\r\n?/g, '\n')
      .trim();
  }

  function setSideTopics(info) {
    var pro = formatSideTopic(info.pro);
    var con = formatSideTopic(info.con);

    each(qsa('.side-topic--left'), function (el) {
      el.textContent = pro;
    });
    each(qsa('.side-topic--right'), function (el) {
      el.textContent = con;
    });
  }

  function renderCurrentMatch() {
    var found = findMatch(currentMatchId);
    var eventName = qs('#eventName');
    var judgeEventName = qs('#judgeEventName');
    if (eventName) {
      eventName.textContent = eventTitleText();
    }
    if (judgeEventName) {
      judgeEventName.textContent = eventTitleText();
    }
    setTextAll('.page-event-name', eventTitleText());

    var label = qs('#currentMatchLabel');
    var topic = qs('#currentMatchTopic');
    var judgeLabel = qs('#judgeMatchLabel');
    var judgeTopic = qs('#judgeMatchTopic');

    if (!found) {
      if (label) {
        label.textContent = data.event.stage;
      }
      if (judgeLabel) {
        judgeLabel.textContent = data.event.stage;
      }
      if (topic) {
        topic.textContent = '未找到赛程数据，请检查 data.js';
      }
      if (judgeTopic) {
        judgeTopic.textContent = '未找到赛程数据，请检查 data.js';
      }
      setTextAll('.page-match-label', data.event.stage);
      setTextAll('.page-match-topic', '未找到赛程数据，请检查 data.js');
      setSideTopics({ pro: '', con: '' });
      document.title = eventTitleText();
      return;
    }

    var teams = teamsOfMatch(found);
    var home = teams.home;
    var away = teams.away;

    setImages('.pull-right.bianfang_image', home);
    setImages('.pull-left.bianfang_image', away);

    each(qsa('.bian_name_left_head, .bian_name_left'), function (el) {
      el.textContent = schoolNameText(home.school);
    });
    each(qsa('.bian_name_right_head, .bian_name_right'), function (el) {
      el.textContent = schoolNameText(away.school);
    });

    var info = topicInfo(found);
    setSideTopics(info);
    var dateTime = matchDateTime(found.match);
    var labelText = matchLabel(found) + (dateTime ? ' · ' + dateTime : '');
    var topicText = '辩题：' + formatBigTopic(info.topic);

    if (label) {
      label.textContent = labelText;
    }
    if (topic) {
      topic.textContent = topicText;
    }
    if (judgeLabel) {
      judgeLabel.textContent = labelText;
    }
    if (judgeTopic) {
      judgeTopic.textContent = topicText;
    }
    setTextAll('.page-match-label', labelText);
    setTextAll('.page-match-topic', topicText);

    document.title = home.school + ' vs ' + away.school + ' | ' + matchLabel(found) + ' · ' + eventTitleText();
  }

  function selectMatch(id, options) {
    if (!findMatch(id)) {
      return;
    }
    currentMatchId = id;
    safeSet(STORAGE_MATCH, id);
    renderCurrentMatch();
    updatePickerActive();
    if (!options || !options.keepOpen) {
      closeModal(els.pickerModal);
    }
  }

  function appendTableHeader(table, labels) {
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    each(labels, function (label) {
      var th = document.createElement('th');
      th.textContent = label;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
  }

  function buildPicker() {
    if (!els.matchGroups) {
      return;
    }

    els.matchGroups.textContent = '';

    if (!data.groups.length && !data.extraMatches.length) {
      els.matchGroups.appendChild(createEl('p', 'editor-empty', '暂无赛程数据，请检查 data.js'));
      return;
    }

    var map = buildTeamMap();

    each(data.groups, function (group) {
      var card = createEl('section', 'match-group-card');
      var header = createEl('div', 'match-group-card__header');
      var title = createEl('h3', '', group.name);
      var teams = createEl('div', 'match-group-card__teams');

      each(group.teamCodes, function (code) {
        var line = createEl('span', 'match-group-card__team-line');
        line.appendChild(createEl('span', 'match-group-card__team-code', code));
        line.appendChild(document.createTextNode(teamFor(code, map).school));
        teams.appendChild(line);
      });

      header.appendChild(title);
      header.appendChild(teams);
      card.appendChild(header);

      each(group.matches, function (match) {
        var home = teamFor(match.home, map);
        var away = teamFor(match.away, map);
        var button = createEl('button', 'match-option');
        button.type = 'button';
        button.setAttribute('data-match-id', match.id);
        if (match.id === currentMatchId) {
          button.className += ' is-active';
        }

        var round = createEl('span', 'match-option__round', '第' + match.round + '轮');
        var homeLine = createEl('span', 'match-option__team');
        homeLine.appendChild(createEl('em', '', '正方'));
        homeLine.appendChild(document.createTextNode(home.school));

        var awayLine = createEl('span', 'match-option__team');
        awayLine.appendChild(createEl('em', '', '反方'));
        awayLine.appendChild(document.createTextNode(away.school));

        button.appendChild(round);
        button.appendChild(homeLine);
        button.appendChild(awayLine);

        var dateTime = matchDateTime(match);
        if (dateTime) {
          button.appendChild(createEl('span', 'match-option__meta', dateTime));
        }

        button.addEventListener('click', function () {
          selectMatch(match.id);
        });
        card.appendChild(button);
      });

      els.matchGroups.appendChild(card);
    });

    var stages = {};
    var stageOrder = [];
    each(data.extraMatches, function (match) {
      if (!stages[match.stage]) {
        stages[match.stage] = { name: match.stage, matches: [] };
        stageOrder.push(match.stage);
      }
      stages[match.stage].matches.push(match);
    });

    each(stageOrder, function (stageName) {
      var stage = stages[stageName];
      var card = createEl('section', 'match-group-card');
      card.appendChild(createEl('h3', '', stage.name));
      card.appendChild(createEl('p', 'match-group-card__teams', '共 ' + stage.matches.length + ' 场'));

      each(stage.matches, function (match) {
        var home = normalizeExtraTeam(match.home);
        var away = normalizeExtraTeam(match.away);
        var button = createEl('button', 'match-option');
        button.type = 'button';
        button.setAttribute('data-match-id', match.id);
        if (match.id === currentMatchId) {
          button.className += ' is-active';
        }

        var round = createEl('span', 'match-option__round', '第' + match.round + '场');
        var homeLine = createEl('span', 'match-option__team');
        homeLine.appendChild(createEl('em', '', '正方'));
        homeLine.appendChild(document.createTextNode(home.school));

        var awayLine = createEl('span', 'match-option__team');
        awayLine.appendChild(createEl('em', '', '反方'));
        awayLine.appendChild(document.createTextNode(away.school));

        button.appendChild(round);
        button.appendChild(homeLine);
        button.appendChild(awayLine);

        var dateTime = matchDateTime(match);
        if (dateTime) {
          button.appendChild(createEl('span', 'match-option__meta', dateTime));
        }

        button.addEventListener('click', function () {
          selectMatch(match.id);
        });
        card.appendChild(button);
      });

      els.matchGroups.appendChild(card);
    });
  }

  function updatePickerActive() {
    each(qsa('#matchGroups .match-option'), function (button) {
      if (button.getAttribute('data-match-id') === currentMatchId) {
        button.classList.add('is-active');
      } else {
        button.classList.remove('is-active');
      }
    });
  }

  function buildLogoOptions() {
    if (!els.logoOptions) {
      return;
    }

    els.logoOptions.textContent = '';
    var seen = {};
    var logos = [];

    function addLogo(name) {
      name = trim(name);
      if (name && !seen[name]) {
        seen[name] = true;
        logos.push(name);
      }
    }

    each(KNOWN_LOGOS, addLogo);
    each(data.teams, function (team) {
      addLogo(team.logo);
      each(team.logos, addLogo);
    });
    each(data.extraMatches, function (match) {
      addLogo(match.home.logo);
      each(match.home.logos, addLogo);
      addLogo(match.away.logo);
      each(match.away.logos, addLogo);
    });

    logos.sort(function (a, b) {
      return a.localeCompare(b, 'zh-CN');
    });

    each(logos, function (name) {
      var option = document.createElement('option');
      option.value = name;
      els.logoOptions.appendChild(option);
    });
  }

  function buildSchoolDataMap() {
    var map = {};
    each(data.teams, function (team) {
      if (team.school && team.school !== '待定') {
        map[team.school] = {
          logo: team.logo,
          logos: team.logos || []
        };
      }
    });
    each(data.extraMatches, function (match) {
      var home = normalizeExtraTeam(match.home);
      var away = normalizeExtraTeam(match.away);
      if (home.school && home.school !== '待定') {
        map[home.school] = { logo: home.logo, logos: home.logos };
      }
      if (away.school && away.school !== '待定') {
        map[away.school] = { logo: away.logo, logos: away.logos };
      }
    });
    return map;
  }

  function buildSchoolOptions() {
    if (!els.schoolOptions) {
      return;
    }

    els.schoolOptions.textContent = '';
    var seen = {};
    var schools = [];

    function addSchool(name) {
      name = trim(name);
      if (name && name !== '待定' && !seen[name]) {
        seen[name] = true;
        schools.push(name);
      }
    }

    each(data.teams, function (team) {
      addSchool(team.school);
    });
    each(data.extraMatches, function (match) {
      addSchool(normalizeExtraTeam(match.home).school);
      addSchool(normalizeExtraTeam(match.away).school);
    });

    schools.sort(function (a, b) {
      return a.localeCompare(b, 'zh-CN');
    });

    each(schools, function (name) {
      var option = document.createElement('option');
      option.value = name;
      els.schoolOptions.appendChild(option);
    });
  }

  function bindSchoolAutofill(schoolInput, logoInput, logo2Input, logo2Item, combinedInput) {
    function fill(force) {
      var name = trim(schoolInput.value);
      var map = buildSchoolDataMap();
      var team = map[name];
      if (!team) {
        return;
      }
      if (!force && trim(logoInput.value)) {
        return;
      }

      var logos = isArray(team.logos) && team.logos.length >= 2
        ? normalizeLogoList(team.logos)
        : (team.logo ? [team.logo] : []);
      var combined = logos.length >= 2;

      combinedInput.checked = combined;
      logo2Input.disabled = !combined;
      if (logo2Item) {
        logo2Item.style.display = combined ? '' : 'none';
      }
      logoInput.value = logos[0] || '';
      logo2Input.value = combined ? (logos[1] || '') : '';
      logoInput.dispatchEvent(new Event('input', { bubbles: true }));
      logo2Input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    schoolInput.addEventListener('change', function () {
      fill(true);
    });
    schoolInput.addEventListener('input', function () {
      fill(false);
    });
  }

  function bindCombinedToggle(combinedInput, logo2Input, logo2Item) {
    combinedInput.addEventListener('change', function () {
      var show = combinedInput.checked;
      logo2Input.disabled = !show;
      if (logo2Item) {
        logo2Item.style.display = show ? '' : 'none';
      } else {
        logo2Input.style.display = show ? '' : 'none';
      }
      if (!show) {
        logo2Input.value = '';
        logo2Input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  function buildEditor() {
    if (!els.teamEditor || !els.topicEditor || !els.extraMatchEditor) {
      return;
    }

    els.teamEditor.textContent = '';
    els.topicEditor.textContent = '';
    els.extraMatchEditor.textContent = '';
    buildLogoOptions();
    buildSchoolOptions();

    appendTableHeader(els.teamEditor, ['编号', '学校名称', '联队', '校徽 1', '校徽 2']);
    var teamBody = document.createElement('tbody');

    if (!data.teams.length) {
      var emptyRow = document.createElement('tr');
      var emptyCell = document.createElement('td');
      emptyCell.colSpan = 5;
      emptyCell.className = 'editor-empty';
      emptyCell.textContent = '暂无学校数据';
      emptyRow.appendChild(emptyCell);
      teamBody.appendChild(emptyRow);
    } else {
      each(data.teams, function (team) {
        var isCombined = isArray(team.logos) && team.logos.length >= 2;
        var tr = document.createElement('tr');
        tr.setAttribute('data-team-code', team.code);
        tr.appendChild(createEl('td', 'editor-code', team.code));

        var schoolCell = document.createElement('td');
        var schoolInput = document.createElement('input');
        schoolInput.type = 'text';
        schoolInput.value = team.school;
        schoolInput.placeholder = '学校名称';
        schoolInput.setAttribute('data-field', 'school');
        schoolInput.setAttribute('list', 'schoolOptions');
        schoolCell.appendChild(schoolInput);
        tr.appendChild(schoolCell);

        var combinedCell = document.createElement('td');
        var combinedLabel = createEl('label', 'editor-combined');
        var combinedInput = document.createElement('input');
        combinedInput.type = 'checkbox';
        combinedInput.checked = isCombined;
        combinedInput.setAttribute('data-field', 'combined');
        combinedLabel.appendChild(combinedInput);
        combinedLabel.appendChild(document.createTextNode(' 联队'));
        combinedCell.appendChild(combinedLabel);
        tr.appendChild(combinedCell);

        var logo1Cell = document.createElement('td');
        var logo1Wrap = createEl('div', 'logo-input-wrap');
        var logo1Input = document.createElement('input');
        logo1Input.type = 'text';
        logo1Input.value = isCombined ? (team.logos[0] || '') : (team.logo || '');
        logo1Input.placeholder = '校徽 1 文件名';
        logo1Input.setAttribute('data-field', 'logo');
        logo1Input.setAttribute('list', 'logoOptions');
        var logo1Preview = createLogoPreview();
        logo1Wrap.appendChild(logo1Input);
        logo1Wrap.appendChild(logo1Preview);
        logo1Cell.appendChild(logo1Wrap);
        tr.appendChild(logo1Cell);
        bindLogoPreview(logo1Input, logo1Preview);

        var logo2Cell = document.createElement('td');
        var logo2Wrap = createEl('div', 'logo-input-wrap');
        var logo2Input = document.createElement('input');
        logo2Input.type = 'text';
        logo2Input.value = isCombined ? (team.logos[1] || '') : '';
        logo2Input.placeholder = '校徽 2 文件名';
        logo2Input.disabled = !isCombined;
        logo2Input.setAttribute('data-field', 'logo2');
        logo2Input.setAttribute('list', 'logoOptions');
        var logo2Preview = createLogoPreview();
        logo2Wrap.appendChild(logo2Input);
        logo2Wrap.appendChild(logo2Preview);
        logo2Cell.appendChild(logo2Wrap);
        tr.appendChild(logo2Cell);
        bindLogoPreview(logo2Input, logo2Preview);

        combinedInput.addEventListener('change', function () {
          logo2Input.disabled = !combinedInput.checked;
          if (!combinedInput.checked) {
            logo2Input.value = '';
            logo2Input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        teamBody.appendChild(tr);
      });
    }

    els.teamEditor.appendChild(teamBody);

    appendTableHeader(els.topicEditor, ['组别', '辩题', '正方完整辩题', '反方完整辩题']);
    var topicBody = document.createElement('tbody');

    if (!data.groups.length) {
      var noTopicRow = document.createElement('tr');
      var noTopicCell = document.createElement('td');
      noTopicCell.colSpan = 4;
      noTopicCell.className = 'editor-empty';
      noTopicCell.textContent = '暂无小组赛辩题';
      noTopicRow.appendChild(noTopicCell);
      topicBody.appendChild(noTopicRow);
    } else {
      each(data.groups, function (group) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-group-id', group.id);
        tr.appendChild(createEl('td', 'editor-code', group.name));

        function topicField(field, value, placeholder) {
          var cell = document.createElement('td');
          var input = document.createElement('textarea');
          input.rows = 2;
          input.value = value || '';
          input.placeholder = placeholder;
          input.setAttribute('data-group-id', group.id);
          input.setAttribute('data-field', field);
          cell.appendChild(input);
          tr.appendChild(cell);
        }

        topicField('topic', group.topic, '辩题（正方 / 反方）');
        topicField('proTopic', group.proTopic, '正方完整辩题（回车或 \\n 换行）');
        topicField('conTopic', group.conTopic, '反方完整辩题（回车或 \\n 换行）');

        topicBody.appendChild(tr);
      });
    }

    els.topicEditor.appendChild(topicBody);
    buildExtraEditor();
  }

  function buildExtraEditor() {
    if (!els.extraMatchEditor) {
      return;
    }

    els.extraMatchEditor.textContent = '';
    appendTableHeader(els.extraMatchEditor, ['阶段', '场次', '对阵', '辩题', '正方完整辩题', '反方完整辩题', '操作']);
    var extraBody = document.createElement('tbody');

    if (!data.extraMatches.length) {
      var noExtraRow = document.createElement('tr');
      var noExtraCell = document.createElement('td');
      noExtraCell.colSpan = 7;
      noExtraCell.className = 'editor-empty';
      noExtraCell.textContent = '暂无额外场次，可在下方新增十六强、八强、半决赛或决赛场次';
      noExtraRow.appendChild(noExtraCell);
      extraBody.appendChild(noExtraRow);
    } else {
      each(data.extraMatches, function (match) {
        var tr = document.createElement('tr');
        tr.appendChild(createEl('td', 'editor-code', match.stage));
        tr.appendChild(createEl('td', 'editor-code', '第' + match.round + '场'));

        var home = normalizeExtraTeam(match.home);
        var away = normalizeExtraTeam(match.away);
        tr.appendChild(createEl('td', 'editor-versus', home.school + ' vs ' + away.school));

        function addTopicCell(field, value, placeholder) {
          var cell = document.createElement('td');
          var input = document.createElement('textarea');
          input.rows = 2;
          input.value = value || '';
          input.placeholder = placeholder;
          input.setAttribute('data-extra-match-id', match.id);
          input.setAttribute('data-field', field);
          cell.appendChild(input);
          tr.appendChild(cell);
        }

        addTopicCell('topic', match.topic, '正方观点 / 反方观点');
        addTopicCell('proTopic', match.proTopic, '正方完整辩题（回车或 \\n 换行）');
        addTopicCell('conTopic', match.conTopic, '反方完整辩题（回车或 \\n 换行）');

        var actionCell = document.createElement('td');
        var deleteButton = createEl('button', 'ui-button ui-button--small ui-button--danger', '删除');
        deleteButton.type = 'button';
        deleteButton.addEventListener('click', function () {
          removeExtraMatch(match.id);
        });
        actionCell.appendChild(deleteButton);
        tr.appendChild(actionCell);

        extraBody.appendChild(tr);
      });
    }

    els.extraMatchEditor.appendChild(extraBody);
  }

  function syncExtraTopics() {
    each(qsa('#extraMatchEditor textarea[data-extra-match-id]'), function (input) {
      var found = findMatch(input.getAttribute('data-extra-match-id'));
      var field = input.getAttribute('data-field');
      if (!found) {
        return;
      }
      if (field === 'topic') {
        found.match.topic = trim(input.value) || '待定辩题';
      } else if (field === 'proTopic') {
        found.match.proTopic = trim(input.value);
      } else if (field === 'conTopic') {
        found.match.conTopic = trim(input.value);
      }
    });
  }

  function applyEditor() {
    each(qsa('#teamEditor tbody tr[data-team-code]'), function (tr) {
      var code = tr.getAttribute('data-team-code');
      var team = findTeam(code);
      if (!team) {
        return;
      }

      var schoolInput = qs('input[data-field="school"]', tr);
      var combinedInput = qs('input[data-field="combined"]', tr);
      var logo1Input = qs('input[data-field="logo"]', tr);
      var logo2Input = qs('input[data-field="logo2"]', tr);

      team.school = trim(schoolInput.value) || '待定';

      if (combinedInput && combinedInput.checked) {
        team.logos = [trim(logo1Input.value), trim(logo2Input.value)];
        team.logo = team.logos[0] || '';
      } else {
        team.logos = [];
        team.logo = trim(logo1Input.value);
      }
    });

    each(qsa('#topicEditor textarea[data-group-id]'), function (input) {
      var group = findGroup(input.getAttribute('data-group-id'));
      var field = input.getAttribute('data-field');
      if (!group) {
        return;
      }
      if (field === 'topic') {
        group.topic = trim(input.value) || '待定辩题';
      } else if (field === 'proTopic') {
        group.proTopic = trim(input.value);
      } else if (field === 'conTopic') {
        group.conTopic = trim(input.value);
      }
    });

    syncExtraTopics();

    saveData();
    ensureCurrentMatch();
    renderCurrentMatch();
    buildPicker();
    closeModal(els.editorModal);
    showToast('修改已应用（当前浏览器）；点“保存到文件”可长期生效');
  }

  function generateExtraMatchId() {
    var used = {};
    each(data.extraMatches, function (match) {
      used[match.id] = true;
    });
    var index = 1;
    while (used['KO-' + index]) {
      index += 1;
    }
    return 'KO-' + index;
  }

  function nextExtraRound(stage) {
    var used = {};
    each(data.extraMatches, function (match) {
      if (match.stage === stage) {
        used[match.round] = true;
      }
    });
    var round = 1;
    while (used[round]) {
      round += 1;
    }
    return round;
  }

  function extraTeamFromForm(schoolInput, logoInput, logo2Input, combinedInput) {
    var school = trim(schoolInput.value) || '待定';
    var logo1 = trim(logoInput.value);

    if (combinedInput && combinedInput.checked) {
      return {
        code: '',
        school: school,
        logo: logo1,
        logos: [logo1, trim(logo2Input.value)]
      };
    }

    return {
      code: '',
      school: school,
      logo: logo1,
      logos: []
    };
  }

  function addExtraMatch() {
    if (!els.extraStage) {
      return;
    }

    syncExtraTopics();
    var stage = trim(els.extraStage.value) || '额外场次';
    var round = nextExtraRound(stage);
    var match = {
      id: generateExtraMatchId(),
      stage: stage,
      round: round,
      home: extraTeamFromForm(els.extraHomeSchool, els.extraHomeLogo, els.extraHomeLogo2, els.extraHomeCombined),
      away: extraTeamFromForm(els.extraAwaySchool, els.extraAwayLogo, els.extraAwayLogo2, els.extraAwayCombined),
      topic: trim(els.extraTopic.value) || '待定辩题',
      proTopic: trim(els.extraProTopic.value),
      conTopic: trim(els.extraConTopic.value)
    };

    data.extraMatches.push(match);
    saveData();
    ensureCurrentMatch();
    renderCurrentMatch();
    buildPicker();
    buildLogoOptions();
    buildSchoolOptions();
    buildExtraEditor();
    showToast('已新增场次：' + stage + ' 第' + round + '场');

    els.extraHomeSchool.value = '';
    els.extraHomeLogo.value = '';
    els.extraHomeLogo.dispatchEvent(new Event('input', { bubbles: true }));
    els.extraHomeLogo2.value = '';
    els.extraHomeLogo2.dispatchEvent(new Event('input', { bubbles: true }));
    els.extraHomeCombined.checked = false;
    els.extraHomeLogo2.disabled = true;
    els.extraHomeLogo2Item.style.display = 'none';
    els.extraAwaySchool.value = '';
    els.extraAwayLogo.value = '';
    els.extraAwayLogo.dispatchEvent(new Event('input', { bubbles: true }));
    els.extraAwayLogo2.value = '';
    els.extraAwayLogo2.dispatchEvent(new Event('input', { bubbles: true }));
    els.extraAwayCombined.checked = false;
    els.extraAwayLogo2.disabled = true;
    els.extraAwayLogo2Item.style.display = 'none';
    els.extraTopic.value = '';
    els.extraProTopic.value = '';
    els.extraConTopic.value = '';
    els.extraHomeSchool.focus();
  }

  function removeExtraMatch(id) {
    syncExtraTopics();
    var filtered = [];
    each(data.extraMatches, function (match) {
      if (match.id !== id) {
        filtered.push(match);
      }
    });

    data.extraMatches = filtered;
    saveData();
    ensureCurrentMatch();
    renderCurrentMatch();
    buildPicker();
    buildSchoolOptions();
    buildExtraEditor();
    showToast('已删除场次');
  }

  function extraTeamText(team) {
    var normalized = normalizeExtraTeam(team);
    if (isArray(normalized.logos) && normalized.logos.length >= 2) {
      var logos = [];
      each(normalized.logos, function (logo) {
        logos.push(JSON.stringify(logo));
      });
      return '{ school: ' + JSON.stringify(normalized.school) + ', logos: [' + logos.join(', ') + '] }';
    }
    return '{ school: ' + JSON.stringify(normalized.school) + ', logo: ' + JSON.stringify(normalized.logo) + ' }';
  }

  function serializeData(value) {
    var lines = [];
    lines.push('/*');
    lines.push(' * 南萤杯赛程数据');
    lines.push(' *');
    lines.push(' * 这是网页唯一的数据来源，可直接用记事本 / VS Code / 任意文本编辑器修改。');
    lines.push(' *');
    lines.push(' * 修改说明：');
    lines.push(' * 1. event：赛事名称、阶段、赞助商。');
    lines.push(' * 2. teams：参赛位与学校的对应关系。');
    lines.push(' *    - code    参赛位编号，必须与 groups[].teamCodes 中的编号一致');
    lines.push(' *    - school  学校名称；未确定时填写 "待定"');
    lines.push(' *    - logo    单个学校的校徽文件名；没有校徽时留空 ""');
    lines.push(' *    - logos   联队的两个校徽文件名，例如 ["中国海洋大学.webp", "北京工业大学.webp"]');
    lines.push(' * 3. groups：每个小组 3 支队伍，依次进行 1v2、2v3、3v1 三场比赛。');
    lines.push(' *    - topic      辩题，正方与反方之间用 "/" 分隔');
    lines.push(' *    - proTopic   正方完整辩题；可用 \\n 或直接换行指定断行位置');
    lines.push(' *    - conTopic   反方完整辩题；可用 \\n 或直接换行指定断行位置');
    lines.push(' *    - matches[].home / away 填参赛位编号');
    lines.push(' *    - matches[].date / time 填比赛日期和时间');
    lines.push(' * 4. extraMatches：十六强、八强、半决赛、决赛等额外场次。');
    lines.push(' *    - home / away 直接填写学校名称、单校徽 logo 或联队校徽 logos');
    lines.push(' * 5. 修改保存后刷新网页即可生效。');
    lines.push(' */');
    lines.push('');
    lines.push('window.TOURNAMENT_DATA = {');
    lines.push('  event: {');
    lines.push('    name: ' + JSON.stringify(value.event.name) + ',');
    lines.push('    stage: ' + JSON.stringify(value.event.stage) + ',');
    lines.push('    sponsor: ' + JSON.stringify(value.event.sponsor));
    lines.push('  },');
    lines.push('  teams: [');

    each(value.teams, function (team, index) {
      var comma = index === value.teams.length - 1 ? '' : ',';
      var logoPart = '';

      if (isArray(team.logos) && team.logos.length >= 2) {
        var logos = [];
        each(team.logos, function (logo) {
          logos.push(JSON.stringify(logo));
        });
        logoPart = ', logos: [' + logos.join(', ') + ']';
      } else {
        logoPart = ', logo: ' + JSON.stringify(team.logo || '');
      }

      lines.push(
        '    { code: ' + JSON.stringify(team.code) +
        ', school: ' + JSON.stringify(team.school) +
        logoPart + ' }' + comma
      );
    });

    lines.push('  ],');
    lines.push('  groups: [');

    each(value.groups, function (group, groupIndex) {
      var groupComma = groupIndex === value.groups.length - 1 ? '' : ',';
      var codes = [];

      each(group.teamCodes, function (code) {
        codes.push(JSON.stringify(code));
      });

      lines.push('    {');
      lines.push('      id: ' + JSON.stringify(group.id) + ',');
      lines.push('      name: ' + JSON.stringify(group.name) + ',');
      lines.push('      topic: ' + JSON.stringify(group.topic) + ',');
      lines.push('      proTopic: ' + JSON.stringify(group.proTopic) + ',');
      lines.push('      conTopic: ' + JSON.stringify(group.conTopic) + ',');
      lines.push('      teamCodes: [' + codes.join(', ') + '],');
      lines.push('      matches: [');

      each(group.matches, function (match, matchIndex) {
        var matchComma = matchIndex === group.matches.length - 1 ? '' : ',';
        lines.push(
          '        { id: ' + JSON.stringify(match.id) +
          ', round: ' + match.round +
          ', home: ' + JSON.stringify(match.home) +
          ', away: ' + JSON.stringify(match.away) +
          ', date: ' + JSON.stringify(match.date || '') +
          ', time: ' + JSON.stringify(match.time || '') + ' }' + matchComma
        );
      });

      lines.push('      ]');
      lines.push('    }' + groupComma);
    });

    lines.push('  ],');

    if (!value.extraMatches.length) {
      lines.push('  extraMatches: []');
    } else {
      lines.push('  extraMatches: [');
      each(value.extraMatches, function (match, index) {
        var matchComma = index === value.extraMatches.length - 1 ? '' : ',';
        var home = extraTeamText(match.home);
        var away = extraTeamText(match.away);
        lines.push(
          '    { id: ' + JSON.stringify(match.id) +
          ', stage: ' + JSON.stringify(match.stage) +
          ', round: ' + match.round +
          ', home: ' + home +
          ', away: ' + away +
          ', date: ' + JSON.stringify(match.date || '') +
          ', time: ' + JSON.stringify(match.time || '') +
          ', topic: ' + JSON.stringify(match.topic) +
          ', proTopic: ' + JSON.stringify(match.proTopic || '') +
          ', conTopic: ' + JSON.stringify(match.conTopic || '') + ' }' + matchComma
        );
      });
      lines.push('  ]');
    }

    lines.push('};');
    lines.push('');

    return lines.join('\n');
  }

  function downloadText(content, filename) {
    var blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename || 'data.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function saveToFile() {
    var content = serializeData(data);

    if (window.showSaveFilePicker) {
      window.showSaveFilePicker({
        suggestedName: 'data.js',
        types: [{
          description: 'JavaScript 数据文件',
          accept: { 'text/javascript': ['.js'] }
        }]
      }).then(function (handle) {
        return handle.createWritable().then(function (writable) {
          return writable.write(content).then(function () {
            return writable.close();
          });
        });
      }).then(function () {
        showToast('已保存到文件');
      }).catch(function (err) {
        if (err && err.name === 'AbortError') {
          return;
        }
        console.warn('保存到文件失败，改用下载：', err);
        downloadText(content, 'data.js');
        showToast('已下载 data.js，请用它覆盖根目录的同名文件');
      });
      return;
    }

    downloadText(content, 'data.js');
    showToast('已下载 data.js，请用它覆盖根目录的同名文件');
  }

  function parseDataText(source) {
    try {
      var json = JSON.parse(source);
      if (json && isArray(json.groups) && isArray(json.teams)) {
        return normalizeData(json);
      }
    } catch (err) {
      // 不是纯 JSON，继续按 JS 数据文件解析。
    }

    try {
      var factory = new Function('window', source + '\n;return window.TOURNAMENT_DATA;');
      var result = factory({});
      if (result && isArray(result.groups) && isArray(result.teams)) {
        return normalizeData(result);
      }
    } catch (err2) {
      console.error('解析数据文件失败：', err2);
    }

    return null;
  }

  function importDataFile(file) {
    if (!file) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      var parsed = parseDataText(text(reader.result));
      if (!parsed) {
        window.alert('无法解析这个数据文件，请确认它是“修改数据”导出的 data.js。');
        return;
      }

      data = parsed;
      ensureCurrentMatch();
      saveData();
      renderCurrentMatch();
      buildPicker();
      buildEditor();
      showToast('已导入数据文件');
    };
    reader.readAsText(file, 'utf-8');
  }

  function resetToFileData() {
    if (!window.confirm('将丢弃浏览器内保存的修改，恢复为 data.js 的内容。继续吗？')) {
      return;
    }

    safeRemove(STORAGE_DATA);
    data = clone(sourceData);
    ensureCurrentMatch();
    renderCurrentMatch();
    buildPicker();
    buildEditor();
    showToast('已恢复为文件中的初始数据');
  }

  function openModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.add('is-open');
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.remove('is-open');
  }

  function closeAllModals() {
    closeModal(els.pickerModal);
    closeModal(els.editorModal);
  }

  function showToast(message) {
    if (!els.toast) {
      return;
    }
    els.toast.textContent = message;
    els.toast.classList.add('is-show');
    if (toastTimer) {
      window.clearTimeout(toastTimer);
    }
    toastTimer = window.setTimeout(function () {
      els.toast.classList.remove('is-show');
    }, 2600);
  }

  function createModal(id, title, subtitle) {
    var modal = createEl('div', 'modal');
    modal.id = id;

    var backdrop = createEl('div', 'modal__backdrop');
    backdrop.setAttribute('data-close', 'true');

    var panel = createEl('div', 'modal__panel');
    var header = createEl('div', 'modal__header');
    var heading = document.createElement('div');
    heading.appendChild(createEl('h2', '', title));
    heading.appendChild(createEl('p', 'modal__subtitle', subtitle));

    var closeButton = createEl('button', 'modal__close', '×');
    closeButton.type = 'button';
    closeButton.setAttribute('data-close', 'true');
    closeButton.setAttribute('aria-label', '关闭');

    header.appendChild(heading);
    header.appendChild(closeButton);

    var body = createEl('div', 'modal__body');
    var footer = createEl('div', 'modal__footer');

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    modal.appendChild(backdrop);
    modal.appendChild(panel);

    each(qsa('[data-close]', modal), function (el) {
      el.addEventListener('click', function () {
        closeModal(modal);
      });
    });

    // 阻止弹窗内的滚动 / 输入事件冒泡到 onepage-scroll，避免翻页。
    each(['wheel', 'mousewheel', 'DOMMouseScroll', 'touchmove'], function (type) {
      panel.addEventListener(type, function (event) {
        event.stopPropagation();
      }, { passive: false });
    });

    panel.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeModal(modal);
        return;
      }
      var tag = (event.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        event.stopPropagation();
      }
    });

    document.body.appendChild(modal);

    return {
      modal: modal,
      body: body,
      footer: footer
    };
  }

  function ensureModals() {
    if (!els.pickerModal) {
      var picker = createModal(
        'matchPickerModal',
        '选择场次',
        '点击任意一场，计时器会切换到该场的学校、校徽与辩题。'
      );
      els.pickerModal = picker.modal;
      els.matchGroups = createEl('div', 'match-groups');
      els.matchGroups.id = 'matchGroups';
      picker.body.appendChild(els.matchGroups);
    }

    if (!els.editorModal) {
      var editor = createModal(
        'dataEditorModal',
        '修改赛程数据',
        '修改学校名称、校徽文件名和辩题，也可以新增十六强、八强、半决赛、决赛场次。'
      );
      els.editorModal = editor.modal;

      var note = createEl(
        'p',
        'modal__note',
        '校徽图片请放在 assets/logo/ 目录，并在“校徽 1 / 校徽 2”中填写文件名（例如：上海交通大学.webp）。' +
        '辩题请用“/”分隔正方与反方；在“小组赛辩题”中可以分别填写正方、反方的完整辩题（回车换行，或输入 \\n 表示换行）。' +
        '网页不能静默覆盖本地文件：Chrome / Edge 可点击“保存到文件”选择根目录 data.js 覆盖；' +
        '其他浏览器请点击“下载数据文件”后手动替换。'
      );

      var teamSection = createEl('section', 'editor-section');
      teamSection.appendChild(createEl('h3', '', '参赛学校'));
      var teamScroll = createEl('div', 'editor-scroll');
      els.teamEditor = createEl('table', 'editor-table');
      els.teamEditor.id = 'teamEditor';
      teamScroll.appendChild(els.teamEditor);
      teamSection.appendChild(teamScroll);

      var matchSection = createEl('section', 'editor-section');
      matchSection.appendChild(createEl('h3', '', '小组赛辩题'));
      var matchScroll = createEl('div', 'editor-scroll');
      els.topicEditor = createEl('table', 'editor-table');
      els.topicEditor.id = 'topicEditor';
      matchScroll.appendChild(els.topicEditor);
      matchSection.appendChild(matchScroll);

      var extraSection = createEl('section', 'editor-section');
      extraSection.appendChild(createEl('h3', '', '额外场次（十六强 / 八强 / 半决赛 / 决赛）'));
      var extraScroll = createEl('div', 'editor-scroll');
      els.extraMatchEditor = createEl('table', 'editor-table');
      els.extraMatchEditor.id = 'extraMatchEditor';
      extraScroll.appendChild(els.extraMatchEditor);
      extraSection.appendChild(extraScroll);

      var extraForm = createEl('div', 'extra-form');
      extraForm.appendChild(createEl('h4', 'extra-form__title', '新增场次'));
      var extraGrid = createEl('div', 'extra-form__grid');

      function addExtraField(labelText, input, wide) {
        var field = createEl('label', 'extra-form__field' + (wide ? ' extra-form__field--wide' : ''));
        field.appendChild(createEl('span', 'extra-form__label', labelText));
        field.appendChild(input);
        extraGrid.appendChild(field);
      }

      els.extraStage = document.createElement('input');
      els.extraStage.type = 'text';
      els.extraStage.id = 'extraStage';
      els.extraStage.placeholder = '十六强 / 八强 / 半决赛 / 决赛';
      els.extraStage.setAttribute('list', 'stageOptions');
      addExtraField('阶段', els.extraStage, true);

      var homeSchoolWrap = createEl('div', 'extra-form__inline');
      els.extraHomeSchool = document.createElement('input');
      els.extraHomeSchool.type = 'text';
      els.extraHomeSchool.id = 'extraHomeSchool';
      els.extraHomeSchool.placeholder = '正方学校名称';
      els.extraHomeSchool.setAttribute('list', 'schoolOptions');
      homeSchoolWrap.appendChild(els.extraHomeSchool);

      var homeCombinedLabel = createEl('label', 'extra-form__checkbox');
      els.extraHomeCombined = document.createElement('input');
      els.extraHomeCombined.type = 'checkbox';
      homeCombinedLabel.appendChild(els.extraHomeCombined);
      homeCombinedLabel.appendChild(document.createTextNode('联队'));
      homeSchoolWrap.appendChild(homeCombinedLabel);
      addExtraField('正方学校', homeSchoolWrap, false);

      var homeLogoWrap = createEl('div', 'extra-form__logo-pair');
      els.extraHomeLogo = document.createElement('input');
      els.extraHomeLogo.type = 'text';
      els.extraHomeLogo.id = 'extraHomeLogo';
      els.extraHomeLogo.placeholder = '正方校徽 1 文件名';
      els.extraHomeLogo.setAttribute('list', 'logoOptions');
      var homeLogoItem1 = createEl('div', 'logo-input-wrap');
      var homeLogoPreview1 = createLogoPreview();
      homeLogoItem1.appendChild(els.extraHomeLogo);
      homeLogoItem1.appendChild(homeLogoPreview1);
      bindLogoPreview(els.extraHomeLogo, homeLogoPreview1);

      els.extraHomeLogo2 = document.createElement('input');
      els.extraHomeLogo2.type = 'text';
      els.extraHomeLogo2.id = 'extraHomeLogo2';
      els.extraHomeLogo2.placeholder = '正方校徽 2 文件名';
      els.extraHomeLogo2.disabled = true;
      els.extraHomeLogo2.setAttribute('list', 'logoOptions');
      var homeLogoItem2 = createEl('div', 'logo-input-wrap');
      var homeLogoPreview2 = createLogoPreview();
      homeLogoItem2.appendChild(els.extraHomeLogo2);
      homeLogoItem2.appendChild(homeLogoPreview2);
      homeLogoItem2.style.display = 'none';
      bindLogoPreview(els.extraHomeLogo2, homeLogoPreview2);

      homeLogoWrap.appendChild(homeLogoItem1);
      homeLogoWrap.appendChild(homeLogoItem2);
      els.extraHomeLogo2Item = homeLogoItem2;
      addExtraField('正方校徽', homeLogoWrap, false);

      var awaySchoolWrap = createEl('div', 'extra-form__inline');
      els.extraAwaySchool = document.createElement('input');
      els.extraAwaySchool.type = 'text';
      els.extraAwaySchool.id = 'extraAwaySchool';
      els.extraAwaySchool.placeholder = '反方学校名称';
      els.extraAwaySchool.setAttribute('list', 'schoolOptions');
      awaySchoolWrap.appendChild(els.extraAwaySchool);

      var awayCombinedLabel = createEl('label', 'extra-form__checkbox');
      els.extraAwayCombined = document.createElement('input');
      els.extraAwayCombined.type = 'checkbox';
      awayCombinedLabel.appendChild(els.extraAwayCombined);
      awayCombinedLabel.appendChild(document.createTextNode('联队'));
      awaySchoolWrap.appendChild(awayCombinedLabel);
      addExtraField('反方学校', awaySchoolWrap, false);

      var awayLogoWrap = createEl('div', 'extra-form__logo-pair');
      els.extraAwayLogo = document.createElement('input');
      els.extraAwayLogo.type = 'text';
      els.extraAwayLogo.id = 'extraAwayLogo';
      els.extraAwayLogo.placeholder = '反方校徽 1 文件名';
      els.extraAwayLogo.setAttribute('list', 'logoOptions');
      var awayLogoItem1 = createEl('div', 'logo-input-wrap');
      var awayLogoPreview1 = createLogoPreview();
      awayLogoItem1.appendChild(els.extraAwayLogo);
      awayLogoItem1.appendChild(awayLogoPreview1);
      bindLogoPreview(els.extraAwayLogo, awayLogoPreview1);

      els.extraAwayLogo2 = document.createElement('input');
      els.extraAwayLogo2.type = 'text';
      els.extraAwayLogo2.id = 'extraAwayLogo2';
      els.extraAwayLogo2.placeholder = '反方校徽 2 文件名';
      els.extraAwayLogo2.disabled = true;
      els.extraAwayLogo2.setAttribute('list', 'logoOptions');
      var awayLogoItem2 = createEl('div', 'logo-input-wrap');
      var awayLogoPreview2 = createLogoPreview();
      awayLogoItem2.appendChild(els.extraAwayLogo2);
      awayLogoItem2.appendChild(awayLogoPreview2);
      awayLogoItem2.style.display = 'none';
      bindLogoPreview(els.extraAwayLogo2, awayLogoPreview2);

      awayLogoWrap.appendChild(awayLogoItem1);
      awayLogoWrap.appendChild(awayLogoItem2);
      els.extraAwayLogo2Item = awayLogoItem2;
      addExtraField('反方校徽', awayLogoWrap, false);

      bindSchoolAutofill(els.extraHomeSchool, els.extraHomeLogo, els.extraHomeLogo2, els.extraHomeLogo2Item, els.extraHomeCombined);
      bindSchoolAutofill(els.extraAwaySchool, els.extraAwayLogo, els.extraAwayLogo2, els.extraAwayLogo2Item, els.extraAwayCombined);
      bindCombinedToggle(els.extraHomeCombined, els.extraHomeLogo2, els.extraHomeLogo2Item);
      bindCombinedToggle(els.extraAwayCombined, els.extraAwayLogo2, els.extraAwayLogo2Item);

      els.extraTopic = document.createElement('textarea');
      els.extraTopic.id = 'extraTopic';
      els.extraTopic.rows = 2;
      els.extraTopic.placeholder = '正方观点 / 反方观点';
      addExtraField('辩题', els.extraTopic, true);

      els.extraProTopic = document.createElement('textarea');
      els.extraProTopic.id = 'extraProTopic';
      els.extraProTopic.rows = 2;
      els.extraProTopic.placeholder = '正方完整辩题（回车或 \\n 换行）';
      addExtraField('正方完整辩题', els.extraProTopic, false);

      els.extraConTopic = document.createElement('textarea');
      els.extraConTopic.id = 'extraConTopic';
      els.extraConTopic.rows = 2;
      els.extraConTopic.placeholder = '反方完整辩题（回车或 \\n 换行）';
      addExtraField('反方完整辩题', els.extraConTopic, false);

      var addExtraButton = createEl('button', 'ui-button ui-button--primary', '新增场次');
      addExtraButton.type = 'button';
      addExtraButton.id = 'addExtraMatch';
      addExtraButton.addEventListener('click', addExtraMatch);
      extraForm.appendChild(extraGrid);
      extraForm.appendChild(addExtraButton);
      extraSection.appendChild(extraForm);

      var stageOptions = document.createElement('datalist');
      stageOptions.id = 'stageOptions';
      each(['十六强', '八强', '半决赛', '决赛'], function (name) {
        var option = document.createElement('option');
        option.value = name;
        stageOptions.appendChild(option);
      });

      var logoOptions = document.createElement('datalist');
      logoOptions.id = 'logoOptions';
      els.logoOptions = logoOptions;

      var schoolOptions = document.createElement('datalist');
      schoolOptions.id = 'schoolOptions';
      els.schoolOptions = schoolOptions;

      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.js,text/javascript';
      fileInput.style.display = 'none';
      els.fileInput = fileInput;

      editor.body.appendChild(note);
      editor.body.appendChild(teamSection);
      editor.body.appendChild(matchSection);
      editor.body.appendChild(extraSection);
      editor.body.appendChild(stageOptions);
      editor.body.appendChild(logoOptions);
      editor.body.appendChild(schoolOptions);
      editor.body.appendChild(fileInput);

      var applyButton = createEl('button', 'ui-button ui-button--primary', '应用修改');
      applyButton.type = 'button';
      applyButton.addEventListener('click', applyEditor);

      var saveButton = createEl('button', 'ui-button', '保存到文件');
      saveButton.type = 'button';
      saveButton.addEventListener('click', saveToFile);

      var downloadButton = createEl('button', 'ui-button', '下载数据文件');
      downloadButton.type = 'button';
      downloadButton.addEventListener('click', function () {
        downloadText(serializeData(data), 'data.js');
        showToast('已下载 data.js，请用它覆盖根目录的同名文件');
      });

      var importButton = createEl('button', 'ui-button', '导入数据文件');
      importButton.type = 'button';
      importButton.addEventListener('click', function () {
        els.fileInput.value = '';
        els.fileInput.click();
      });

      var resetButton = createEl('button', 'ui-button ui-button--danger', '重置为文件数据');
      resetButton.type = 'button';
      resetButton.addEventListener('click', resetToFileData);

      var closeButton = createEl('button', 'ui-button', '关闭');
      closeButton.type = 'button';
      closeButton.addEventListener('click', function () {
        closeModal(els.editorModal);
      });

      editor.footer.appendChild(applyButton);
      editor.footer.appendChild(saveButton);
      editor.footer.appendChild(downloadButton);
      editor.footer.appendChild(importButton);
      editor.footer.appendChild(resetButton);
      editor.footer.appendChild(closeButton);

      els.fileInput.addEventListener('change', function () {
        importDataFile(els.fileInput.files && els.fileInput.files[0]);
      });
    }

    if (!els.toast) {
      els.toast = createEl('div', 'toast');
      els.toast.id = 'toast';
      document.body.appendChild(els.toast);
    }
  }

  function bindToolbar() {
    var pickerButton = qs('#openMatchPicker');
    var editorButton = qs('#openDataEditor');

    if (pickerButton) {
      pickerButton.addEventListener('click', function () {
        buildPicker();
        openModal(els.pickerModal);
      });
    }

    if (editorButton) {
      editorButton.addEventListener('click', function () {
        buildEditor();
        openModal(els.editorModal);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  function init() {
    ensureModals();
    ensureCurrentMatch();
    ensureTeamSideWrappers();
    ensurePageMatchInfo();
    ensureTeamLogos();
    bindToolbar();
    renderCurrentMatch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});
