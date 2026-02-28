export type TimelineIcon = 'work' | 'education';

export type TimelineItem = {
  dateKey: string;
  companyKey: string;
  titleKey: string;
  descKey: string;
  icon: TimelineIcon;
};

export type SkillItem = {
  name: string;
  value: number; // 0-100
};

export type SkillGroup = {
  groupKey: string;
  items: SkillItem[];
};

export const ABOUT_TIMELINE: TimelineItem[] = [
  {
    dateKey: 'about.timeline.items.item1.date',
    companyKey: 'about.timeline.items.item1.company',
    titleKey: 'about.timeline.items.item1.title',
    descKey: 'about.timeline.items.item1.desc',
    icon: 'work',
  },
  {
    dateKey: 'about.timeline.items.item2.date',
    companyKey: 'about.timeline.items.item2.company',
    titleKey: 'about.timeline.items.item2.title',
    descKey: 'about.timeline.items.item2.desc',
    icon: 'work',
  },
  {
    dateKey: 'about.timeline.items.item3.date',
    companyKey: 'about.timeline.items.item3.company',
    titleKey: 'about.timeline.items.item3.title',
    descKey: 'about.timeline.items.item3.desc',
    icon: 'work',
  },
  {
    dateKey: 'about.timeline.items.item4.date',
    companyKey: 'about.timeline.items.item4.company',
    titleKey: 'about.timeline.items.item4.title',
    descKey: 'about.timeline.items.item4.desc',
    icon: 'education',
  },
];

export const ABOUT_SKILL_GROUPS: SkillGroup[] = [
  {
    groupKey: 'about.skills.groups.front',
    items: [
      { name: 'React', value: 90 },
      { name: 'TypeScript', value: 85 },
      { name: 'Angular', value: 75 },
      { name: 'Vue.js', value: 70 },
    ],
  },
  {
    groupKey: 'about.skills.groups.back',
    items: [
      { name: 'Node.js', value: 85 },
      { name: 'Python', value: 80 },
      { name: 'PostgreSQL', value: 80 },
      { name: 'Java', value: 75 },
      { name: 'MongoDB', value: 75 },
    ],
  },
  {
    groupKey: 'about.skills.groups.devops',
    items: [
      { name: 'Docker', value: 70 },
      { name: 'AWS', value: 65 },
    ],
  },
  {
    groupKey: 'about.skills.groups.design',
    items: [{ name: 'Figma', value: 80 }],
  },
  {
    groupKey: 'about.skills.groups.tools',
    items: [{ name: 'Git', value: 90 }],
  },
];

export const ABOUT_SOFT_SKILLS_KEYS: string[] = [
  'about.softSkills.items.teamwork',
  'about.softSkills.items.communication',
  'about.softSkills.items.problemSolving',
  'about.softSkills.items.adaptability',
  'about.softSkills.items.timeManagement',
  'about.softSkills.items.creativity',
  'about.softSkills.items.autonomy',
  'about.softSkills.items.curiosity',
];