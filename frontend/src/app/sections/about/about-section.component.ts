import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

type TimelineItem = {
  dateKey: string;
  companyKey: string;
  titleKey: string;
  descKey: string;
};

type SkillItem = {
  name: string;
  value: number; // 0 - 100
};

type SkillGroup = {
  groupKey: string;
  items: SkillItem[];
};

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-section.component.html',
  styleUrls: ['./about-section.component.css'],
})
export class AboutSectionComponent {
  avatarUrl = '/assets/about/avatar.png';

  timeline: TimelineItem[] = [
    {
      dateKey: 'about.timeline.items.item1.date',
      companyKey: 'about.timeline.items.item1.company',
      titleKey: 'about.timeline.items.item1.title',
      descKey: 'about.timeline.items.item1.desc',
    },
    {
      dateKey: 'about.timeline.items.item2.date',
      companyKey: 'about.timeline.items.item2.company',
      titleKey: 'about.timeline.items.item2.title',
      descKey: 'about.timeline.items.item2.desc',
    },
    {
      dateKey: 'about.timeline.items.item3.date',
      companyKey: 'about.timeline.items.item3.company',
      titleKey: 'about.timeline.items.item3.title',
      descKey: 'about.timeline.items.item3.desc',
    },
    {
      dateKey: 'about.timeline.items.item4.date',
      companyKey: 'about.timeline.items.item4.company',
      titleKey: 'about.timeline.items.item4.title',
      descKey: 'about.timeline.items.item4.desc',
    },
  ];

  skillGroups: SkillGroup[] = [
    {
      groupKey: 'about.skills.groups.front',
      items: [
        { name: 'React', value: 90 },
        { name: 'Angular', value: 75 },
        { name: 'TypeScript', value: 85 },
        { name: 'Vue.js', value: 70 },
      ],
    },
    {
      groupKey: 'about.skills.groups.back',
      items: [
        { name: 'Node.js', value: 85 },
        { name: 'Java', value: 75 },
        { name: 'Python', value: 80 },
        { name: 'PostgreSQL', value: 80 },
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

  softSkillsKeys: string[] = [
    'about.softSkills.items.teamwork',
    'about.softSkills.items.communication',
    'about.softSkills.items.problemSolving',
    'about.softSkills.items.adaptability',
    'about.softSkills.items.timeManagement',
    'about.softSkills.items.creativity',
    'about.softSkills.items.autonomy',
    'about.softSkills.items.curiosity',
  ];
}