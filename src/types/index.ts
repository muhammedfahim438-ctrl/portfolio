export interface HeroData {
  title: string;
  subtitle: string;
  voice_text: string;
  photo_url: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  github_url: string;
  featured: boolean;
  tags: string[];
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  icon_url: string;
  level: number;
}

export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  badge_image_url: string;
}

export interface WorkflowStep {
  id?: string;
  step_number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface SocialData {
  github: string;
  linkedin: string;
  kaggle: string;
  leetcode: string;
  email: string;
  phone: string;
  location: string;
  resume_pdf_url: string;
}

export interface Message {
  id?: string;
  sender_name: string;
  sender_email: string;
  message_body: string;
  created_at?: Date;
}

export interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "ascii" | "easter-egg";
}
