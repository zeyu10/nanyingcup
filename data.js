/*
 * 南萤杯赛程数据
 *
 * 这是网页唯一的数据来源，可直接用记事本 / VS Code / 任意文本编辑器修改。
 *
 * 修改说明：
 * 1. event：赛事名称、阶段、赞助商。
 * 2. teams：参赛位与学校的对应关系。
 *    - code    参赛位编号，必须与 groups[].teamCodes 中的编号一致
 *    - school  学校名称；未确定时填写 "待定"
 *    - logo    单个学校的校徽文件名；没有校徽时留空 ""
 *    - logos   联队的两个校徽文件名，例如 ["中国海洋大学.webp", "北京工业大学.webp"]
 * 3. groups：每个小组 3 支队伍，依次进行 1v2、2v3、3v1 三场比赛。
 *    - topic      辩题，正方与反方之间用 "/" 分隔
 *    - proTopic   正方完整辩题
 *    - conTopic   反方完整辩题
 *    - matches[].home / away 填参赛位编号
 *    - matches[].date / time 填比赛日期和时间
 * 4. extraMatches：十六强、八强、半决赛、决赛等额外场次。
 *    - 可在网页“修改数据 → 新增场次”中添加，也可在这里手动增加
 *    - home / away 直接填写学校名称、单校徽 logo 或联队校徽 logos
 * 5. 修改保存后刷新网页即可生效。
 *    也可以点击网页右上角“修改数据”，在页面中编辑并导出本文件。
 */

