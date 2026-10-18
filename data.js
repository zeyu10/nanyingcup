/*
 * 南萤杯赛程数据
 *
 * 这是网页唯一的数据来源，可直接用记事本 / VS Code / 任意文本编辑器修改。
 *
 * 修改说明：
 * 1. event：赛事名称、阶段、赞助商。
 * 2. teams：参赛位与学校的对应关系。
 *    - code   参赛位编号，必须与 groups[].teamCodes 中的编号一致
 *    - school 学校名称；未确定时填写 "待定"
 *    - logo   assets/logo 目录下的文件名；没有校徽时留空 ""
 * 3. groups：每个小组 3 支队伍，依次进行 1v2、2v3、3v1 三场比赛。
 *    - matches[].home / away 填参赛位编号
 *    - matches[].topic 填该场辩题
 * 4. extraMatches：十六强、八强、半决赛、决赛等额外场次。
 *    - 可在网页“修改数据 → 新增场次”中添加，也可在这里手动增加
 *    - home / away 直接填写学校名称和校徽文件名
 * 5. 辩题请用 " / " 分隔正方与反方：
 *    前半句显示在“正方持方”下，后半句显示在“反方持方”下。
 * 6. 修改保存后刷新网页即可生效。
 *    也可以点击网页右上角“修改数据”，在页面中编辑并导出本文件。
 */

