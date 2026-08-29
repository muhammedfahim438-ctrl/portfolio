"use client";

import {
  FiCode, FiServer, FiDatabase, FiSmartphone, FiActivity, FiZap,
  FiAward, FiStar, FiTrendingUp, FiUsers, FiGlobe, FiShield,
} from "react-icons/fi";
import {
  SiPython, SiReact, SiDjango, SiFlutter, SiPostgresql,
  SiDocker, SiGooglecloud, SiVercel, SiJavascript, SiTypescript,
  SiFirebase, SiTailwindcss, SiMongodb, SiNodedotjs, SiKubernetes,
  SiTensorflow, SiPandas,
} from "react-icons/si";

export const ICON_MAP = {
  FiCode, FiServer, FiDatabase, FiSmartphone, FiActivity, FiZap,
  FiAward, FiStar, FiTrendingUp, FiUsers, FiGlobe, FiShield,
  SiPython, SiReact, SiDjango, SiFlutter, SiPostgresql,
  SiDocker, SiGooglecloud, SiVercel, SiJavascript, SiTypescript,
  SiFirebase, SiTailwindcss, SiMongodb, SiNodedotjs, SiKubernetes,
  SiTensorflow, SiPandas,
};

export function resolveIcon(key) {
  return ICON_MAP[key] || FiCode;
}

export const ICON_KEYS = Object.keys(ICON_MAP);