window.TOURNAMENT_DATA = {
  event: {
    name: "2026 南萤杯国际华语辩论赛",
    stage: "小组赛",
    sponsor: "赞助商"
  },
  teams: [
    { code: "A1", school: "博特拉大学", logo: "博特拉大学.png" },
    { code: "A2", school: "浙江理工大学", logo: "浙江理工大学.webp" },
    { code: "A3", school: "重庆大学", logo: "重庆大学.webp" },
    { code: "B1", school: "厦门大学", logo: "厦门大学.webp" },
    { code: "B2", school: "悉尼大学 & 新南威尔士大学", logos: ["悉尼大学.png", "新南威尔士大学.webp"] },
    { code: "B3", school: "新加坡国立大学", logo: "新加坡国立大学.png" },
    { code: "C1", school: "马来亚大学", logo: "马来亚大学.png" },
    { code: "C2", school: "伦敦政治经济学院", logo: "伦敦政治经济学院.png" },
    { code: "C3", school: "中国人民大学", logo: "中国人民大学.webp" },
    { code: "D1", school: "北京林业大学", logo: "北京林业大学.webp" },
    { code: "D2", school: "武汉大学", logo: "武汉大学.webp" },
    { code: "D3", school: "中山大学", logo: "中山大学.webp" },
    { code: "E1", school: "杜伦大学", logo: "杜伦大学.png" },
    { code: "E2", school: "中国海洋大学 & 北京工业大学", logos: ["中国海洋大学.webp", "北京工业大学.webp"] },
    { code: "E3", school: "四川大学", logo: "四川大学.webp" },
    { code: "F1", school: "双溪威拉曼大学", logo: "双溪威拉曼大学.png" },
    { code: "F2", school: "华东师范大学", logo: "华东师范大学.webp" },
    { code: "F3", school: "台北科技大学 & 上海健康医学院", logos: ["台北科技大学.png", "上海健康医学院.webp"] },
    { code: "G1", school: "湖南大学", logo: "湖南大学.jpg" },
    { code: "G2", school: "复旦大学", logo: "复旦大学.webp" },
    { code: "G3", school: "墨尔本大学", logo: "墨尔本大学.png" },
    { code: "H1", school: "厦门大学马来西亚分校", logo: "厦门大学马来西亚分校.webp" },
    { code: "H2", school: "浙江大学", logo: "浙江大学.webp" },
    { code: "H3", school: "上海交通大学", logo: "上海交通大学.webp" }
  ],
  groups: [
    {
      id: "A",
      name: "A组",
      topic: "人工智能时代，人类的不可替代性是一种值得坚守的价值 / 应该放下的执念",
      proTopic: "人工智能时代，人类的不可替代性是一种值得坚守的价值",
      conTopic: "人工智能时代，人类的不可替代性是一种应该放下的执念",
      teamCodes: ["A1", "A2", "A3"],
      matches: [
        { id: "A-1", round: 1, home: "A1", away: "A2", date: "12月11日", time: "09:00 - 11:00" },
        { id: "A-2", round: 2, home: "A2", away: "A3", date: "12月11日", time: "15:00 - 17:00" },
        { id: "A-3", round: 3, home: "A3", away: "A1", date: "12月12日", time: "09:00 - 11:00" }
      ]
    },
    {
      id: "B",
      name: "B组",
      topic: "人工智能时代，人类的不可替代性是一种值得坚守的价值 / 应该放下的执念",
      proTopic: "人工智能时代，人类的不可替代性是一种值得坚守的价值",
      conTopic: "人工智能时代，人类的不可替代性是一种应该放下的执念",
      teamCodes: ["B1", "B2", "B3"],
      matches: [
        { id: "B-1", round: 1, home: "B1", away: "B2", date: "12月11日", time: "09:00 - 11:00" },
        { id: "B-2", round: 2, home: "B2", away: "B3", date: "12月11日", time: "15:00 - 17:00" },
        { id: "B-3", round: 3, home: "B3", away: "B1", date: "12月12日", time: "09:00 - 11:00" }
      ]
    },
    {
      id: "C",
      name: "C组",
      topic: "对经济体的未来发展而言，政策应当优先效率导向 / 韧性导向",
      proTopic: "对经济体的未来发展而言，政策应当优先效率导向",
      conTopic: "对经济体的未来发展而言，政策应当优先韧性导向",
      teamCodes: ["C1", "C2", "C3"],
      matches: [
        { id: "C-1", round: 1, home: "C1", away: "C2", date: "12月11日", time: "09:00 - 11:00" },
        { id: "C-2", round: 2, home: "C2", away: "C3", date: "12月11日", time: "15:00 - 17:00" },
        { id: "C-3", round: 3, home: "C3", away: "C1", date: "12月12日", time: "09:00 - 11:00" }
      ]
    },
    {
      id: "D",
      name: "D组",
      topic: "对经济体的未来发展而言，政策应当优先效率导向 / 韧性导向",
      proTopic: "对经济体的未来发展而言，政策应当优先效率导向",
      conTopic: "对经济体的未来发展而言，政策应当优先韧性导向",
      teamCodes: ["D1", "D2", "D3"],
      matches: [
        { id: "D-1", round: 1, home: "D1", away: "D2", date: "12月11日", time: "09:00 - 11:00" },
        { id: "D-2", round: 2, home: "D2", away: "D3", date: "12月11日", time: "15:00 - 17:00" },
        { id: "D-3", round: 3, home: "D3", away: "D1", date: "12月12日", time: "09:00 - 11:00" }
      ]
    },
    {
      id: "E",
      name: "E组",
      topic: "在一个充满不确定性的未来，向后找好退路 / 向前拥有目标更重要",
      proTopic: "在一个充满不确定性的未来，向后找好退路更重要",
      conTopic: "在一个充满不确定性的未来，向前拥有目标更重要",
      teamCodes: ["E1", "E2", "E3"],
      matches: [
        { id: "E-1", round: 1, home: "E1", away: "E2", date: "12月11日", time: "12:00 - 14:00" },
        { id: "E-2", round: 2, home: "E2", away: "E3", date: "12月11日", time: "18:00 - 20:00" },
        { id: "E-3", round: 3, home: "E3", away: "E1", date: "12月12日", time: "12:00 - 14:00" }
      ]
    },
    {
      id: "F",
      name: "F组",
      topic: "在一个充满不确定性的未来，向后找好退路 / 向前拥有目标更重要",
      proTopic: "在一个充满不确定性的未来，向后找好退路更重要",
      conTopic: "在一个充满不确定性的未来，向前拥有目标更重要",
      teamCodes: ["F1", "F2", "F3"],
      matches: [
        { id: "F-1", round: 1, home: "F1", away: "F2", date: "12月11日", time: "12:00 - 14:00" },
        { id: "F-2", round: 2, home: "F2", away: "F3", date: "12月11日", time: "18:00 - 20:00" },
        { id: "F-3", round: 3, home: "F3", away: "F1", date: "12月12日", time: "12:00 - 14:00" }
      ]
    },
    {
      id: "G",
      name: "G组",
      topic: "在发展过程中，技术的神圣化是助力 / 阻力",
      proTopic: "在发展过程中，技术的神圣化是助力",
      conTopic: "在发展过程中，技术的神圣化是阻力",
      teamCodes: ["G1", "G2", "G3"],
      matches: [
        { id: "G-1", round: 1, home: "G1", away: "G2", date: "12月11日", time: "12:00 - 14:00" },
        { id: "G-2", round: 2, home: "G2", away: "G3", date: "12月11日", time: "18:00 - 20:00" },
        { id: "G-3", round: 3, home: "G3", away: "G1", date: "12月12日", time: "12:00 - 14:00" }
      ]
    },
    {
      id: "H",
      name: "H组",
      topic: "在发展过程中，技术的神圣化是助力 / 阻力",
      proTopic: "在发展过程中，技术的神圣化是助力",
      conTopic: "在发展过程中，技术的神圣化是阻力",
      teamCodes: ["H1", "H2", "H3"],
      matches: [
        { id: "H-1", round: 1, home: "H1", away: "H2", date: "12月11日", time: "12:00 - 14:00" },
        { id: "H-2", round: 2, home: "H2", away: "H3", date: "12月11日", time: "18:00 - 20:00" },
        { id: "H-3", round: 3, home: "H3", away: "H1", date: "12月12日", time: "12:00 - 14:00" }
      ]
    }
  ],
  extraMatches: []
};