window.TOURNAMENT_DATA = {
  event: {
    name: "2026 南萤杯国际华语辩论赛",
    stage: "小组赛",
    sponsor: "China Unicom"
  },
  teams: [
    { code: "A1", school: "上海交通大学", logo: "上海交通大学.webp" },
    { code: "A2", school: "上海健康医学院", logo: "上海健康医学院.webp" },
    { code: "A3", school: "待定", logo: "" },
    { code: "B1", school: "中国人民大学", logo: "中国人民大学.webp" },
    { code: "B2", school: "中国海洋大学", logo: "中国海洋大学.webp" },
    { code: "B3", school: "待定", logo: "" },
    { code: "C1", school: "中山大学", logo: "中山大学.webp" },
    { code: "C2", school: "北京工业大学", logo: "北京工业大学.webp" },
    { code: "C3", school: "待定", logo: "" },
    { code: "D1", school: "北京林业大学", logo: "北京林业大学.webp" },
    { code: "D2", school: "华东师范大学", logo: "华东师范大学.webp" },
    { code: "D3", school: "待定", logo: "" },
    { code: "E1", school: "厦门大学", logo: "厦门大学.webp" },
    { code: "E2", school: "厦门大学马来西亚分校", logo: "厦门大学马来西亚分校.webp" },
    { code: "E3", school: "待定", logo: "" },
    { code: "F1", school: "四川大学", logo: "四川大学.webp" },
    { code: "F2", school: "武汉大学", logo: "武汉大学.webp" },
    { code: "F3", school: "待定", logo: "" },
    { code: "G1", school: "浙江大学", logo: "浙江大学.webp" },
    { code: "G2", school: "浙江理工大学", logo: "浙江理工大学.webp" },
    { code: "G3", school: "待定", logo: "" },
    { code: "H1", school: "湖南大学", logo: "湖南大学.webp" },
    { code: "H2", school: "重庆大学", logo: "重庆大学.webp" },
    { code: "H3", school: "待定", logo: "" }
  ],
  groups: [
    {
      id: "A",
      name: "A组",
      teamCodes: ["A1", "A2", "A3"],
      matches: [
        { id: "A-1", round: 1, home: "A1", away: "A2", topic: "人工智能的快速发展对人类社会利大于弊 / 人工智能的快速发展对人类社会弊大于利" },
        { id: "A-2", round: 2, home: "A2", away: "A3", topic: "短视频的流行对青少年成长利大于弊 / 短视频的流行对青少年成长弊大于利" },
        { id: "A-3", round: 3, home: "A3", away: "A1", topic: "大学教育应更注重通识教育 / 大学教育应更注重专业教育" }
      ]
    },
    {
      id: "B",
      name: "B组",
      teamCodes: ["B1", "B2", "B3"],
      matches: [
        { id: "B-1", round: 1, home: "B1", away: "B2", topic: "网络匿名有利于公共讨论 / 网络匿名不利于公共讨论" },
        { id: "B-2", round: 2, home: "B2", away: "B3", topic: "当代青年更应该去大城市发展 / 当代青年更应该去中小城市发展" },
        { id: "B-3", round: 3, home: "B3", away: "B1", topic: "传统文化在当代更需要继承 / 传统文化在当代更需要创新" }
      ]
    },
    {
      id: "C",
      name: "C组",
      teamCodes: ["C1", "C2", "C3"],
      matches: [
        { id: "C-1", round: 1, home: "C1", away: "C2", topic: "社交媒体让人与人更亲近 / 社交媒体让人与人更疏远" },
        { id: "C-2", round: 2, home: "C2", away: "C3", topic: "竞争更有利于个人成长 / 合作更有利于个人成长" },
        { id: "C-3", round: 3, home: "C3", away: "C1", topic: "逆境更有利于人的成长 / 顺境更有利于人的成长" }
      ]
    },
    {
      id: "D",
      name: "D组",
      teamCodes: ["D1", "D2", "D3"],
      matches: [
        { id: "D-1", round: 1, home: "D1", away: "D2", topic: "应该鼓励年轻人裸辞 / 不应该鼓励年轻人裸辞" },
        { id: "D-2", round: 2, home: "D2", away: "D3", topic: "消费主义是现代社会的陷阱 / 消费主义不是现代社会的陷阱" },
        { id: "D-3", round: 3, home: "D3", away: "D1", topic: "知识付费是智商税 / 知识付费不是智商税" }
      ]
    },
    {
      id: "E",
      name: "E组",
      teamCodes: ["E1", "E2", "E3"],
      matches: [
        { id: "E-1", round: 1, home: "E1", away: "E2", topic: "内卷是社会进步的体现 / 内卷不是社会进步的体现" },
        { id: "E-2", round: 2, home: "E2", away: "E3", topic: "躺平是对现实的合理反抗 / 躺平不是对现实的合理反抗" },
        { id: "E-3", round: 3, home: "E3", away: "E1", topic: "段子更能缓解当代人的压力 / 短视频更能缓解当代人的压力" }
      ]
    },
    {
      id: "F",
      name: "F组",
      teamCodes: ["F1", "F2", "F3"],
      matches: [
        { id: "F-1", round: 1, home: "F1", away: "F2", topic: "科技发展让人更自由 / 科技发展让人更不自由" },
        { id: "F-2", round: 2, home: "F2", away: "F3", topic: "算法推荐利大于弊 / 算法推荐弊大于利" },
        { id: "F-3", round: 3, home: "F3", away: "F1", topic: "数字遗产应该被继承 / 数字遗产不应该被继承" }
      ]
    },
    {
      id: "G",
      name: "G组",
      teamCodes: ["G1", "G2", "G3"],
      matches: [
        { id: "G-1", round: 1, home: "G1", away: "G2", topic: "结婚更幸福 / 不结婚更幸福" },
        { id: "G-2", round: 2, home: "G2", away: "G3", topic: "门当户对更重要 / 三观相合更重要" },
        { id: "G-3", round: 3, home: "G3", away: "G1", topic: "异地恋是爱情的试金石 / 异地恋不是爱情的试金石" }
      ]
    },
    {
      id: "H",
      name: "H组",
      teamCodes: ["H1", "H2", "H3"],
      matches: [
        { id: "H-1", round: 1, home: "H1", away: "H2", topic: "大学排名对高等教育利大于弊 / 大学排名对高等教育弊大于利" },
        { id: "H-2", round: 2, home: "H2", away: "H3", topic: "应该取消高考英语 / 不应该取消高考英语" },
        { id: "H-3", round: 3, home: "H3", away: "H1", topic: "通才更适合未来社会 / 专才更适合未来社会" }
      ]
    }
  ],
  extraMatches: []
};
