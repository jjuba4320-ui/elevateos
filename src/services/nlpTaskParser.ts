/**
 * ElevateOS Natural Language Task Parser
 * Extracts Title, Priority, Estimated Duration, Tags, and Schedule from plain text
 */
import { TaskPriority } from '../types';

export interface ParsedTaskResult {
  title: string;
  priority: TaskPriority;
  estimatedMinutes: number;
  tags: string[];
  dueDate?: string;
}

export function parseNaturalLanguageTask(input: string): ParsedTaskResult {
  let text = input.trim();
  let priority: TaskPriority = 'P3';
  let estimatedMinutes = 30;
  const tags: string[] = [];

  // 1. Extract hashtags #example
  const tagMatches = text.match(/#[\w\u0600-\u06FF]+/g);
  if (tagMatches) {
    tagMatches.forEach((tag) => {
      tags.push(tag.replace('#', ''));
    });
    text = text.replace(/#[\w\u0600-\u06FF]+/g, '').trim();
  }

  // 2. Extract priority: p1, p2, p3, p4 or !urgent / !p1
  const priorityMatch = text.match(/\b(p[1-4]|urgent|high|low)\b/i);
  if (priorityMatch) {
    const val = priorityMatch[1].toLowerCase();
    if (val === 'p1' || val === 'urgent' || val === 'high') priority = 'P1';
    else if (val === 'p2') priority = 'P2';
    else if (val === 'p3') priority = 'P3';
    else if (val === 'p4' || val === 'low') priority = 'P4';

    text = text.replace(priorityMatch[0], '').trim();
  }

  // 3. Extract duration: 25m, 45mins, 1h, 2 hours, etc.
  const durationMatch = text.match(/\b(\d+)\s*(m|min|mins|minutes|h|hr|hours)\b/i);
  if (durationMatch) {
    const amount = parseInt(durationMatch[1], 10);
    const unit = durationMatch[2].toLowerCase();
    if (unit.startsWith('h')) {
      estimatedMinutes = amount * 60;
    } else {
      estimatedMinutes = amount;
    }
    text = text.replace(durationMatch[0], '').trim();
  }

  // 4. Extract date hints: today, tomorrow, monday...
  let dueDate: string | undefined = undefined;
  const today = new Date();
  if (/\btomorrow\b/i.test(text)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    dueDate = d.toISOString().split('T')[0];
    text = text.replace(/\btomorrow\b/i, '').trim();
  } else if (/\btoday\b/i.test(text)) {
    dueDate = today.toISOString().split('T')[0];
    text = text.replace(/\btoday\b/i, '').trim();
  }

  // Clean trailing punctuation and spaces
  const cleanTitle = text.replace(/^[,\s-]+|[,\s-]+$/g, '').trim();

  return {
    title: cleanTitle || input,
    priority,
    estimatedMinutes,
    tags,
    dueDate,
  };
}
